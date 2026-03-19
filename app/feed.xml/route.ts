import { getSortedPostsData } from "@/lib/posts";
import type { Locale } from "@/lib/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const trPosts = getSortedPostsData("tr").map((p) => ({ ...p, locale: "tr" as Locale }));
  const enPosts = getSortedPostsData("en").map((p) => ({ ...p, locale: "en" as Locale }));

  const allPosts = [...trPosts, ...enPosts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 30);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/modules/content/">
  <channel>
    <title>Tuncer Bağçabaşı</title>
    <link>${BASE_URL}</link>
    <description>Software Engineer &amp; AI Researcher — AI, MCP, TypeScript ve yazılım üzerine yazılar.</description>
    <language>tr-TR</language>
    <managingEditor>tuncerbostancibasi@gmail.com (Tuncer Bağçabaşı)</managingEditor>
    <webMaster>tuncerbostancibasi@gmail.com (Tuncer Bağçabaşı)</webMaster>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${BASE_URL}/profile.png</url>
      <title>Tuncer Bağçabaşı</title>
      <link>${BASE_URL}</link>
    </image>
${allPosts
  .map(
    (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/${post.locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/${post.locale}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt ?? ""}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>Tuncer Bağçabaşı</dc:creator>
      <dc:language>${post.locale === "tr" ? "tr-TR" : "en-US"}</dc:language>${
      post.tags && post.tags.length > 0
        ? "\n      " + post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")
        : ""
    }
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
