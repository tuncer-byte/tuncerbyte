import { getNewsPosts } from "@/lib/posts";
import { isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import NewsListClient from "@/app/components/NewsListClient";

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

  return {
    title: "News",
    description: "Daily developer news from Hacker News, Dev.to, TechCrunch, The Verge and more.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/news`,
    },
    openGraph: {
      title: "News — Tuncer Bağçabaşı",
      description: "Daily developer news aggregated from top sources.",
      url: `${BASE_URL}/${locale}/news`,
      type: "website",
    },
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;

  // Haberler yalnızca İngilizce (posts/en/news/)
  const posts = getNewsPosts("en");

  return (
    <main>
      <div className="blog-post">
        <div className="container">
          <Suspense>
            <NewsListClient posts={posts} locale={locale} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
