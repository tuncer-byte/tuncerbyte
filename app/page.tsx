import { getSortedPostsData } from "@/lib/posts";
import { getLatestVideos } from "@/lib/youtube";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import {
  IconGitHub,
  IconLinkedIn,
  IconYouTube,
  IconInstagram,
  IconMedium,
  IconUdemy,
} from "./components/SocialIcons";

function getProfileImageSrc(): string | null {
  for (const ext of ["jpg", "png", "jpeg", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", `profile.${ext}`))) {
      return `/profile.${ext}`;
    }
  }
  return null;
}

const projects = [
  {
    name: "byte",
    url: "https://github.com/tuncer-byte/byte",
    stars: 21,
    desc: "VS Code için yapay zeka destekli kodlama asistanı. OpenAI, Gemini, Claude ve Ollama modellerini destekliyor. Yerel ve bulut modellerle çalışan açık kaynaklı geliştirici aracı.",
    tags: ["TypeScript", "VS Code Extension", "AI"],
  },
  {
    name: "cursor25x",
    url: "https://github.com/tuncer-byte/cursor25x",
    stars: 22,
    desc: "Cursor IDE için interaktif görev döngüsü MCP sunucusu. Karmaşık geliştirme iş akışlarını otomatikleştirmek için tasarlandı.",
    tags: ["TypeScript", "MCP", "Cursor"],
  },
  {
    name: "memory-bank-MCP",
    url: "https://github.com/tuncer-byte/memory-bank-MCP",
    stars: 101,
    desc: "Yapay zeka projeleri için yapılandırılmış bellek yönetimi sağlayan MCP sunucusu. PulseMCP'de en çok kullanılan sunucular arasında yer alıyor.",
    tags: ["TypeScript", "MCP"],
  },
  {
    name: "computer-vision",
    url: "https://github.com/atesbey-design/computer-vision",
    stars: 9,
    desc: "Gemini Pro Vision, LLaMA ve Ollama kullanan bilgisayarlı görü asistanı. Görüntü analizi ve açıklama üretme yetenekleriyle Python ile yazıldı.",
    tags: ["Python", "Computer Vision", "LLM"],
  },
];

const mediumArticles = [
  { date: "Feb 2023", title: "Rust ile Sezar'ın Hakkını Verme", url: "https://medium.com/@tuncerbyte/rust-i%CC%87le-sezar%C4%B1n-hakk%C4%B1n%C4%B1-verme-4876a00427e5" },
  { date: "2023", title: "Advanced Dart Enum Features", url: "https://medium.com/@tuncerbyte" },
  { date: "2023", title: "10 Simple but Lesser-Known Flutter Code Snippets", url: "https://medium.com/@tuncerbyte" },
  { date: "2023", title: "Flutter Unit Testing Is a Waste of Time", url: "https://medium.com/@tuncerbyte" },
  { date: "2023", title: "Swift vs. Flutter: Choosing the Best Framework for iOS Development", url: "https://medium.com/@tuncerbyte" },
];

export default async function Home() {
  const posts = getSortedPostsData().slice(0, 6);
  const videos = await getLatestVideos(10);
  const profileSrc = getProfileImageSrc();

  return (
    <main>
      {/* ─── Header ─── */}
      <div className="header">
        <div className="container">
          <div className="header-inner">
            {profileSrc ? (
              <Image
                src={profileSrc}
                alt="Tuncer Bağçabaşı"
                width={160}
                height={160}
                className="avatar"
                priority
              />
            ) : (
              <div className="avatar-placeholder">TB</div>
            )}
            <div className="header-info">
              <h1>Tuncer Bağçabaşı</h1>
              <p className="tagline">
                Software Engineer · AI Researcher · İçerik Üreticisi
              </p>
              <div className="social-links">
                <a href="https://github.com/tuncer-byte" target="_blank" rel="noreferrer" className="social-link" title="GitHub">
                  <IconGitHub />
                </a>
                <a href="https://www.linkedin.com/in/tuncer-bagcabasi/" target="_blank" rel="noreferrer" className="social-link" title="LinkedIn">
                  <IconLinkedIn />
                </a>
                <a href="https://www.youtube.com/@TuncerByte" target="_blank" rel="noreferrer" className="social-link" title="YouTube">
                  <IconYouTube />
                </a>
                <a href="https://www.instagram.com/tuncerbyte" target="_blank" rel="noreferrer" className="social-link" title="Instagram">
                  <IconInstagram />
                </a>
                <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer" className="social-link" title="Medium">
                  <IconMedium />
                </a>
                <a href="https://www.udemy.com/user/tuncerbhc/" target="_blank" rel="noreferrer" className="social-link" title="Udemy">
                  <IconUdemy />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Bio ─── */}
      <div id="bio" className="section-gray">
        <div className="container">
          <h2 className="section-h2">hakkımda</h2>
          <p style={{ maxWidth: 680, lineHeight: 1.85, marginBottom: 12 }}>
            Konya merkezli yazılım mühendisi ve AI araştırmacısı.{" "}
            <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a>'te
            Software Engineer olarak .NET ekosistemi (ASP.NET Core, C#) ve modern frontend teknolojileriyle
            çalışıyorum. Selçuk Üniversitesi Bilgisayar Mühendisliği mezunuyum.
          </p>
          <p style={{ maxWidth: 680, lineHeight: 1.85, marginBottom: 12 }}>
            Full-stack geliştirmenin yanı sıra mobil tarafta Swift (iOS) ve Flutter ile deneyim sahibiyim.
            Açık kaynak tarafında TypeScript ve Python ile AI araçları, MCP sunucuları ve VS Code uzantıları
            üretiyorum. YouTube kanalımda ve Udemy'de Türkçe teknik içerikler paylaşıyorum.
          </p>
          <p style={{ maxWidth: 680, lineHeight: 1.85 }}>
            Medium'da Rust, Flutter, Swift ve yazılım mimarisi üzerine makaleler yazıyorum.{" "}
            <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer">medium.com/@tuncerbyte</a>
          </p>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Deneyim ─── */}
      <div id="experience" className="section-pad">
        <div className="container">
          <h2 className="section-h2">deneyim</h2>
          <div style={{ marginTop: 32 }}>
            {[
              {
                year: "Tem 2024 –\ndevam ediyor",
                content: (
                  <p>
                    <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a>'te{" "}
                    <strong>Software Engineer</strong> (tam zamanlı · Konya · ofiste). Fintech alanında
                    .NET ve C# tabanlı kurumsal uygulamalar geliştiriyorum.
                  </p>
                ),
              },
              {
                year: "Kas 2023 –\nMay 2024",
                content: (
                  <p>
                    <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a>'te{" "}
                    <strong>Full-stack Developer</strong> (yarı zamanlı · hibrit). Ön uç geliştirme (Angular, JavaScript) ve
                    ASP.NET Core backend çalışmaları yaptım.
                  </p>
                ),
              },
              {
                year: "Eki 2022 –\nOca 2024",
                content: (
                  <p>
                    <strong>Truefeedback</strong>'te <strong>Developer</strong> (tam zamanlı · Konya). Stajdan başlayarak
                    tam zamanlı pozisyona geçtim. Full-stack web uygulamaları geliştirdim.
                  </p>
                ),
              },
              {
                year: "Mar 2022 –\nEyl 2024",
                content: (
                  <p>
                    <a href="https://github.com/selcukchain" target="_blank" rel="noreferrer">Selçuk Blockchain</a>'de{" "}
                    <strong>Board Member</strong> (2 yıl 7 ay). Selçuk Üniversitesi bünyesinde blockchain
                    topluluğu kurarak öğrencilere Web3, akıllı sözleşmeler ve kripto teknolojilerini anlattım.
                  </p>
                ),
              },
            ].map((item, i, arr) => (
              <div key={i} className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-year" style={{ whiteSpace: "pre-line" }}>{item.year}</div>
                </div>
                <div className="timeline-middle">
                  <div className="timeline-dot" />
                  {i < arr.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Projeler ─── */}
      <div id="projects" className="section-gray">
        <div className="container">
          <h2 className="section-h2">projeler</h2>
          <p className="section-sub">
            Tüm projeler için{" "}
            <a href="https://github.com/tuncer-byte" target="_blank" rel="noreferrer">github.com/tuncer-byte</a>
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {projects.map((p, i) => (
              <div
                key={p.name}
                style={{
                  padding: "18px 0",
                  borderBottom: i < projects.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontFamily: "Georgia, serif" }}>
                    {p.name}
                  </a>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "monospace", marginLeft: 10 }}>
                    ★ {p.stars}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: 10 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.74rem",
                        fontFamily: "monospace",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── YouTube Videoları ─── */}
      <div id="videos" className="section-pad">
        <div className="container">
          <h2 className="section-h2">videolar</h2>
          <p className="section-sub">
            <a href="https://www.youtube.com/@TuncerByte" target="_blank" rel="noreferrer">@TuncerByte</a>
            {" "}— AI araçları, yazılım geliştirme ve geliştirici deneyimi üzerine Türkçe içerikler.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {videos.map((v) => (
              <a
                key={v.videoId}
                href={v.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", color: "var(--text)" }}
              >
                {/* 16:9 wrapper */}
                <div style={{ position: "relative", paddingBottom: "56.25%", background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    loading="lazy"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.86rem", fontFamily: "sans-serif", lineHeight: 1.4, marginTop: 8, color: "var(--text)" }}>
                  {v.title}
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "monospace", marginTop: 3 }}>
                  {v.published}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Udemy Eğitimleri ─── */}
      <div className="section-gray">
        <div className="container">
          <h2 className="section-h2">eğitimler</h2>
          <p className="section-sub">
            <a href="https://www.udemy.com/user/tuncerbhc/" target="_blank" rel="noreferrer">Udemy</a>'de
            Full Stack Developer & AI Researcher olarak kurslar yayınlıyorum.
          </p>
          <a
            href="https://www.udemy.com/course/full-stack-ai-with-python/"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "20px 24px",
                backgroundColor: "var(--bg)",
                transition: "border-color 0.15s",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  background: "#a435f0",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 4,
                  marginBottom: 10,
                  textDecoration: "none",
                }}
              >
                Udemy
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "Georgia, serif", marginBottom: 8 }}>
                Full Stack Generative and Agentic AI with Python
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 14 }}>
                Python ile LLM, AI Agent, RAG, LangChain, LangGraph ve Multi-Modal AI geliştirme.
                Docker, Pydantic ve modern AI stack'ini sıfırdan öğrenin.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Python", "LangChain", "LangGraph", "RAG", "AI Agents", "Docker"].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.74rem",
                      fontFamily: "monospace",
                      color: "var(--text-muted)",
                      border: "1px solid var(--border)",
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </a>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Yazılar ─── */}
      <div className="section-pad">
        <div className="container">
          <h2 className="section-h2">yazılar</h2>
          <p className="section-sub">
            Bu sitede yayınlanan makaleler.{" "}
            <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer">Medium</a>'da
            da Flutter, Swift, Rust ve yazılım mimarisi üzerine içerikler yayınlıyorum.
          </p>

          {/* Medium seçkisi */}
          <p style={{ fontSize: "0.82rem", fontFamily: "monospace", color: "var(--text-muted)", marginBottom: 4 }}>
            medium
          </p>
          <div style={{ marginBottom: 36 }}>
            {mediumArticles.map((a) => (
              <div key={a.title} className="blog-item">
                <span className="blog-date">{a.date}</span>
                <a href={a.url} target="_blank" rel="noreferrer">{a.title}</a>
              </div>
            ))}
          </div>

          {/* Sitedeki yazılar */}
          {posts.length > 0 && (
            <>
              <p style={{ fontSize: "0.82rem", fontFamily: "monospace", color: "var(--text-muted)", marginBottom: 4 }}>
                bu sitede
              </p>
              <div style={{ marginBottom: 24 }}>
                {posts.map((post) => (
                  <div key={post.slug} className="blog-item">
                    <span className="blog-date">{post.date}</span>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </div>
                ))}
              </div>
            </>
          )}

          <Link href="/blog" style={{ fontSize: "0.92rem" }}>
            Tüm yazıları gör →
          </Link>
        </div>
      </div>
    </main>
  );
}
