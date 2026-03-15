import { getAllPostSlugs, getPostData } from "@/lib/posts";
import { getDictionary, isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
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
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: postUrl,
        type: "article",
        publishedTime: post.date,
        authors: ["Tuncer Bağçabaşı"],
        locale: locale === "tr" ? "tr_TR" : "en_US",
        siteName: "Tuncer Bağçabaşı",
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
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? "",
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    author: {
      "@type": "Person",
      name: "Tuncer Bağçabaşı",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Tuncer Bağçabaşı",
      url: BASE_URL,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
          <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <Link href={`/${locale}/blog`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              {d.blog.backAll}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
