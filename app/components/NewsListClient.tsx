"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostData } from "@/lib/posts";

const SOURCES = ["All", "Hacker News", "Dev.to", "TechCrunch AI", "The Verge", "CSS-Tricks", "Smashing Magazine"];

function getSource(post: PostData): string {
  const tags = post.tags ?? [];
  return SOURCES.slice(1).find((s) => tags.includes(s)) ?? "Other";
}

interface Props {
  posts: PostData[];
  locale: string;
}

export default function NewsListClient({ posts, locale }: Props) {
  const [activeSource, setActiveSource] = useState("All");
  const [query, setQuery]               = useState("");

  const sourcedPosts = activeSource === "All"
    ? posts
    : posts.filter((p) => getSource(p) === activeSource);

  const q        = query.trim().toLowerCase();
  const filtered = q
    ? sourcedPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt ?? "").toLowerCase().includes(q)
      )
    : sourcedPosts;

  // Tarihe göre grupla
  const grouped: Record<string, PostData[]> = {};
  for (const post of filtered) {
    const d = new Date(post.date);
    const label = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(post);
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="blog-breadcrumb" aria-label="breadcrumb">
        <Link href={`/${locale}`}>{locale === "tr" ? "Ana Sayfa" : "Home"}</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">News</span>
      </nav>

      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 4, fontFamily: "Georgia, serif" }}>
        News
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.95rem" }}>
        Daily developer news from Hacker News, Dev.to, TechCrunch, The Verge and more.
        Articles auto-expire after 3 days.
      </p>

      {/* Search */}
      <div className="blog-search-wrap" style={{ marginBottom: 16 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className="blog-search"
          aria-label="Search news"
        />
        {query && (
          <button className="blog-search-clear" onClick={() => setQuery("")} aria-label="Clear">✕</button>
        )}
      </div>

      {/* Source filter */}
      <div className="blog-category-tabs" style={{ marginBottom: 28 }}>
        {SOURCES.map((src) => (
          <button
            key={src}
            onClick={() => setActiveSource(src)}
            className={`blog-category-tab${activeSource === src ? " active" : ""}`}
          >
            {src}
          </button>
        ))}
      </div>

      {/* Grouped list */}
      {Object.keys(grouped).length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          {q ? `No results for "${query}".` : "No news articles yet."}
        </p>
      ) : (
        Object.entries(grouped).map(([dateLabel, dayPosts]) => (
          <section key={dateLabel} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: "0.8rem",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 6,
              marginBottom: 16,
            }}>
              {dateLabel}
            </h2>

            <div className="blog-list">
              {dayPosts.map((post) => {
                const source = getSource(post);
                return (
                  <div key={post.slug} className="blog-item" style={{ flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "0.72rem",
                        fontFamily: "monospace",
                        color: "var(--text-muted)",
                        background: "var(--bg-section)",
                        border: "1px solid var(--border)",
                        borderRadius: 3,
                        padding: "1px 6px",
                        flexShrink: 0,
                      }}>
                        {source}
                      </span>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        style={{ fontWeight: 600, lineHeight: 1.4 }}
                      >
                        {post.title}
                      </Link>
                    </div>
                    {post.excerpt && (
                      <p style={{
                        margin: "4px 0 0 0",
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        paddingLeft: 4,
                      }}>
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </>
  );
}
