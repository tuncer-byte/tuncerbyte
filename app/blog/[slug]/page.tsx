import { getAllPostSlugs, getPostData } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostData(slug);
    const postUrl = `${BASE_URL}/blog/${slug}`;
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
        locale: "tr_TR",
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
    return { title: "Yazı bulunamadı" };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostData(slug);
  } catch {
    notFound();
  }

  const postUrl = `${BASE_URL}/blog/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? "",
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
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
          <Link href="/blog" className="back-link">← Yazılar</Link>
          <div className="blog-post-header">
            <h1>{post.title}</h1>
            <p className="blog-post-meta">{post.date}</p>
          </div>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <Link href="/blog" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              ← Tüm yazılar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
