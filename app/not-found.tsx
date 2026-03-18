import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80, textAlign: "center" }}>
        <p style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 16 }}>
          ERROR
        </p>
        <h1 style={{ fontFamily: "monospace", fontSize: "5rem", fontWeight: 800, color: "var(--text)", margin: "0 0 8px", lineHeight: 1 }}>
          404
        </h1>
        <p style={{ fontFamily: "monospace", fontSize: "1rem", color: "var(--text-muted)", marginBottom: 40 }}>
          Bu sayfa bulunamadı.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/tr"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 20px",
              background: "var(--text)",
              color: "var(--bg)",
              borderRadius: 6,
              fontFamily: "monospace",
              fontSize: "0.88rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Ana Sayfa
          </Link>
          <Link
            href="/tr/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 20px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontFamily: "monospace",
              fontSize: "0.88rem",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Yazılar
          </Link>
        </div>
      </div>
    </main>
  );
}
