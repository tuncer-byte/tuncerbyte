/**
 * fetch-news.mjs
 *
 * Her haber kaynağı için ayrı bir Markdown blog yazısı oluşturur.
 * Dosyalar posts/tr/news/ klasörüne kaydedilir, 3 günden eski olanlar silinir.
 *
 * Kullanım:
 *   node scripts/fetch-news.mjs              # çek ve kaydet
 *   node scripts/fetch-news.mjs --dry-run    # kaydetme, terminale bas
 *   node scripts/fetch-news.mjs --force      # zaten varsa üzerine yaz
 *   node scripts/fetch-news.mjs --date=2026-03-25
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
const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000; // 3 gün

// ─── Yardımcı ──────────────────────────────────────────────────────────────

function today() {
  return DATE_ARG ?? new Date().toISOString().split("T")[0];
}

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[ışğüöçİŞĞÜÖÇ]/g, (c) =>
      ({ i:"i",ı:"i",ş:"s",ğ:"g",ü:"u",ö:"o",ç:"c",
         İ:"i",Ş:"s",Ğ:"g",Ü:"u",Ö:"o",Ç:"c" }[c] ?? c)
    )
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 55);
}

function stripHtml(str = "") {
  return str
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&#8217;/g,"'").replace(/&#8230;/g,"…")
    .replace(/&#\d+;/g,"").replace(/&\w+;/g," ")
    .replace(/\s+/g," ").trim();
}

function truncate(str = "", max = 230) {
  if (str.length <= max) return str;
  return str.slice(0, max).replace(/\s\S*$/, "") + "…";
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "tuncerbyte-news-bot/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchHtml(url, ms = 7000) {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// ─── HTML içerik çıkarıcı ──────────────────────────────────────────────────

/**
 * HTML'den okunabilir içerik çeker.
 * Önce <article> / <main> arar, yoksa <body> içindeki <p> taglarını alır.
 * Kısa veya gereksiz paragrafları filtreler.
 */
function extractContent(html = "") {
  // script/style/nav/header/footer kaldır
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // article veya main bloğu bul
  const articleMatch =
    cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    cleaned.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    cleaned.match(/<div[^>]*class="[^"]*(?:content|post|article|entry)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

  const body = articleMatch ? articleMatch[1] : cleaned;

  // h2/h3 başlıklarını topla
  const headings = [];
  const hMatches = body.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi);
  for (const m of hMatches) {
    const text = stripHtml(m[1]).trim();
    if (text.length > 3 && text.length < 120) headings.push(text);
    if (headings.length >= 4) break;
  }

  // p taglarını çıkar
  const paragraphs = [];
  const pMatches = body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const m of pMatches) {
    const text = stripHtml(m[1]).trim();
    // çok kısa, sadece link, veya cookie/copyright gibi genel metinleri atla
    if (text.length < 60) continue;
    if (/cookie|copyright|all rights reserved|privacy policy/i.test(text)) continue;
    paragraphs.push(text);
    if (paragraphs.length >= 7) break;
  }

  return { paragraphs, headings };
}

function extractMeta(html = "") {
  const og   = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{15,300})["']/i);
  if (og) return stripHtml(og[1]);
  const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{15,300})["']/i);
  if (meta) return stripHtml(meta[1]);
  return "";
}

// ─── Markdown şablonu ──────────────────────────────────────────────────────

function buildPostMarkdown({ title, date, url, source, sourceMeta, tags, paragraphs, headings, score, comments, hnUrl, readingTime, author }) {
  const desc = truncate(sourceMeta || paragraphs[0] || "", 230);

  const fm = `---
title: "${title.replace(/"/g, "'")}"
date: "${date}"
excerpt: "${desc.replace(/"/g, "'")}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
category: "Gündem"
---`;

  // Giriş: kaynak açıklaması veya ilk paragraf kalın
  const intro = sourceMeta
    ? `**${truncate(sourceMeta, 200)}**`
    : paragraphs[0]
    ? `**${truncate(paragraphs[0], 200)}**`
    : "";

  // Gövde paragrafları (ilkini zaten intro olarak aldık)
  const bodyParas = sourceMeta
    ? paragraphs.slice(0, 5)
    : paragraphs.slice(1, 5);

  let body = intro ? intro + "\n\n" : "";

  if (bodyParas.length > 0) {
    body += bodyParas.join("\n\n") + "\n\n";
  }

  // Başlıklar bölümü
  if (headings.length > 0) {
    body += `## İçerik Başlıkları\n\n`;
    headings.forEach((h) => { body += `- ${h}\n`; });
    body += "\n";
  }

  // Meta bilgi
  const metaLines = [];
  if (source)      metaLines.push(`**Kaynak:** ${source}`);
  if (author)      metaLines.push(`**Yazar:** ${author}`);
  if (readingTime) metaLines.push(`**Okuma süresi:** ${readingTime} dk`);
  if (score)       metaLines.push(`**Puan:** ${score}`);

  const footer = [
    "---",
    "",
    metaLines.join(" &nbsp;·&nbsp; "),
    "",
    hnUrl
      ? `[Orijinal makaleyi oku](${url}) &nbsp;·&nbsp; [Hacker News tartışması](${hnUrl})`
      : `[Orijinal makaleyi oku](${url})`,
    "",
    "_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._",
  ].join("\n");

  return [fm, "", body.trim(), "", footer].join("\n");
}

// ─── Eski dosyaları temizle ────────────────────────────────────────────────

function cleanup() {
  if (!fs.existsSync(NEWS_DIR)) return;
  const now   = Date.now();
  let deleted = 0;
  for (const f of fs.readdirSync(NEWS_DIR)) {
    if (!f.endsWith(".md")) continue;
    const fp    = path.join(NEWS_DIR, f);
    const stat  = fs.statSync(fp);
    const age   = now - stat.mtimeMs;
    if (age > MAX_AGE_MS) {
      fs.unlinkSync(fp);
      deleted++;
      console.log(`🗑  Silindi (${Math.round(age / 86400000)}g): ${f}`);
    }
  }
  if (deleted) console.log(`   ${deleted} eski haber temizlendi.\n`);
}

// ─── Haber kaydedici ──────────────────────────────────────────────────────

function savePost(slug, markdown) {
  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  if (fs.existsSync(filePath) && !FORCE) return false; // zaten var
  if (!DRY_RUN) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
    fs.writeFileSync(filePath, markdown, "utf8");
  }
  return true;
}

// ─── Hacker News ───────────────────────────────────────────────────────────

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

async function processHN(limit = 12) {
  console.log("📡 Hacker News işleniyor...");
  const ids     = await fetchJson(`${HN_BASE}/topstories.json`);
  const raw     = await Promise.allSettled(
    ids.slice(0, 35).map((id) => fetchJson(`${HN_BASE}/item/${id}.json`))
  );
  const stories = raw
    .filter((r) => r.status === "fulfilled" && r.value?.url)
    .map((r) => r.value)
    .filter((s) => s.type !== "job" && !/who is hiring/i.test(s.title))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);

  let saved = 0;
  for (const s of stories) {
    const date  = today();
    const slug  = `haber-hn-${slugify(s.title)}-${date}`;
    const filePath = path.join(NEWS_DIR, `${slug}.md`);
    if (fs.existsSync(filePath) && !FORCE) { process.stdout.write("."); continue; }

    let paragraphs = [], headings = [], meta = "";
    try {
      const html = await fetchHtml(s.url);
      meta       = extractMeta(html);
      const res  = extractContent(html);
      paragraphs = res.paragraphs;
      headings   = res.headings;
    } catch { /* timeout veya hata — meta ve paragraf boş kalır */ }

    const tags = ["Gündem", "Hacker News", "Developer"];

    const markdown = buildPostMarkdown({
      title: s.title, date, url: s.url,
      source: "Hacker News", sourceMeta: meta,
      tags, paragraphs, headings,
      score: s.score, comments: s.descendants || 0,
      hnUrl: `https://news.ycombinator.com/item?id=${s.id}`,
    });

    if (DRY_RUN) {
      console.log(`\n── HN: ${s.title} ──\n`);
      console.log(markdown.slice(0, 600) + "\n…\n");
    } else {
      savePost(slug, markdown);
      console.log(`  ✓ ${slug}.md`);
    }
    saved++;
  }
  console.log(`  → ${saved} Hacker News haberi`);
}

// ─── Dev.to ────────────────────────────────────────────────────────────────

const DEVTO_TAGS = ["ai","machinelearning","javascript","webdev","typescript","opensource"];

async function processDevTo(perTag = 3) {
  console.log("\n📡 Dev.to işleniyor...");
  const all = [];

  await Promise.allSettled(
    DEVTO_TAGS.map(async (tag) => {
      try {
        const articles = await fetchJson(
          `https://dev.to/api/articles?tag=${tag}&top=1&per_page=${perTag}`
        );
        for (const a of articles) {
          // Tam içeriği al
          let bodyMd = "";
          try {
            const full = await fetchJson(`https://dev.to/api/articles/${a.id}`);
            bodyMd = full.body_markdown || "";
          } catch {}
          all.push({ ...a, bodyMd, tag });
        }
      } catch (e) {
        console.warn(`  ⚠ Dev.to #${tag}: ${e.message}`);
      }
    })
  );

  // Tekilleştir + reaksiyon sırala
  const seen = new Set();
  const unique = all
    .sort((a, b) => (b.positive_reactions_count || 0) - (a.positive_reactions_count || 0))
    .filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    })
    .slice(0, 12);

  let saved = 0;
  for (const a of unique) {
    const date  = today();
    const slug  = `haber-devto-${slugify(a.title)}-${date}`;
    const filePath = path.join(NEWS_DIR, `${slug}.md`);
    if (fs.existsSync(filePath) && !FORCE) { process.stdout.write("."); continue; }

    // bodyMd'den ilk paragrafları al
    const paragraphs = a.bodyMd
      ? a.bodyMd
          .split(/\n{2,}/)
          .map((p) => p.replace(/^#+\s*/, "").replace(/[*_`]/g, "").trim())
          .filter((p) => p.length > 60 && !p.startsWith("!") && !p.startsWith("["))
          .slice(0, 6)
      : [];

    const headings = a.bodyMd
      ? [...a.bodyMd.matchAll(/^#{2,3}\s+(.+)/gm)]
          .map((m) => m[1].trim())
          .slice(0, 4)
      : [];

    const tags = ["Gündem", "Dev.to", a.tag,
      ...(a.tags?.slice(0, 2) || [])
    ].filter(Boolean);

    const markdown = buildPostMarkdown({
      title: a.title, date, url: a.url,
      source: "Dev.to", sourceMeta: stripHtml(a.description || ""),
      tags, paragraphs, headings,
      author: a.user?.name, readingTime: a.reading_time_minutes,
    });

    if (DRY_RUN) {
      console.log(`\n── Dev.to: ${a.title} ──\n`);
      console.log(markdown.slice(0, 600) + "\n…\n");
    } else {
      savePost(slug, markdown);
      console.log(`  ✓ ${slug}.md`);
    }
    saved++;
  }
  console.log(`  → ${saved} Dev.to makalesi`);
}

// ─── RSS ───────────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  { name: "TechCrunch AI",     url: "https://techcrunch.com/category/artificial-intelligence/feed/", tags: ["AI", "Teknoloji"] },
  { name: "The Verge",         url: "https://www.theverge.com/rss/index.xml",                        tags: ["Teknoloji", "Ürün"] },
  { name: "CSS-Tricks",        url: "https://css-tricks.com/feed/",                                   tags: ["Frontend", "CSS", "Web"] },
  { name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/",                         tags: ["Frontend", "UX", "Web"] },
];

async function processRSS(perFeed = 4) {
  console.log("\n📡 RSS işleniyor...");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

  for (const feed of RSS_FEEDS) {
    let items = [];
    try {
      const xml    = await fetchHtml(feed.url);
      const parsed = parser.parse(xml);
      const ch     = parsed?.rss?.channel || parsed?.feed;
      if (!ch) continue;
      const raw  = ch.item || ch.entry || [];
      items = (Array.isArray(raw) ? raw : [raw]).slice(0, perFeed);
    } catch (e) {
      console.warn(`  ⚠ ${feed.name}: ${e.message}`);
      continue;
    }

    let saved = 0;
    for (const item of items) {
      const title = stripHtml(
        typeof item.title === "string" ? item.title : item.title?.["#text"] || ""
      ).trim();
      const link  =
        item.link?.["@_href"] ||
        (typeof item.link === "string" ? item.link : "") ||
        item.url || "";

      if (!title || !link) continue;

      const date = today();
      const slug = `haber-${slugify(feed.name)}-${slugify(title)}-${date}`;
      const filePath = path.join(NEWS_DIR, `${slug}.md`);
      if (fs.existsSync(filePath) && !FORCE) { process.stdout.write("."); continue; }

      // RSS'teki içerik
      const rssContent = stripHtml(
        typeof item["content:encoded"] === "string" ? item["content:encoded"] :
        typeof item.description === "string"        ? item.description :
        item.summary?.["#text"] || item.summary || ""
      );

      let paragraphs = [], headings = [], meta = "";
      if (rssContent.length > 200) {
        // RSS'in kendi içeriği yeterince zenginse kullan
        paragraphs = rssContent.split(/\n{2,}/)
          .map((p) => p.trim())
          .filter((p) => p.length > 60)
          .slice(0, 5);
        meta = truncate(rssContent, 230);
      } else {
        // Sayfayı çek
        try {
          const html = await fetchHtml(link);
          meta       = extractMeta(html);
          const res  = extractContent(html);
          paragraphs = res.paragraphs;
          headings   = res.headings;
        } catch {}
      }

      const tags = ["Gündem", feed.name, ...feed.tags];

      const markdown = buildPostMarkdown({
        title, date, url: link,
        source: feed.name, sourceMeta: meta,
        tags, paragraphs, headings,
      });

      if (DRY_RUN) {
        console.log(`\n── ${feed.name}: ${title} ──\n`);
        console.log(markdown.slice(0, 600) + "\n…\n");
      } else {
        savePost(slug, markdown);
        console.log(`  ✓ ${slug}.md`);
      }
      saved++;
    }
    if (!DRY_RUN) console.log(`  → ${feed.name}: ${saved} haber`);
  }
}

// ─── Ana akış ──────────────────────────────────────────────────────────────

async function main() {
  // 1. Eski dosyaları temizle
  if (!DRY_RUN) cleanup();

  // 2. Klasörü oluştur
  if (!DRY_RUN) fs.mkdirSync(NEWS_DIR, { recursive: true });

  // 3. Kaynak başına haberler
  await processHN();
  await processDevTo();
  await processRSS();

  const count = fs.existsSync(NEWS_DIR) ? fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".md")).length : 0;
  console.log(`\n✅ Toplam aktif haber dosyası: ${count}`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
