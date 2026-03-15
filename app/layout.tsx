import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "Tuncer Bağçabaşı",
  description:
    "Tuncer Bağçabaşı — Software Engineer & AI Researcher. ASP.NET Core, TypeScript, Swift, Flutter ve AI araçları üzerine çalışıyor.",
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
