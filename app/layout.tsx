import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    template: "%s — Tuncer Bağçabaşı",
  },
  description:
    "Tuncer Bağçabaşı — Konya merkezli Software Engineer ve AI Researcher. MCP sunucuları, TypeScript, ASP.NET Core, Swift ve yapay zeka araçları üzerine açık kaynak projeler üretiyor. Udemy'de 10.000+ öğrenciye yapay zeka ve mobil geliştirme kursları veriyor.",
  keywords: [
    "Tuncer Bağçabaşı",
    "Tuncer Byte",
    "Software Engineer",
    "AI Researcher",
    "MCP",
    "Model Context Protocol",
    "TypeScript",
    "ASP.NET Core",
    "Swift",
    "Flutter",
    "LangChain",
    "Multi-Agent AI",
    "Udemy",
    "yapay zeka",
    "yazılım mühendisi",
  ],
  authors: [{ name: "Tuncer Bağçabaşı", url: BASE_URL }],
  creator: "Tuncer Bağçabaşı",
  publisher: "Tuncer Bağçabaşı",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Tuncer Bağçabaşı",
    locale: "tr_TR",
    url: BASE_URL,
    title: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    description:
      "Konya merkezli Software Engineer ve AI Researcher. MCP sunucuları, TypeScript ve yapay zeka araçları üzerine açık kaynak projeler üretiyor.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@tuncerbyte",
    site: "@tuncerbyte",
    title: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    description:
      "Konya merkezli Software Engineer ve AI Researcher. MCP, TypeScript, Swift ve yapay zeka.",
  },
  verification: {
    google: "gmlU2RQAogDtvys7gPQ2OH-seDBfpIWRACAFHC8fkEs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tuncer Bağçabaşı",
  alternateName: "Tuncer Byte",
  url: BASE_URL,
  image: `${BASE_URL}/profile.png`,
  jobTitle: "Software Engineer",
  description:
    "Konya merkezli Software Engineer ve AI Researcher. MCP sunucuları, TypeScript, ASP.NET Core, Swift ve yapay zeka araçları üzerine açık kaynak projeler üretiyor.",
  worksFor: {
    "@type": "Organization",
    name: "Architecht",
    url: "https://www.architecht.com.tr",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Selçuk Üniversitesi",
  },
  sameAs: [
    "https://github.com/tuncer-byte",
    "https://www.linkedin.com/in/tuncer-bagcabasi/",
    "https://www.youtube.com/@TuncerByte",
    "https://medium.com/@tuncerbyte",
    "https://www.instagram.com/tuncerbyte",
    "https://www.udemy.com/user/tuncerbhc/",
  ],
  knowsAbout: [
    "TypeScript",
    "ASP.NET Core",
    "Swift",
    "Flutter",
    "Model Context Protocol",
    "LangChain",
    "Multi-Agent AI Systems",
    "Mobile Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Apply theme before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t||(d?'dark':'light'));})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Analytics />
        <nav>
          <div className="container">
            <Link href="/" className="nav-brand">
              tuncer byte
            </Link>
            <div className="nav-links">
              <Link href="/#experience">deneyim</Link>
              <Link href="/#projects">projeler</Link>
              <Link href="/#videos">videolar</Link>
              <Link href="/blog">blog</Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
        {children}
        <GoogleAnalytics gaId="G-4QX10PW8RE" />
        <footer>
          <div className="container">
            <p>
              © 2025 Tuncer Bağçabaşı ·{" "}
              <a href="https://github.com/tuncer-byte" target="_blank" rel="noreferrer">
                GitHub
              </a>{" "}
              ·{" "}
              <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer">
                Medium
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
