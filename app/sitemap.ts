import type { MetadataRoute } from "next";
import { getSortedPostsData, getNewsPosts } from "@/lib/posts";
import { locales } from "@/lib/i18n";
import { getAlternateSlug } from "@/lib/slugmap";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const altLocale = locale === "tr" ? "en" : "tr";

    // Homepage
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "tr" ? 1 : 0.9,
      alternates: {
        languages: {
          tr: `${BASE_URL}/tr`,
          en: `${BASE_URL}/en`,
        },
      },
    });

    // Blog listing
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          tr: `${BASE_URL}/tr/blog`,
          en: `${BASE_URL}/en/blog`,
        },
      },
    });

    // News listing
    entries.push({
      url: `${BASE_URL}/${locale}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });

    // Blog posts
    const posts = getSortedPostsData(locale);
    const now = Date.now();
    for (const post of posts) {
      const daysOld = (now - new Date(post.date).getTime()) / 86400000;
      const altSlug = getAlternateSlug(post.slug, altLocale);
      const languages: Record<string, string> = {
        [locale]: `${BASE_URL}/${locale}/blog/${post.slug}`,
      };
      if (altSlug) {
        languages[altLocale] = `${BASE_URL}/${altLocale}/blog/${altSlug}`;
      }

      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: daysOld < 14 ? "daily" : "monthly",
        priority: daysOld < 14 ? 0.9 : daysOld < 60 ? 0.8 : 0.7,
        alternates: {
          languages,
        },
      });
    }

    // News posts (her dilde aynı EN içerik, yalnızca bir kez ekle)
    if (locale === "en") {
      const newsPosts = getNewsPosts("en");
      for (const post of newsPosts) {
        entries.push({
          url: `${BASE_URL}/en/blog/${post.slug}`,
          lastModified: new Date(post.updated ?? post.date),
          changeFrequency: "daily",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
