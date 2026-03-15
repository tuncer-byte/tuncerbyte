import type { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "tr" ? 1 : 0.9,
    });

    // Blog listing
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Blog posts
    const posts = getSortedPostsData(locale);
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
