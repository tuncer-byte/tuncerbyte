"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { PostData } from "@/lib/posts";

const CATEGORIES_TR = ["Tümü", "Teknik", "Teknoloji", "Proje", "Kaynaklar"];
const CATEGORIES_EN = ["All", "Technical", "Technology", "Project", "Resources"];

const CATEGORY_MAP_EN_TO_TR: Record<string, string> = {
  All: "Tümü",
  Technical: "Teknik",
  Technology: "Teknoloji",
  Project: "Proje",
  Resources: "Kaynaklar",
};

const CATEGORY_MAP_TR_TO_EN: Record<string, string> = {
  Tümü: "All",
  Teknik: "Technical",
  Teknoloji: "Technology",
  Proje: "Project",
  Kaynaklar: "Resources",
};

interface Props {
  posts: PostData[];
  locale: string;
  heading: string;
  sub: string;
  emptyText: string;
}

export default function BlogListClient({ posts, locale, heading, sub, emptyText }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  const categories = locale === "tr" ? CATEGORIES_TR : CATEGORIES_EN;

  const filtered = activeCategory
    ? posts.filter((p) => {
        const cat = p.category ?? "";
        if (locale === "tr") return cat === activeCategory;
        return (CATEGORY_MAP_EN_TO_TR[activeCategory] ?? activeCategory) === cat;
      })
    : posts;

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!cat || cat === categories[0]) {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.replace(`/${locale}/blog${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  const activeCategoryLabel = activeCategory || "";
  const activeCategoryTR =
    locale === "tr" ? activeCategoryLabel : (CATEGORY_MAP_EN_TO_TR[activeCategoryLabel] ?? activeCategoryLabel);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="blog-breadcrumb" aria-label="breadcrumb">
        <Link href={`/${locale}`}>{locale === "tr" ? "Ana Sayfa" : "Home"}</Link>
        <span className="breadcrumb-sep">/</span>
        {activeCategoryLabel ? (
          <>
            <Link href={`/${locale}/blog`}>{locale === "tr" ? "Yazılar" : "Writing"}</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{activeCategoryTR}</span>
          </>
        ) : (
          <span className="breadcrumb-current">{locale === "tr" ? "Yazılar" : "Writing"}</span>
        )}
      </nav>

      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" }}>
        {heading}
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>{sub}</p>

      {/* Category filter tabs */}
      <div className="blog-category-tabs">
        {categories.map((cat) => {
          const isAll = cat === categories[0];
          const isActive = isAll ? !activeCategoryLabel : cat === activeCategoryLabel;
          return (
            <button
              key={cat}
              onClick={() => setCategory(isAll ? "" : cat)}
              className={`blog-category-tab${isActive ? " active" : ""}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Post list */}
      {filtered.length > 0 ? (
        <div className="blog-list">
          {filtered.map((post) => (
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
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{emptyText}</p>
      )}
    </>
  );
}
