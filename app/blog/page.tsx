import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yazılar — Tuncer Bağçabaşı",
  description: "AI, yazılım geliştirme ve geliştirici deneyimi üzerine yazılar.",
};

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <main>
      <div className="blog-post">
        <div className="container">
          <Link href="/" className="back-link">← Ana sayfa</Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" }}>
            yazılar
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 40 }}>
            AI, yazılım geliştirme ve geliştirici deneyimi üzerine notlar ve düşünceler.
          </p>

          {posts.length > 0 ? (
            <div className="blog-list">
              {posts.map((post) => (
                <div key={post.slug} className="blog-item" style={{ flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
                    <span className="blog-date">{post.date}</span>
                    <Link href={`/blog/${post.slug}`} style={{ fontWeight: 600 }}>{post.title}</Link>
                  </div>
                  {post.excerpt && (
                    <p style={{ margin: "4px 0 0 110px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              Henüz yayınlanmış yazı yok. Yakında eklenecek.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
