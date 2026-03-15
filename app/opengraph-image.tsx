import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tuncer Bağçabaşı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#0f0f0f",
          padding: "60px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "#1e3a5f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 36,
            fontWeight: 800,
            fontFamily: "monospace",
            marginBottom: 32,
          }}
        >
          TB
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
            marginBottom: 16,
          }}
        >
          Tuncer Bağçabaşı
        </div>

        <div
          style={{
            color: "#888888",
            fontSize: 28,
            fontStyle: "italic",
            marginBottom: 48,
          }}
        >
          Software Engineer · AI Researcher · İçerik Üreticisi
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {["TypeScript", "ASP.NET Core", "Swift", "Python", "MCP"].map((t) => (
            <span
              key={t}
              style={{
                color: "#555555",
                fontSize: 20,
                fontFamily: "monospace",
                border: "1px solid #2a2a2a",
                padding: "6px 16px",
                borderRadius: 99,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 72,
            color: "#444444",
            fontSize: 20,
            fontFamily: "monospace",
          }}
        >
          tuncerbyte.com
        </div>
      </div>
    ),
    { ...size }
  );
}
