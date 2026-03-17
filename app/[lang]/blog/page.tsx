import { getSortedPostsData } from "@/lib/posts";
import { getDictionary, isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { Suspense } from "react";
import BlogListClient from "@/app/components/BlogListClient";

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
          <Suspense>
            <BlogListClient
              posts={posts}
              locale={locale}
              heading={d.blog.heading}
              sub={d.blog.sub}
              emptyText={d.blog.empty}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
