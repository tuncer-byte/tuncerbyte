import { getAllPostSlugs, getPostData } from "@/lib/posts";
import { getDictionary, isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const postUrl = `${BASE_URL}/${locale}/blog/${slug}`;

  try {
    const post = await getPostData(slug, locale);
    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      alternates: {
        canonical: postUrl,
        languages: {
          tr: `${BASE_URL}/tr/blog/${slug}`,
          en: `${BASE_URL}/en/blog/${slug}`,
        },
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: postUrl,
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.updated ?? post.date,
        authors: ["Tuncer Bağçabaşı"],
        locale: locale === "tr" ? "tr_TR" : "en_US",
        siteName: "Tuncer Bağçabaşı",
        images: [{ url: `${BASE_URL}/${locale}/blog/${slug}/opengraph-image` }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        creator: "@tuncerbyte",
      },
    };
  } catch {
    return { title: locale === "tr" ? "Yazı bulunamadı" : "Post not found" };
  }
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const d = getDictionary(locale);
  const postUrl = `${BASE_URL}/${locale}/blog/${slug}`;

  let post;
  try {
    post = await getPostData(slug, locale);
  } catch {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? "",
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url: postUrl,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    keywords: post.tags?.join(", "),
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Tuncer Bağçabaşı",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Tuncer Bağçabaşı",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "tr" ? "Ana Sayfa" : "Home",
        item: `${BASE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "tr" ? "Yazılar" : "Writing",
        item: `${BASE_URL}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="blog-post">
        <div className="container">
          <Link href={`/${locale}/blog`} className="back-link">{d.blog.back}</Link>
          <div className="blog-post-header">
            <h1>{post.title}</h1>
            <p className="blog-post-meta">{post.date}</p>
          </div>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          {/* CTA */}
          <div style={{
            marginTop: 48,
            padding: "28px 32px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--bg-section)",
          }}>
            <p style={{ margin: "0 0 20px", fontWeight: 700, fontSize: "1rem" }}>
              {d.blog.cta.heading}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="https://www.udemy.com/user/tuncerbhc/"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: "12px 20px",
                  background: "var(--text)",
                  color: "var(--bg)",
                  borderRadius: 6,
                  textDecoration: "none",
                  minWidth: 160,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{d.blog.cta.udemy}</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.65, fontFamily: "monospace" }}>{d.blog.cta.udemySub}</span>
              </a>
              <a
                href="mailto:tuncerbagcabasi@gmail.com"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: "12px 20px",
                  background: "transparent",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  textDecoration: "none",
                  minWidth: 160,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{d.blog.cta.contact}</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.55, fontFamily: "monospace" }}>{d.blog.cta.contactSub}</span>
              </a>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.78rem",
                    fontFamily: "monospace",
                    color: "var(--text-muted)",
                    background: "var(--bg-section)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    padding: "2px 8px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div style={{ marginTop: 48, padding: "20px 0", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
            <Image
              src="/profile.png"
              alt="Tuncer Bağçabaşı"
              width={48}
              height={48}
              style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid var(--border)" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Tuncer Bağçabaşı</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontFamily: "monospace" }}>
                {locale === "tr" ? "Yazılım Mühendisi & AI Araştırmacısı" : "Software Engineer & AI Researcher"}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <Link href={`/${locale}/blog`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              {d.blog.backAll}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
