/**
 * fetch-news.mjs — tuncerbyte.com gündem sistemi
 *
 * Her haber için ayrı bir blog-style Markdown üretir.
 * Dosyalar posts/tr/news/ altına kaydedilir, 3 günden eskiler silinir.
 *
 * Kullanım:
 *   node scripts/fetch-news.mjs              → çek ve kaydet
 *   node scripts/fetch-news.mjs --dry-run    → terminale bas, kaydetme
 *   node scripts/fetch-news.mjs --force      → varsa üzerine yaz
 *   node scripts/fetch-news.mjs --date=YYYY-MM-DD
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, "..");
const NEWS_DIR   = path.join(ROOT, "posts", "tr", "news");
const DRY_RUN    = process.argv.includes("--dry-run");
const FORCE      = process.argv.includes("--force");
const DATE_ARG   = process.argv.find((a) => a.startsWith("--date="))?.split("=")[1];
const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

// ─── Yardımcılar ─────────────────────────────────────────────────────────────

const today = () => DATE_ARG ?? new Date().toISOString().split("T")[0];

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[ışğüöçİŞĞÜÖÇ]/g, (c) =>
      ({ i:"i",ı:"i",ş:"s",ğ:"g",ü:"u",ö:"o",ç:"c",İ:"i",Ş:"s",Ğ:"g",Ü:"u",Ö:"o",Ç:"c" }[c] ?? c))
    .replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 55);
}

function stripHtml(s = "") {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&#8217;|&#39;/g,"'").replace(/&#8230;/g,"…")
    .replace(/&#\d+;/g,"").replace(/&\w+;/g," ")
    .replace(/\s+/g," ").trim();
}

const truncate = (s = "", max = 230) =>
  s.length <= max ? s : s.slice(0, max).replace(/\s\S*$/, "") + "…";

async function fetchJson(url) {
  const r = await fetch(url, { headers: { "User-Agent": "tuncerbyte-news-bot/1.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return r.json();
}

async function fetchHtml(url, ms = 8000) {
  const ctrl = new AbortController();
  const t    = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } finally { clearTimeout(t); }
}

// ─── HTML İçerik Çıkarıcı ────────────────────────────────────────────────────

/** og:image, og:description, twitter:image gibi meta verileri toplar */
function extractMeta(html = "") {
  const get = (patterns) => {
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) return stripHtml(m[1]).trim();
    }
    return "";
  };
  return {
    image: get([
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ]),
    desc: get([
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{15,300})["']/i,
      /<meta[^>]+content=["']([^"']{15,300})["'][^>]+property=["']og:description["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{15,300})["']/i,
    ]),
    author: get([
      /<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']article:author["'][^>]+content=["']([^"']+)["']/i,
    ]),
    published: get([
      /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
      /<time[^>]+datetime=["']([^"']+)["']/i,
    ]),
  };
}

/**
 * HTML'den temiz makale içeriği çıkarır.
 * Navigasyon / sidebar / reklam kirliliğini agresif şekilde temizler.
 */
function extractArticle(html = "") {
  // 1. Gürültü bloklarını tamamen sil
  let clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // 2. Kirli class'lı div/section bloklarını sil (related, promo, ad, newsletter, vs.)
  const NOISE_CLASSES = [
    "related","recommend","promo","advert","sponsor","newsletter","subscribe",
    "social","share","sidebar","widget","popup","modal","cookie","banner",
    "comment","pagination","breadcrumb","author-bio","byline","tag-list",
    "most-popular","trending","footer","header","nav","menu","toc","jump-to",
    "read-more","also-read","more-stories","more-articles","see-also",
  ];
  const noiseRe = new RegExp(
    `<(?:div|section|ul|aside)[^>]*class="[^"]*(?:${NOISE_CLASSES.join("|")})[^"]*"[^>]*>[\\s\\S]*?</(?:div|section|ul|aside)>`,
    "gi"
  );
  // Birkaç tur uygula (iç içe div'ler için)
  for (let i = 0; i < 4; i++) clean = clean.replace(noiseRe, "");

  // 3. Makale gövdesini bul (article > main > body sırasıyla)
  const bodyMatch =
    clean.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    clean.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    clean.match(/<div[^>]*(?:class|id)="[^"]*(?:post|article|entry|content|story|body)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const body = bodyMatch?.[1] ?? clean;

  // 4. Görsel (ilk anlamlı <img> veya <figure>)
  const imgMatch = body.match(/<img[^>]+src=["']([^"']{10,}(?:jpg|jpeg|png|webp|gif)[^"']*)["'][^>]*(?:alt=["']([^"']*)["'])?/i);
  const firstImage = imgMatch ? { src: imgMatch[1], alt: imgMatch[2] ?? "" } : null;

  // 5. Paragrafları topla — kısa / gereksiz olanları filtrele
  const paragraphs = [];
  for (const m of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = stripHtml(m[1]).trim();
    if (t.length < 70) continue;
    if (/cookie|privacy policy|all rights reserved|copyright|subscribe|newsletter|sign up|log in|sign in/i.test(t)) continue;
    if (/^(share|tweet|email|print|by |updated|published)/i.test(t)) continue;
    paragraphs.push(t);
    if (paragraphs.length >= 8) break;
  }

  // 6. Makale içi gerçek h2/h3 başlıklarını topla
  //    Kural: başlığın hemen ardından en az bir <p> gelmelidir
  const headings = [];
  const hRe = /<h([23])[^>]*>([\s\S]*?)<\/h[23]>([\s\S]{0,600})/gi;
  for (const m of body.matchAll(hRe)) {
    const text = stripHtml(m[2]).trim();
    const after = m[3] || "";
    if (text.length < 4 || text.length > 100) continue;
    if (/<p[^>]*>/.test(after)) {          // gerçek içerik başlığı
      headings.push(text);
      if (headings.length >= 5) break;
    }
  }

  // 7. Blok alıntı
  const blockquote = (() => {
    const m = body.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
    return m ? truncate(stripHtml(m[1]), 280) : "";
  })();

  return { paragraphs, headings, blockquote, firstImage };
}

// ─── Markdown Şablonu ─────────────────────────────────────────────────────────

function buildMarkdown({ title, date, url, source, tags, meta, article, score, hnUrl, readingTime, author }) {
  const desc    = truncate(meta.desc || article.paragraphs[0] || "", 230);
  const imgAlt  = title.replace(/"/g, "'");

  // — Frontmatter —
  const fm = `---
title: "${title.replace(/"/g, "'")}"
date: "${date}"
excerpt: "${desc.replace(/"/g, "'")}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
category: "Gündem"
---`;

  const lines = [];

  // — Kapak görseli (og:image öncelikli, sonra ilk makale içi img) —
  const coverImg = meta.image || article.firstImage?.src || "";
  if (coverImg) {
    lines.push(`![${imgAlt}](${coverImg})\n`);
  }

  // — Kaynak rozeti —
  lines.push(`> **Kaynak:** ${source}${score ? `  &nbsp;·&nbsp;  **Puan:** ${score}` : ""}${readingTime ? `  &nbsp;·&nbsp;  **${readingTime} dk okuma**` : ""}${(meta.author || author) ? `  &nbsp;·&nbsp;  **Yazar:** ${meta.author || author}` : ""}\n`);

  // — Giriş —
  const intro = meta.desc || article.paragraphs[0] || "";
  if (intro) lines.push(`**${truncate(intro, 200)}**\n`);

  // — Paragraflar —
  const bodyParas = meta.desc ? article.paragraphs.slice(0, 6) : article.paragraphs.slice(1, 6);
  if (bodyParas.length > 0) {
    lines.push(bodyParas.join("\n\n") + "\n");
  }

  // — Blok alıntı —
  if (article.blockquote) {
    lines.push(`> ${article.blockquote}\n`);
  }

  // — İçerik başlıkları —
  if (article.headings.length > 0) {
    lines.push(`## Yazıda Neler Var?\n`);
    article.headings.forEach((h) => lines.push(`- ${h}`));
    lines.push("");
  }

  // — Footer —
  lines.push("---\n");

  const footerLinks = [`[Orijinal makaleyi oku →](${url})`];
  if (hnUrl) footerLinks.push(`[Hacker News tartışması →](${hnUrl})`);
  lines.push(footerLinks.join(" &nbsp;·&nbsp; ") + "\n");

  lines.push("_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._");

  return [fm, "", lines.join("\n")].join("\n");
}

// ─── Temizlik ─────────────────────────────────────────────────────────────────

function cleanup() {
  if (!fs.existsSync(NEWS_DIR)) return;
  const now = Date.now();
  let n = 0;
  for (const f of fs.readdirSync(NEWS_DIR)) {
    if (!f.endsWith(".md")) continue;
    const fp = path.join(NEWS_DIR, f);
    if (Date.now() - fs.statSync(fp).mtimeMs > MAX_AGE_MS) {
      fs.unlinkSync(fp);
      n++;
      console.log(`🗑  Silindi: ${f}`);
    }
  }
  if (n) console.log(`   ${n} eski haber temizlendi.\n`);
}

function savePost(slug, markdown) {
  const fp = path.join(NEWS_DIR, `${slug}.md`);
  if (fs.existsSync(fp) && !FORCE) return false;
  if (!DRY_RUN) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
    fs.writeFileSync(fp, markdown, "utf8");
  }
  return true;
}

// ─── Hacker News ─────────────────────────────────────────────────────────────

async function processHN(limit = 12) {
  console.log("📡 Hacker News...");
  const ids = await fetchJson("https://hacker-news.firebaseio.com/v0/topstories.json");
  const raws = await Promise.allSettled(
    ids.slice(0, 40).map((id) => fetchJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
  );
  const stories = raws
    .filter((r) => r.status === "fulfilled" && r.value?.url)
    .map((r) => r.value)
    .filter((s) => s.type !== "job" && !/who is hiring/i.test(s.title || ""))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);

  let saved = 0;
  for (const s of stories) {
    const date = today();
    const slug = `haber-hn-${slugify(s.title)}-${date}`;
    if (fs.existsSync(path.join(NEWS_DIR, `${slug}.md`)) && !FORCE) { process.stdout.write("."); continue; }

    let meta = { image:"", desc:"", author:"", published:"" };
    let article = { paragraphs:[], headings:[], blockquote:"", firstImage:null };
    try {
      const html = await fetchHtml(s.url);
      meta    = extractMeta(html);
      article = extractArticle(html);
    } catch { /* timeout / erişim engeli */ }

    const md = buildMarkdown({
      title: s.title, date, url: s.url,
      source: "Hacker News",
      tags: ["Gündem", "Hacker News", "Developer"],
      meta, article,
      score: s.score,
      hnUrl: `https://news.ycombinator.com/item?id=${s.id}`,
    });

    if (DRY_RUN) { console.log(`\n── HN: ${s.title}\n${md.slice(0,800)}\n…\n`); }
    else         { savePost(slug, md); console.log(`  ✓ ${slug}.md`); }
    saved++;
  }
  console.log(`  → ${saved} HN haberi\n`);
}

// ─── Dev.to ──────────────────────────────────────────────────────────────────

const DEVTO_TAGS = ["ai","machinelearning","javascript","webdev","typescript","opensource"];

async function processDevTo(perTag = 3) {
  console.log("📡 Dev.to...");
  const all = [];

  await Promise.allSettled(
    DEVTO_TAGS.map(async (tag) => {
      try {
        const articles = await fetchJson(`https://dev.to/api/articles?tag=${tag}&top=1&per_page=${perTag}`);
        for (const a of articles) {
          let full = {};
          try { full = await fetchJson(`https://dev.to/api/articles/${a.id}`); } catch {}
          all.push({ ...a, bodyMd: full.body_markdown || "", tag });
        }
      } catch (e) { console.warn(`  ⚠ Dev.to #${tag}: ${e.message}`); }
    })
  );

  const seen = new Set();
  const unique = all
    .sort((a,b) => (b.positive_reactions_count||0) - (a.positive_reactions_count||0))
    .filter((a) => { if (seen.has(a.id)) return false; seen.add(a.id); return true; })
    .slice(0, 12);

  let saved = 0;
  for (const a of unique) {
    const date = today();
    const slug = `haber-devto-${slugify(a.title)}-${date}`;
    if (fs.existsSync(path.join(NEWS_DIR, `${slug}.md`)) && !FORCE) { process.stdout.write("."); continue; }

    // Markdown gövdesinden paragraf ve başlık çıkar
    const paragraphs = (a.bodyMd || "")
      .split(/\n{2,}/)
      .map((p) => p.replace(/^#+\s*|!\[.*?\]\(.*?\)|[*_`]/g, "").trim())
      .filter((p) => p.length > 70 && !/^(https?:|>|\||-)/.test(p))
      .slice(0, 7);

    const headings = [...(a.bodyMd || "").matchAll(/^#{2,3}\s+(.+)/gm)]
      .map((m) => m[1].trim()).slice(0, 5);

    const coverImg = a.cover_image || a.social_image || "";

    const meta = {
      image:  coverImg,
      desc:   stripHtml(a.description || ""),
      author: a.user?.name || "",
      published: a.published_at || "",
    };

    const md = buildMarkdown({
      title: a.title, date, url: a.url,
      source: "Dev.to",
      tags: ["Gündem", "Dev.to", a.tag, ...(a.tag_list?.slice(0,2)||[])].filter(Boolean),
      meta,
      article: { paragraphs, headings, blockquote:"", firstImage: coverImg ? { src:coverImg, alt:a.title } : null },
      readingTime: a.reading_time_minutes,
      author: a.user?.name,
    });

    if (DRY_RUN) { console.log(`\n── Dev.to: ${a.title}\n${md.slice(0,800)}\n…\n`); }
    else         { savePost(slug, md); console.log(`  ✓ ${slug}.md`); }
    saved++;
  }
  console.log(`  → ${saved} Dev.to makalesi\n`);
}

// ─── RSS ─────────────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  { name:"TechCrunch AI",     url:"https://techcrunch.com/category/artificial-intelligence/feed/", tags:["AI","Teknoloji"] },
  { name:"The Verge",         url:"https://www.theverge.com/rss/index.xml",                        tags:["Teknoloji","Ürün"] },
  { name:"CSS-Tricks",        url:"https://css-tricks.com/feed/",                                   tags:["Frontend","CSS","Web"] },
  { name:"Smashing Magazine", url:"https://www.smashingmagazine.com/feed/",                         tags:["Frontend","UX","Web"] },
];

async function processRSS(perFeed = 4) {
  console.log("📡 RSS...");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

  for (const feed of RSS_FEEDS) {
    let items = [];
    try {
      const xml    = await fetchHtml(feed.url);
      const parsed = parser.parse(xml);
      const ch     = parsed?.rss?.channel || parsed?.feed;
      if (!ch) continue;
      const raw = ch.item || ch.entry || [];
      items = (Array.isArray(raw) ? raw : [raw]).slice(0, perFeed);
    } catch (e) { console.warn(`  ⚠ ${feed.name}: ${e.message}`); continue; }

    let saved = 0;
    for (const item of items) {
      const title = stripHtml(
        typeof item.title === "string" ? item.title : item.title?.["#text"] || ""
      ).trim();
      const link =
        item.link?.["@_href"] ||
        (typeof item.link === "string" ? item.link : "") ||
        item.url || "";

      if (!title || !link) continue;

      const date = today();
      const slug = `haber-${slugify(feed.name)}-${slugify(title)}-${date}`;
      if (fs.existsSync(path.join(NEWS_DIR, `${slug}.md`)) && !FORCE) { process.stdout.write("."); continue; }

      // RSS tam içerik varsa kullan (CSS-Tricks, Smashing Magazine genellikle verir)
      const rssBody = typeof item["content:encoded"] === "string"
        ? item["content:encoded"]
        : typeof item.description === "string" ? item.description : "";

      let meta    = { image:"", desc:"", author:"", published:"" };
      let article = { paragraphs:[], headings:[], blockquote:"", firstImage:null };

      if (rssBody.length > 500) {
        // RSS içeriği yeterince zenginse direkt kullan
        meta.desc = truncate(stripHtml(rssBody), 230);
        article   = extractArticle(rssBody);
      }

      // meta image her durumda URL'den çek
      try {
        const html = await fetchHtml(link);
        const m    = extractMeta(html);
        if (m.image)  meta.image  = m.image;
        if (!meta.desc && m.desc) meta.desc = m.desc;
        if (!meta.author) meta.author = m.author;
        if (article.paragraphs.length < 2) {
          const a = extractArticle(html);
          if (a.paragraphs.length > article.paragraphs.length) article = a;
        }
      } catch { /* erişim engeli */ }

      const md = buildMarkdown({
        title, date, url: link,
        source: feed.name,
        tags: ["Gündem", feed.name, ...feed.tags],
        meta, article,
      });

      if (DRY_RUN) { console.log(`\n── ${feed.name}: ${title}\n${md.slice(0,800)}\n…\n`); }
      else         { savePost(slug, md); console.log(`  ✓ ${slug}.md`); }
      saved++;
    }
    if (!DRY_RUN) console.log(`  → ${feed.name}: ${saved} haber`);
  }
  console.log("");
}

// ─── Ana akış ─────────────────────────────────────────────────────────────────

async function main() {
  if (!DRY_RUN) { cleanup(); fs.mkdirSync(NEWS_DIR, { recursive:true }); }

  await processHN();
  await processDevTo();
  await processRSS();

  if (!DRY_RUN) {
    const count = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".md")).length;
    console.log(`✅ Aktif haber dosyası: ${count}`);
  }
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
