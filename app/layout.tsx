import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    template: "%s — Tuncer Bağçabaşı",
  },
  description:
    "Konya-based software engineer and AI researcher. Building MCP servers, TypeScript tools, and AI applications. 10,000+ students on Udemy.",
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
    "Yapay Zeka",
    "Yazılım Mühendisi",
    "Udemy",
    "Konya",
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
    siteName: "Tuncer Bağçabaşı",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    url: BASE_URL,
    title: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    description:
      "Konya-based software engineer and AI researcher. Building MCP servers, TypeScript tools, and AI applications.",
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
    "Konya-based software engineer and AI researcher. Builds MCP servers, TypeScript tools and AI applications. Teaches 10,000+ students on Udemy.",
  worksFor: {
    "@type": "Organization",
    name: "Architecht",
    url: "https://www.architecht.com.tr",
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
    "Swift",
    "Flutter",
    "Model Context Protocol",
    "LangChain",
    "Multi-Agent AI Systems",
    "Mobile Development",
    "VS Code Extensions",
    "Python",
    "Artificial Intelligence",
  ],
};

// Schema.org: WebSite (enables Google Sitelinks)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Tuncer Bağçabaşı",
  description: "Software Engineer & AI Researcher — tuncer-byte.com",
  publisher: { "@id": `${BASE_URL}/#person` },
  inLanguage: ["tr-TR", "en-US"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") ?? "tr";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Flash-free theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t||(d?'dark':'light'));})()`,
          }}
        />
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
        <Analytics />
        {children}
        <GoogleAnalytics gaId="G-4QX10PW8RE" />
      </body>
    </html>
  );
}
