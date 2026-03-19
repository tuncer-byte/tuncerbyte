import type { NextConfig } from "next";

// Inline script hashes (computed from exact script content)
// Theme toggle: app/layout.tsx dangerouslySetInnerHTML
// GA init:      @next/third-parties/google internal inline script
const SCRIPT_HASHES = [
  "'sha256-Em2INw/p3MvDDJ7ZBSe+3akepeUxpkj4PXR8zfB+yGc='", // theme toggle
  "'sha256-eex8r1kOGoZtKmETxq9+7ps/DyNc+NqwM0BaJk881N0='", // GA init
].join(" ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' ${SCRIPT_HASHES} https://www.googletagmanager.com`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img-c.udemycdn.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
