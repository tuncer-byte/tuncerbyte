import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";

function hasProfileImage() {
  try {
           fs.existsSync(path.join(process.cwd(), "public", "profile.png")) 
  } catch {
    return false;
  }
}

function getProfileImageSrc() {
  const exts = ["jpg", "png", "jpeg", "webp"];
  for (const ext of exts) {
    if (fs.existsSync(path.join(process.cwd(), "public", `profile.${ext}`))) {
      return `/profile.${ext}`;
    }
  }
  return null;
}

export default function Home() {
  const posts = getSortedPostsData().slice(0, 6);
  const profileSrc = getProfileImageSrc();

  return (
    <main>
      {/* Header */}
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
                AI araçları, MCP sunucuları ve geliştirici deneyimi üzerine çalışıyorum.
              </p>
              <div className="social-links">
                <a
                  href="https://github.com/tuncer-byte"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  title="GitHub"
                >
                  GH
                </a>
                <a
                  href="https://www.linkedin.com/in/tuncer-bagcabasi/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  title="LinkedIn"
                >
                  in
                </a>
                <a
                  href="https://www.youtube.com/@tuncerbyte"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  title="YouTube"
                >
                  YT
                </a>
                <a
                  href="https://www.instagram.com/tuncer_byte"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  title="Instagram"
                >
                  IG
                </a>
                <a
                  href="https://www.udemy.com/user/tuncerbhc/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  title="Udemy"
                >
                  U
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Timeline */}
      <div className="timeline-section">
        <div className="container">
          <div className="timeline">

            {/* Architecht - Software Engineer */}
            <div className="timeline-item">
              <div className="timeline-year">Tem 2024 –</div>
              <div className="timeline-connector">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <p>
                  <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">
                    Architecht
                  </a>'te <strong>Software Engineer</strong> olarak çalışıyorum (tam zamanlı, Konya · ofiste).
                  Türkiye'nin önde gelen fintech şirketlerinden birinde C# ve modern yazılım çözümleri geliştiriyorum.
                </p>
                <p>
                  Aynı dönemde açık kaynak projelerime devam ettim:{" "}
                  <a href="https://github.com/tuncer-byte/memory-bank-MCP" target="_blank" rel="noreferrer">memory-bank-MCP</a>{" "}
                  (100+ ★),{" "}
                  <a href="https://github.com/tuncer-byte/byte" target="_blank" rel="noreferrer">byte</a> VS Code uzantısı ve{" "}
                  <a href="https://github.com/tuncer-byte/cursor25x" target="_blank" rel="noreferrer">cursor25x</a> MCP sunucusu.
                  YouTube ve Udemy'de AI &amp; geliştirici araçları üzerine içerik üretiyorum.
                </p>
              </div>
            </div>

            {/* Architecht - Full-stack Developer (part-time) */}
            <div className="timeline-item">
              <div className="timeline-year">Kas 2023 – May 2024</div>
              <div className="timeline-connector">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <p>
                  <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">
                    Architecht
                  </a>'te <strong>Full-stack Developer</strong> (yarı zamanlı, hibrit) olarak başladım.
                  Ön uç geliştirme ve C# backend çalışmaları yaptım.
                </p>
              </div>
            </div>

            {/* Truefeedback */}
            <div className="timeline-item">
              <div className="timeline-year">Tem 2022 – Oca 2024</div>
              <div className="timeline-connector">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <p>
                  <strong>Truefeedback</strong>'te web geliştirici olarak staj yaptım, ardından tam zamanlı{" "}
                  <strong>Developer</strong> pozisyonuna geçtim (toplam ~1 yıl 7 ay, Konya).
                  Full-stack web geliştirme alanında pratik deneyim kazandım.
                </p>
              </div>
            </div>

            {/* Selçuk Blockchain */}
            <div className="timeline-item">
              <div className="timeline-year">Mar 2022 – Eyl 2024</div>
              <div className="timeline-connector">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <p>
                  <a href="https://github.com/selcukchain" target="_blank" rel="noreferrer">
                    Selçuk Blockchain
                  </a> topluluğunda <strong>Board Member</strong> olarak görev aldım (2 yıl 7 ay).
                  Selçuk Üniversitesi öğrencilerine blockchain, Web3 ve kripto teknolojilerini anlattım;
                  topluluk etkinlikleri ve eğitimler düzenledim.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Bio */}
      <div id="bio" className="gray-section">
        <div className="container">
          <h2>hakkımda</h2>
          <p style={{ maxWidth: 680, lineHeight: 1.85 }}>
            Tuncer Bağçabaşı, Konya'da çalışan bir yazılım mühendisi ve AI araştırmacısı.
            Architecht'te Software Engineer olarak görev yapıyor; boş zamanlarında
            yapay zeka araçları, MCP sunucuları ve geliştirici deneyimini iyileştiren açık kaynak
            projeler üretiyor.{" "}
            <a href="https://github.com/tuncer-byte/memory-bank-MCP" target="_blank" rel="noreferrer">
              memory-bank-MCP
            </a>{" "}
            projesi, global MCP ekosisteminde en popüler sunucular arasında yer alıyor.
            TypeScript, Python, C# ve Rust ile yazıyor; YouTube ve Udemy'de Türkçe
            teknik içerik üretiyor.
          </p>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Projects */}
      <div id="projects" className="timeline-section">
        <div className="container">
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" }}>
            projeler
          </h2>
          <p style={{ marginBottom: 28, color: "var(--text-muted)" }}>
            Güncel projelerin tamamı için{" "}
            <a href="https://github.com/tuncer-byte" target="_blank" rel="noreferrer">
              GitHub profilime
            </a>{" "}
            bakabilirsin.
          </p>
          <div className="projects-list">

            <div className="project-item">
              <div className="project-icon">🧠</div>
              <div className="project-content">
                <h3>
                  <a href="https://github.com/tuncer-byte/memory-bank-MCP" target="_blank" rel="noreferrer">
                    memory-bank-MCP
                  </a>
                  <span className="project-stars">★ 101</span>
                </h3>
                <p>
                  Yapay zeka projeleri için yapılandırılmış bellek yönetimi sağlayan TypeScript tabanlı MCP sunucusu.
                  PulseMCP'de dünyada en çok ziyaret edilen sunucular arasında yer alıyor.
                </p>
              </div>
            </div>

            <div className="project-item">
              <div className="project-icon">⚡</div>
              <div className="project-content">
                <h3>
                  <a href="https://github.com/tuncer-byte/byte" target="_blank" rel="noreferrer">
                    byte
                  </a>
                  <span className="project-stars">★ 21</span>
                </h3>
                <p>
                  VS Code için AI kodlama asistanı. OpenAI, Gemini, Claude ve Ollama modellerini destekliyor.
                  Yerel ve bulut modellerle çalışabilen açık kaynaklı geliştirici aracı.
                </p>
              </div>
            </div>

            <div className="project-item">
              <div className="project-icon">🔁</div>
              <div className="project-content">
                <h3>
                  <a href="https://github.com/tuncer-byte/cursor25x" target="_blank" rel="noreferrer">
                    cursor25x
                  </a>
                  <span className="project-stars">★ 22</span>
                </h3>
                <p>
                  Cursor IDE için interaktif görev döngüsü MCP sunucusu.
                  Karmaşık geliştirme iş akışlarını otomatikleştirmek için tasarlandı.
                </p>
              </div>
            </div>

            <div className="project-item">
              <div className="project-icon">👁️</div>
              <div className="project-content">
                <h3>
                  <a href="https://github.com/atesbey-design/computer-vision" target="_blank" rel="noreferrer">
                    computer-vision
                  </a>
                  <span className="project-stars">★ 9</span>
                </h3>
                <p>
                  Gemini Pro Vision ve LLaMA kullanan bilgisayarlı görü asistanı.
                  Görüntü analizi ve açıklama üretme yetenekleriyle Python ile yazıldı.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Blog */}
      <div className="gray-section">
        <div className="container">
          <h2>yazılar</h2>
          <p style={{ marginBottom: 24, color: "var(--text-muted)" }}>
            AI, yazılım geliştirme ve geliştirici deneyimi üzerine notlar ve düşünceler.
          </p>
          {posts.length > 0 ? (
            <div className="blog-list">
              {posts.map((post) => (
                <div key={post.slug} className="blog-item">
                  <span className="blog-date">{post.date}</span>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              Yakında yazılar eklenecek.
          </p>
          )}
          <p style={{ marginTop: 24 }}>
            <Link href="/blog">Tüm yazıları gör →</Link>
          </p>
        </div>
      </div>

    </main>
  );
}
