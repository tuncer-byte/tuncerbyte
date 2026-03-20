import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist_Mono, Inter_Tight, Newsreader } from "next/font/google";
import HtmlLang from "./components/HtmlLang";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    template: "%s — Tuncer Bağçabaşı",
  },
  description:
    "Software engineer and AI researcher. Building MCP servers, TypeScript tools, and AI applications. Creating content on YouTube, Instagram and Medium.",
  keywords: [
    "Tuncer Bağçabaşı",
    "Tuncer Byte",
    "Software Engineer",
    "AI Researcher",
    "MCP",
    "Model Context Protocol",
    "TypeScript",
    "ASP.NET Core",
    "LangChain",
    "Yapay Zeka",
    "Yazılım Mühendisi",
    "İçerik Üretici",
    "Udemy",
    "YouTube",
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
  openGraph: {
    type: "website",
    siteName: "Tuncer Byte",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    url: BASE_URL,
    title: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    description:
      "Software engineer and AI researcher. Building MCP servers, TypeScript tools, and AI applications.",
    images: [{ url: `${BASE_URL}/opengraph-image` }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@tuncerbyte",
    site: "@tuncerbyte",
  },
  verification: {
    google: "gmlU2RQAogDtvys7gPQ2OH-seDBfpIWRACAFHC8fkEs",
  },
};

// Schema.org: Person
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: "Tuncer Bağçabaşı",
  alternateName: "Tuncer Byte",
  url: BASE_URL,
  image: `${BASE_URL}/profile.png`,
  jobTitle: "Software Engineer",
  description:
    "Software engineer and AI researcher. Builds MCP servers, TypeScript tools and AI applications. Creates content on YouTube, Instagram and Medium.",
  worksFor: {
    "@type": "Organization",
    name: "Architecht",
    url: "https://www.architecht.com",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Selçuk Üniversitesi",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Konya",
    addressCountry: "TR",
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
    "C#",
    "Model Context Protocol",
    "LangChain",
    "Multi-Agent AI Systems",
    "VS Code Extensions",
    "Python",
    "Artificial Intelligence",
    "Content Creation",
    "AI Product Development",
  ],
};

// Schema.org: WebSite (enables Google Sitelinks)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Tuncer Byte",
  description: "Software Engineer & AI Researcher — tuncer-byte.com",
  publisher: { "@id": `${BASE_URL}/#person` },
  inLanguage: ["tr-TR", "en-US"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${geistMono.variable} ${interTight.variable} ${newsreader.variable}`}>
      <head>
        {/* Flash-free theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t||(d?'dark':'light'));})()`,
          }}
        />
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Tuncer Bağçabaşı" href="/feed.xml" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <HtmlLang />
        <Analytics />
        {children}
        <GoogleAnalytics gaId="G-4QX10PW8RE" />
      </body>
    </html>
  );
}
