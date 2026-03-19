import { ImageResponse } from "next/og";
import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { locales, isValidLocale, defaultLocale } from "@/lib/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tuncer-byte.com";

export const alt = "Tuncer Bağçabaşı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const locale of locales) {
    const slugs = getAllPostSlugs(locale);
    for (const { slug } of slugs) {
      params.push({ lang: locale, slug });
    }
  }
  return params;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = isValidLocale(lang) ? lang : defaultLocale;

  let title = "Tuncer Bağçabaşı";
  let date = "";
  let excerpt = "";

  try {
    const post = await getPostData(slug, locale);
    title = post.title;
    date = post.date;
    excerpt = post.excerpt ?? "";
  } catch {
    /* fallback */
  }

  const profileImageBuffer = await fetch(`${BASE_URL}/profile.png`).then((r) =>
    r.arrayBuffer()
  );
  const profileImageData = `data:image/png;base64,${Buffer.from(profileImageBuffer).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f0f0f",
          padding: "60px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={profileImageData}
            width={40}
            height={40}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <span style={{ color: "#888888", fontSize: 18, fontFamily: "monospace" }}>
            tuncer-byte.com
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, justifyContent: "center" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: title.length > 60 ? 44 : 56,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div style={{ color: "#888888", fontSize: 24, lineHeight: 1.5, maxWidth: 900 }}>
              {excerpt.length > 120 ? excerpt.slice(0, 120) + "…" : excerpt}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #2a2a2a",
            paddingTop: 24,
          }}
        >
          <span style={{ color: "#555555", fontSize: 18, fontFamily: "monospace" }}>
            Tuncer Bağçabaşı
          </span>
          {date && (
            <span style={{ color: "#555555", fontSize: 18, fontFamily: "monospace" }}>
              {date}
            </span>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
