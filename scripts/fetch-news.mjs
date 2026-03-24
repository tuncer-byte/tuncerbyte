/**
 * fetch-news.mjs
 *
 * Günlük developer haberlerini toplar ve posts/tr/ altına Markdown olarak kaydeder.
 *
 * Kaynaklar:
 *   - Hacker News API  (ücretsiz, auth yok) + sayfa meta açıklaması
 *   - Dev.to API       (ücretsiz, auth yok) + makale açıklaması
 *   - RSS              (TechCrunch AI, Smashing Magazine, CSS-Tricks, The Verge)
 *
 * Kullanım:
 *   node scripts/fetch-news.mjs
 *   node scripts/fetch-news.mjs --dry-run
 *   node scripts/fetch-news.mjs --force
 *   node scripts/fetch-news.mjs --date=2026-03-25
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "posts", "tr");

const DRY_RUN  = process.argv.includes("--dry-run");
const FORCE    = process.argv.includes("--force");
const DATE_ARG = process.argv.find((a) => a.startsWith("--date="))?.split("=")[1];

// ─── Yardımcı ──────────────────────────────────────────────────────────────

function today() {
  if (DATE_ARG) return DATE_ARG;
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "tuncerbyte-news-bot/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchText(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; tuncerbyte-news-bot/1.0)",
      },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** HTML etiketlerini ve fazla boşlukları temizler */
function stripHtml(str = "") {
  return str
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8230;/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

/** og:description veya meta description çeker; hata/timeout → "" */
async function fetchMetaDesc(url) {
  try {
    const html = await fetchText(url, 5000);
    const og = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{10,300})["']/i);
    if (og) return stripHtml(og[1]);
    const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,300})["']/i);
    if (meta) return stripHtml(meta[1]);
    return "";
  } catch {
    return "";
  }
}

function truncate(str, max = 220) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).replace(/\s\S*$/, "") + "…";
}

function dedup(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.title.toLowerCase().replace(/\W/g, "").slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Hacker News ───────────────────────────────────────────────────────────

const HN_BASE       = "https://hacker-news.firebaseio.com/v0";
const HN_SKIP_WORDS = ["hiring", "ask hn: who is hiring", "freelancer"];

async function fetchHN(limit = 12) {
  console.log("📡 Hacker News alınıyor...");
  const ids    = await fetchJson(`${HN_BASE}/topstories.json`);
  const top    = ids.slice(0, 40);

  const stories = (
    await Promise.allSettled(top.map((id) => fetchJson(`${HN_BASE}/item/${id}.json`)))
  )
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value)
    .filter((s) => {
      if (s.type === "job") return false;
      if (!s.url) return false;
      const t = (s.title || "").toLowerCase();
      return !HN_SKIP_WORDS.some((w) => t.includes(w));
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);

  console.log(`  ↳ ${stories.length} hikaye için meta açıklama çekiliyor...`);

  const withDesc = await Promise.all(
    stories.map(async (s) => {
      const desc = await fetchMetaDesc(s.url);
      return {
        title:    s.title,
        url:      s.url,
        desc:     truncate(desc),
        score:    s.score    || 0,
        comments: s.descendants || 0,
        hn:       `https://news.ycombinator.com/item?id=${s.id}`,
      };
    })
  );

  console.log(`  ✓ Hacker News: ${withDesc.length} haber`);
  return withDesc;
}

// ─── Dev.to ────────────────────────────────────────────────────────────────

const DEVTO_TAGS = [
  "ai",
  "machinelearning",
  "javascript",
  "webdev",
  "typescript",
  "opensource",
];

async function fetchDevTo(perTag = 3) {
  console.log("📡 Dev.to alınıyor...");
  const all = [];

  await Promise.allSettled(
    DEVTO_TAGS.map(async (tag) => {
      try {
        const articles = await fetchJson(
          `https://dev.to/api/articles?tag=${tag}&top=1&per_page=${perTag}`
        );
        articles.forEach((a) => {
          all.push({
            title:       a.title,
            url:         a.url,
            desc:        truncate(stripHtml(a.description || ""), 220),
            tag,
            readingTime: a.reading_time_minutes,
            reactions:   a.positive_reactions_count || 0,
            author:      a.user?.name || "",
            cover:       a.cover_image || a.social_image || "",
          });
        });
      } catch (e) {
        console.warn(`  ⚠ Dev.to tag=${tag} atlandı: ${e.message}`);
      }
    })
  );

  const sorted = all.sort((a, b) => b.reactions - a.reactions).slice(0, 10);
  console.log(`  ✓ Dev.to: ${sorted.length} makale`);
  return sorted;
}

// ─── RSS ───────────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  { name: "TechCrunch AI",    url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "The Verge",        url: "https://www.theverge.com/rss/index.xml" },
  { name: "CSS-Tricks",       url: "https://css-tricks.com/feed/" },
  { name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/" },
];

async function fetchRSS(perFeed = 4) {
  console.log("📡 RSS besleme alınıyor...");
  const parser  = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const results = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const xml    = await fetchText(feed.url);
        const parsed = parser.parse(xml);
        const channel =
          parsed?.rss?.channel || parsed?.feed || null;

        if (!channel) {
          console.warn(`  ⚠ ${feed.name}: format tanınamadı`);
          return;
        }

        const rawItems = channel.item || channel.entry || [];
        const items    = Array.isArray(rawItems) ? rawItems : [rawItems];

        let added = 0;
        for (const item of items) {
          if (added >= perFeed) break;

          const title =
            typeof item.title === "string"
              ? item.title
              : item.title?.["#text"] || "";

          const link =
            item.link?.["@_href"] ||
            (typeof item.link === "string" ? item.link : "") ||
            item.url || "";

          // Açıklama: description → summary → content:encoded → boş
          const rawDesc =
            item.description ||
            item.summary?.["#text"] ||
            item.summary ||
            item["content:encoded"] ||
            item.content?.["#text"] ||
            item.content ||
            "";

          const desc = truncate(stripHtml(typeof rawDesc === "string" ? rawDesc : ""), 220);

          const pubDate =
            item.pubDate || item.published || item.updated || "";

          if (title && link) {
            results.push({
              source:  feed.name,
              title:   title.trim(),
              url:     typeof link === "string" ? link : "",
              desc,
              date:    pubDate,
            });
            added++;
          }
        }

        console.log(`  ✓ ${feed.name}: ${added} haber`);
      } catch (e) {
        console.warn(`  ⚠ ${feed.name} atlandı: ${e.message}`);
      }
    })
  );

  return results;
}

// ─── Markdown Üretici ──────────────────────────────────────────────────────

function buildMarkdown({ date, hn, devto, rss }) {
  const humanDate  = formatDate(date);
  const totalCount = hn.length + devto.length + rss.length;

  const frontmatter = `---
title: "Gündem: ${humanDate} — Developer Haberleri"
date: "${date}"
excerpt: "Bugünün öne çıkan developer haberleri: Hacker News, Dev.to ve tech bloglarından ${totalCount} haber derlendi."
tags: ["Gündem", "Haberler", "Developer", "Teknoloji", "Yapay Zeka", "Web"]
category: "Gündem"
---

Bugünün developer gündeminden öne çıkan haberler — Hacker News, Dev.to ve popüler tech bloglarından derlendi.

---
`;

  // ── Hacker News ──
  let hnSection = `## Hacker News\n\n`;
  if (hn.length === 0) {
    hnSection += `_Bugün haber alınamadı._\n`;
  } else {
    hn.forEach((s) => {
      hnSection += `### [${s.title}](${s.url})\n\n`;
      if (s.desc) hnSection += `${s.desc}\n\n`;
      hnSection += `**Puan:** ${s.score} &nbsp;·&nbsp; **[${s.comments} yorum](${s.hn})**\n\n---\n\n`;
    });
  }

  // ── Dev.to ──
  let devtoSection = `## Dev.to\n\n`;
  if (devto.length === 0) {
    devtoSection += `_Bugün makale alınamadı._\n`;
  } else {
    const byTag = {};
    devto.forEach((a) => {
      if (!byTag[a.tag]) byTag[a.tag] = [];
      byTag[a.tag].push(a);
    });

    Object.entries(byTag).forEach(([tag, articles]) => {
      devtoSection += `### #${tag}\n\n`;
      articles.forEach((a) => {
        devtoSection += `#### [${a.title}](${a.url})\n\n`;
        if (a.desc) devtoSection += `${a.desc}\n\n`;
        const meta = [
          a.author  ? `**Yazar:** ${a.author}`               : "",
          a.readingTime ? `**Okuma süresi:** ${a.readingTime} dk` : "",
          a.reactions   ? `**Reaksiyon:** ${a.reactions}`        : "",
        ]
          .filter(Boolean)
          .join(" &nbsp;·&nbsp; ");
        if (meta) devtoSection += `${meta}\n\n`;
      });
    });
  }

  // ── RSS / Tech Bloglar ──
  let rssSection = `## Tech Bloglar\n\n`;
  if (rss.length === 0) {
    rssSection += `_Bugün haber alınamadı._\n`;
  } else {
    const bySource = {};
    rss.forEach((r) => {
      if (!bySource[r.source]) bySource[r.source] = [];
      bySource[r.source].push(r);
    });

    Object.entries(bySource).forEach(([source, items]) => {
      rssSection += `### ${source}\n\n`;
      items.forEach((r) => {
        rssSection += `#### [${r.title}](${r.url})\n\n`;
        if (r.desc) rssSection += `${r.desc}\n\n`;
      });
    });
  }

  const footer = `---

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._`;

  return [frontmatter, hnSection, devtoSection, rssSection, footer].join("\n");
}

// ─── Ana Akış ──────────────────────────────────────────────────────────────

async function main() {
  const date       = today();
  const outputFile = path.join(POSTS_DIR, `gundem-${date}.md`);

  if (!DRY_RUN && fs.existsSync(outputFile) && !FORCE) {
    console.log(`⚠  ${outputFile} zaten var. Üzerine yazmak için --force ekle.`);
    process.exit(0);
  }

  let hn = [], devto = [], rss = [];

  try { hn    = dedup(await fetchHN());    } catch (e) { console.warn("HN hatası:",     e.message); }
  try { devto = dedup(await fetchDevTo()); } catch (e) { console.warn("Dev.to hatası:", e.message); }
  try { rss   = dedup(await fetchRSS());   } catch (e) { console.warn("RSS hatası:",    e.message); }

  console.log(`\n✅ Toplam: HN ${hn.length} | Dev.to ${devto.length} | RSS ${rss.length}\n`);

  const markdown = buildMarkdown({ date, hn, devto, rss });

  if (DRY_RUN) {
    console.log("── DRY RUN (dosyaya yazılmadı) ──\n");
    console.log(markdown);
  } else {
    fs.writeFileSync(outputFile, markdown, "utf8");
    console.log(`📄 Kaydedildi: ${outputFile}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
