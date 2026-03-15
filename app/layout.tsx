import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import { Analytics } from "@vercel/analytics/next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Tuncer Bağçabaşı",
    template: "%s — Tuncer Bağçabaşı",
  },
  description:
    "Tuncer Bağçabaşı — Software Engineer & AI Researcher. ASP.NET Core, TypeScript, Swift, Flutter ve AI araçları üzerine çalışıyor.",
  openGraph: {
    type: "website",
    siteName: "Tuncer Bağçabaşı",
    locale: "tr_TR",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@tuncerbyte",
  },
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
