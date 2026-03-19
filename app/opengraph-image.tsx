import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tuncer Bağçabaşı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tuncer-byte.com";

export default async function OgImage() {
  const profileImageBuffer = await fetch(`${BASE_URL}/profile.png`).then((r) =>
    r.arrayBuffer()
  );
  const profileImageData = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(profileImageBuffer)))}`;

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
        <img
          src={profileImageData}
          width={96}
          height={96}
          style={{
            borderRadius: "50%",
            marginBottom: 32,
            objectFit: "cover",
          }}
        />

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
          tuncer-byte.com
        </div>
      </div>
    ),
    { ...size }
  );
}
