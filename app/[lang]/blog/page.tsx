import { getSortedPostsData } from "@/lib/posts";
import { getDictionary, isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const d = getDictionary(locale);

  return {
    title: locale === "tr" ? "Yazılar" : "Writing",
    description: d.blog.sub,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        tr: `${BASE_URL}/tr/blog`,
        en: `${BASE_URL}/en/blog`,
      },
    },
    openGraph: {
      title: locale === "tr" ? "Yazılar — Tuncer Bağçabaşı" : "Writing — Tuncer Bağçabaşı",
      description: d.blog.sub,
      url: `${BASE_URL}/${locale}/blog`,
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const d = getDictionary(locale);
  const posts = getSortedPostsData(locale);

  return (
    <main>
      <div className="blog-post">
        <div className="container">
          <Link href={`/${locale}`} className="back-link">
            {locale === "tr" ? "← Ana sayfa" : "← Home"}
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" }}>
            {d.blog.heading}
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 40 }}>{d.blog.sub}</p>

          {posts.length > 0 ? (
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
                    <p className="blog-excerpt" style={{ margin: "4px 0 0 110px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{d.blog.empty}</p>
          )}
        </div>
      </div>
    </main>
  );
}
