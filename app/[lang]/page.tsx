import { getSortedPostsData } from "@/lib/posts";
import { getLatestVideos } from "@/lib/youtube";
import { getDictionary, isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
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
} from "@/app/components/SocialIcons";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const d = getDictionary(locale);

  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        tr: `${BASE_URL}/tr`,
        en: `${BASE_URL}/en`,
      },
    },
  };
}

function getProfileImageSrc(): string | null {
  for (const ext of ["jpg", "png", "jpeg", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", `profile.${ext}`))) {
      return `/profile.${ext}`;
    }
  }
  return null;
}

const projectMeta = [
  { name: "byte", url: "https://github.com/tuncer-byte/byte", stars: 21, tags: ["TypeScript", "VS Code Extension", "AI"] },
  { name: "cursor25x", url: "https://github.com/tuncer-byte/cursor25x", stars: 22, tags: ["TypeScript", "MCP", "Cursor"] },
  { name: "memory-bank-MCP", url: "https://github.com/tuncer-byte/memory-bank-MCP", stars: 101, tags: ["TypeScript", "MCP"] },
  { name: "computer-vision", url: "https://github.com/atesbey-design/computer-vision", stars: 9, tags: ["Python", "Computer Vision", "LLM"] },
];

const courses = [
  {
    url: "https://www.udemy.com/course/sifirdan-multi-agent-yapay-zeka-sistemleri-gelistirme/",
    title: "Sıfırdan Multi-Agent Yapay Zekâ Sistemleri Geliştirme",
    image: "https://img-c.udemycdn.com/course/480x270/6885093_4481.jpg",
    tags: ["Python", "LangChain", "Google AI", "Multi-Agent"],
  },
  {
    url: "https://www.udemy.com/course/en-ince-detaylaryla-mcp-model-context-protocol/",
    title: "En İnce Detaylarıyla MCP (Model Context Protocol)",
    image: "https://img-c.udemycdn.com/course/480x270/6557551_47f3_4.jpg",
    tags: ["TypeScript", "MCP", "AI", "SDK"],
  },
  {
    url: "https://www.udemy.com/course/yapay-zeka-ile-ai-agent-otomasyonu-yapmak/",
    title: "Yapay Zeka ile AI Agent Otomasyonu Yapmak",
    image: "https://img-c.udemycdn.com/course/480x270/6452589_e9b3_2.jpg",
    tags: ["Python", "AI Agent", "Otomasyon"],
  },
  {
    url: "https://www.udemy.com/course/yapay-zeka-ile-yazlm-gelistirme-mobil-uygulama/",
    title: "Yapay Zeka İle Yazılım Geliştirme — Mobil Uygulama",
    image: "https://img-c.udemycdn.com/course/480x270/6442111_338b_2.jpg",
    tags: ["Swift", "Kotlin", "Flutter", "Core ML"],
  },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const d = getDictionary(locale);

  const posts = getSortedPostsData(locale).slice(0, 6);
  const videos = await getLatestVideos(4);
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
              <p className="tagline">{d.hero.tagline}</p>
              <div className="social-links">
                <a href="https://github.com/tuncer-byte" target="_blank" rel="noreferrer" className="social-link" title="GitHub"><IconGitHub /></a>
                <a href="https://www.linkedin.com/in/tuncer-bagcabasi/" target="_blank" rel="noreferrer" className="social-link" title="LinkedIn"><IconLinkedIn /></a>
                <a href="https://www.youtube.com/@TuncerByte" target="_blank" rel="noreferrer" className="social-link" title="YouTube"><IconYouTube /></a>
                <a href="https://www.instagram.com/tuncerbyte" target="_blank" rel="noreferrer" className="social-link" title="Instagram"><IconInstagram /></a>
                <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer" className="social-link" title="Medium"><IconMedium /></a>
                <a href="https://www.udemy.com/user/tuncerbhc/" target="_blank" rel="noreferrer" className="social-link" title="Udemy"><IconUdemy /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── About ─── */}
      <div id="bio" className="section-gray">
        <div className="container">
          <h2 className="section-h2">{d.about.heading}</h2>
          <p style={{ maxWidth: 680, lineHeight: 1.85, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: d.about.p1 }} />
          <p style={{ maxWidth: 680, lineHeight: 1.85, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: d.about.p2 }} />
          <p style={{ maxWidth: 680, lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: d.about.p3 }} />
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Experience ─── */}
      <div id="experience" className="section-pad">
        <div className="container">
          <h2 className="section-h2">{d.experience.heading}</h2>
          <div style={{ marginTop: 32 }}>
            {d.experience.items.map((item, i, arr) => (
              <div key={i} className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-year" style={{ whiteSpace: "pre-line" }}>{item.year}</div>
                </div>
                <div className="timeline-middle">
                  <div className="timeline-dot" />
                  {i < arr.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <p dangerouslySetInnerHTML={{ __html: item.html }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Projects ─── */}
      <div id="projects" className="section-gray">
        <div className="container">
          <h2 className="section-h2">{d.projects.heading}</h2>
          <p className="section-sub">
            {d.projects.viewAll}{" "}
            <a href="https://github.com/tuncer-byte" target="_blank" rel="noreferrer">github.com/tuncer-byte</a>
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {projectMeta.map((p, i) => {
              const desc = d.projects.items.find((item) => item.name === p.name)?.desc ?? "";
              return (
                <div
                  key={p.name}
                  style={{
                    padding: "18px 0",
                    borderBottom: i < projectMeta.length - 1 ? "1px solid var(--border)" : "none",
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
                  <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: 10 }}>{desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.tags.map((t) => (
                      <span key={t} style={{ fontSize: "0.74rem", fontFamily: "monospace", color: "var(--text-muted)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 99 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Courses ─── */}
      <div className="section-pad">
        <div className="container">
          <h2 className="section-h2">{d.courses.heading}</h2>
          <p className="section-sub">{d.courses.sub}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {courses.map((course, i) => (
              <a
                key={course.url}
                href={course.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", color: "var(--text)" }}
              >
                <div style={{ position: "relative", paddingBottom: "56.25%", background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.image} alt={course.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.93rem", fontFamily: "Georgia, serif", lineHeight: 1.4, marginBottom: 6 }}>
                    {course.title}
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: 10 }}>
                    {d.courses.items[i]?.headline}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {course.tags.map((t) => (
                      <span key={t} style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "var(--text-muted)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 99 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Videos ─── */}
      <div id="videos" className="section-gray">
        <div className="container">
          <h2 className="section-h2">{d.videos.heading}</h2>
          <p className="section-sub">
            <a href="https://www.youtube.com/@TuncerByte" target="_blank" rel="noreferrer">@TuncerByte</a>
            {" "}{d.videos.sub}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {videos.map((v) => (
              <a key={v.videoId} href={v.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "var(--text)" }}>
                <div style={{ position: "relative", paddingBottom: "56.25%", background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.thumbnail} alt={v.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: "0.86rem", lineHeight: 1.4, marginTop: 8, color: "var(--text)" }}>{v.title}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "monospace", marginTop: 3 }}>{v.published}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ─── Writing ─── */}
      <div className="section-pad">
        <div className="container">
          <h2 className="section-h2">{d.writing.heading}</h2>
          <p className="section-sub">
            {d.writing.sub}{" "}
            <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer">Medium</a>.
          </p>
          {posts.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              {posts.map((post) => (
                <div key={post.slug} className="blog-item">
                  <span className="blog-date">{post.date}</span>
                  <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                </div>
              ))}
            </div>
          )}
          <Link href={`/${locale}/blog`} style={{ fontSize: "0.92rem" }}>
            {d.writing.viewAll}
          </Link>
        </div>
      </div>
    </main>
  );
}
