/**
 * fetch-news.mjs
 *
 * Günlük developer haberlerini toplar ve posts/tr/ altına Markdown olarak kaydeder.
 *
 * Kaynaklar:
 *   - Hacker News API  (ücretsiz, auth yok)
 *   - Dev.to API       (ücretsiz, auth yok)
 *   - RSS              (TechCrunch AI, CSS-Tricks, The Verge — fast-xml-parser kullanır)
 *
 * Kullanım:
 *   node scripts/fetch-news.mjs
 *   node scripts/fetch-news.mjs --dry-run   (dosyaya yazmaz, terminale basar)
 *   node scripts/fetch-news.mjs --date 2026-03-25
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "posts", "tr");

const DRY_RUN = process.argv.includes("--dry-run");
const DATE_ARG = process.argv.find((a) => a.startsWith("--date="))?.split("=")[1];

// ─── Yardımcı ──────────────────────────────────────────────────────────────

function today() {
  if (DATE_ARG) return DATE_ARG;
  return new Date().toISOString().split("T")[0]; // "2026-03-24"
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": "tuncerbyte-news-bot/1.0" },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "tuncerbyte-news-bot/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function slug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** Başlığı yaklaşık benzerliğe göre tekilleştirir */
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

const HN_BASE = "https://hacker-news.firebaseio.com/v0";
const HN_SKIP_TYPES = new Set(["job"]);
const HN_SKIP_WORDS = ["hiring", "ask hn: who is hiring", "freelancer"];

async function fetchHN(limit = 12) {
  console.log("📡 Hacker News alınıyor...");
  const ids = await fetchJson(`${HN_BASE}/topstories.json`);
  const top = ids.slice(0, 40); // ilk 40'tan en iyi limit'i seç

  const stories = await Promise.allSettled(
    top.map((id) => fetchJson(`${HN_BASE}/item/${id}.json`))
  );

  return stories
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value)
    .filter((s) => {
      if (HN_SKIP_TYPES.has(s.type)) return false;
      if (!s.url) return false; // sadece metin yazılarını atla
      const t = (s.title || "").toLowerCase();
      if (HN_SKIP_WORDS.some((w) => t.includes(w))) return false;
      return true;
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
    .map((s) => ({
      title: s.title,
      url: s.url,
      score: s.score || 0,
      comments: s.descendants || 0,
      hn: `https://news.ycombinator.com/item?id=${s.id}`,
    }));
}

// ─── Dev.to ────────────────────────────────────────────────────────────────

const DEVTO_TAGS = ["ai", "machinelearning", "javascript", "webdev", "typescript", "opensource"];

async function fetchDevTo(perTag = 3) {
  console.log("📡 Dev.to alınıyor...");
  const all = [];

  await Promise.allSettled(
    DEVTO_TAGS.map(async (tag) => {
      try {
        const articles = await fetchJson(
          `https://dev.to/api/articles?tag=${tag}&top=1&per_page=${perTag}`
        );
        all.push(
          ...articles.map((a) => ({
            title: a.title,
            url: a.url,
            tag,
            readingTime: a.reading_time_minutes,
            reactions: a.positive_reactions_count || 0,
          }))
        );
      } catch (e) {
        console.warn(`  ⚠ Dev.to tag=${tag} atlandı: ${e.message}`);
      }
    })
  );

  // en çok reaksiyona göre sırala, 10 tane al
  return all.sort((a, b) => b.reactions - a.reactions).slice(0, 10);
}

// ─── RSS ───────────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
  },
  {
    name: "CSS-Tricks",
    url: "https://css-tricks.com/feed/",
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
  },
];

async function fetchRSS(feedsPerSource = 4) {
  console.log("📡 RSS besleme alınıyor...");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const results = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const xml = await fetchText(feed.url);
        const parsed = parser.parse(xml);

        // RSS 2.0 veya Atom formatını destekle
        const channel =
          parsed?.rss?.channel ||
          parsed?.feed ||
          null;

        if (!channel) {
          console.warn(`  ⚠ ${feed.name}: format tanınamadı`);
          return;
        }

        const rawItems =
          channel.item ||   // RSS 2.0
          channel.entry ||  // Atom
          [];

        const items = Array.isArray(rawItems) ? rawItems : [rawItems];

        items.slice(0, feedsPerSource).forEach((item) => {
          const title =
            typeof item.title === "string"
              ? item.title
              : item.title?.["#text"] || item.title || "";

          const link =
            item.link?.["@_href"] ||  // Atom
            item.link ||               // RSS 2.0
            item.url ||
            "";

          const pubDate =
            item.pubDate ||
            item.published ||
            item.updated ||
            "";

          if (title && link) {
            results.push({
              source: feed.name,
              title: title.trim(),
              url: typeof link === "string" ? link : link["#text"] || "",
              date: pubDate,
            });
          }
        });

        console.log(`  ✓ ${feed.name}: ${Math.min(items.length, feedsPerSource)} haber`);
      } catch (e) {
        console.warn(`  ⚠ ${feed.name} atlandı: ${e.message}`);
      }
    })
  );

  return results;
}

// ─── Markdown Üretici ──────────────────────────────────────────────────────

function buildMarkdown({ date, hn, devto, rss }) {
  const humanDate = formatDate(date);
  const totalCount = hn.length + devto.length + rss.length;

  const frontmatter = `---
title: "Gündem: ${humanDate} — Developer Haberleri"
date: "${date}"
excerpt: "Bugünün öne çıkan developer haberleri: Hacker News, Dev.to ve tech bloglarından ${totalCount} haber derlendi."
tags: ["Gündem", "Haberler", "Developer", "Teknoloji", "Yapay Zeka", "Web"]
category: "Gündem"
---`;

  const header = `Bugünün developer gündeminden öne çıkan haberler — Hacker News, Dev.to ve popüler tech bloglarından derlendi.

---
`;

  // Hacker News bölümü
  let hnSection = `## Hacker News\n\n`;
  if (hn.length === 0) {
    hnSection += `_Bugün haber alınamadı._\n`;
  } else {
    hn.forEach((s) => {
      hnSection += `- **[${s.title}](${s.url})** — Puan: ${s.score} | [${s.comments} yorum](${s.hn})\n`;
    });
  }

  // Dev.to bölümü
  let devtoSection = `\n## Dev.to\n\n`;
  if (devto.length === 0) {
    devtoSection += `_Bugün haber alınamadı._\n`;
  } else {
    const byTag = {};
    devto.forEach((a) => {
      if (!byTag[a.tag]) byTag[a.tag] = [];
      byTag[a.tag].push(a);
    });

    Object.entries(byTag).forEach(([tag, articles]) => {
      devtoSection += `**#${tag}**\n\n`;
      articles.forEach((a) => {
        const rt = a.readingTime ? ` — ${a.readingTime} dk okuma` : "";
        devtoSection += `- [${a.title}](${a.url})${rt}\n`;
      });
      devtoSection += "\n";
    });
  }

  // RSS bölümü
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
      rssSection += `**${source}**\n\n`;
      items.forEach((r) => {
        rssSection += `- [${r.title}](${r.url})\n`;
      });
      rssSection += "\n";
    });
  }

  const footer = `---

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._`;

  return [frontmatter, "", header, hnSection, devtoSection, rssSection, footer].join("\n");
}

// ─── Ana Akış ──────────────────────────────────────────────────────────────

async function main() {
  const date = today();
  const outputFile = path.join(POSTS_DIR, `gundem-${date}.md`);

  // Aynı gün zaten oluşturulduysa uyar (--force ile geç)
  if (!DRY_RUN && fs.existsSync(outputFile) && !process.argv.includes("--force")) {
    console.log(`⚠  ${outputFile} zaten var. Üzerine yazmak için --force ekle.`);
    process.exit(0);
  }

  let hn = [], devto = [], rss = [];

  try { hn    = dedup(await fetchHN());       } catch (e) { console.warn("HN hatası:", e.message); }
  try { devto = dedup(await fetchDevTo());    } catch (e) { console.warn("Dev.to hatası:", e.message); }
  try { rss   = dedup(await fetchRSS());      } catch (e) { console.warn("RSS hatası:", e.message); }

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
