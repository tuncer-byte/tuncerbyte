import { projects, getProject } from "@/lib/projects";
import { getDictionary, isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const project of projects) {
      params.push({ lang: locale, slug: project.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const title = locale === "tr" ? project.name : project.name;
  const desc = locale === "tr" ? project.descTr : project.descEn;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${BASE_URL}/${locale}/projects/${slug}`,
      languages: {
        tr: `${BASE_URL}/tr/projects/${slug}`,
        en: `${BASE_URL}/en/projects/${slug}`,
      },
    },
    openGraph: {
      title: `${title} — Tuncer Bağçabaşı`,
      description: desc,
      url: `${BASE_URL}/${locale}/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const project = getProject(slug);

  if (!project) notFound();

  const isTr = locale === "tr";
  const desc = isTr ? project.longDescTr : project.longDescEn;

  return (
    <main>
      <div className="blog-post">
        <div className="container">
          <Link href={`/${locale}#projects`} className="back-link">
            {isTr ? "← Projeler" : "← Projects"}
          </Link>

          <div className="blog-post-header">
            <h1 style={{ fontFamily: "monospace" }}>{project.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
              <span className="blog-post-meta">★ {project.stars} GitHub stars</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  padding: "2px 8px",
                  borderRadius: 99,
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {project.status}
              </span>
            </div>
          </div>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, marginBottom: 32 }}>{desc}</p>

          {/* Features */}
          <h2 style={{ fontWeight: 700, marginBottom: 12, fontFamily: "monospace", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.82rem" }}>
            {isTr ? "Özellikler" : "Features"}
          </h2>
          <ul style={{ margin: "0 0 32px 0", padding: 0, listStyle: "none" }}>
            {project.features.map((f, i) => (
              <li key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: "0.93rem" }}>
                <span style={{ color: "var(--text-muted)", fontFamily: "monospace", flexShrink: 0 }}>→</span>
                {isTr ? f.tr : f.en}
              </li>
            ))}
          </ul>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
            {project.tags.map((t) => (
              <span key={t} style={{ fontSize: "0.74rem", fontFamily: "monospace", color: "var(--text-muted)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 99 }}>
                {t}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 20px",
                background: "var(--text)",
                color: "var(--bg)",
                borderRadius: 6,
                fontFamily: "monospace",
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              GitHub →
            </a>
            <Link
              href={`/${locale}#projects`}
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
              {isTr ? "Tüm Projeler" : "All Projects"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
