import { getSortedPostsData } from "@/lib/posts";
import { isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

interface Props {
  params: Promise<{ lang: string; tag: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; tag: string }[] = [];
  for (const locale of locales) {
    const posts = getSortedPostsData(locale);
    const tags = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags ?? []) tags.add(tag);
    }
    for (const tag of tags) {
      params.push({ lang: locale, tag: encodeURIComponent(tag) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const decoded = decodeURIComponent(tag);

  return {
    title: decoded,
    description:
      locale === "tr"
        ? `"${decoded}" etiketiyle yazılmış tüm yazılar.`
        : `All posts tagged with "${decoded}".`,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/tag/${tag}`,
    },
    openGraph: {
      title: `${decoded} — Tuncer Bağçabaşı`,
      url: `${BASE_URL}/${locale}/blog/tag/${tag}`,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const decoded = decodeURIComponent(tag);

  const allPosts = getSortedPostsData(locale);
  const posts = allPosts.filter((p) => p.tags?.includes(decoded));

  if (posts.length === 0) notFound();

  return (
    <main>
      <div className="blog-post">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="blog-breadcrumb" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="breadcrumb-link">
              {locale === "tr" ? "Ana Sayfa" : "Home"}
            </Link>
            <span className="breadcrumb-sep">›</span>
            <Link href={`/${locale}/blog`} className="breadcrumb-link">
              {locale === "tr" ? "Yazılar" : "Writing"}
            </Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{decoded}</span>
          </nav>

          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" }}>
            {decoded}
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
            {locale === "tr"
              ? `${posts.length} yazı bu etiketle etiketlendi.`
              : `${posts.length} post tagged with this.`}
          </p>

          <div className="blog-list">
            {posts.map((post) => (
              <div key={post.slug} className="blog-item" style={{ flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
                  <span className="blog-date">{post.date}</span>
                  <Link href={`/${locale}/blog/${post.slug}`} style={{ fontWeight: 600 }}>
                    {post.title}
                  </Link>
                </div>
                {post.excerpt && (
                  <p
                    className="blog-excerpt"
                    style={{ margin: "4px 0 0 110px", color: "var(--text-muted)", fontSize: "0.9rem" }}
                  >
                    {post.excerpt}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <Link href={`/${locale}/blog`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              {locale === "tr" ? "← Tüm yazılar" : "← All posts"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
