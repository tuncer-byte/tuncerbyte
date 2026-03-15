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
    "Konya-based software engineer and AI researcher. Building MCP servers, TypeScript tools, and AI applications.",
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
    "Konya-based software engineer and AI researcher. Building MCP servers, TypeScript tools and AI applications.",
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
        {children}
        <GoogleAnalytics gaId="G-4QX10PW8RE" />
      </body>
    </html>
  );
}
