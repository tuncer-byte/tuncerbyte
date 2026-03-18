"use client";

import { useState } from "react";

interface Props {
  title: string;
  url: string;
  locale: string;
}

export default function ShareButtons({ title, url, locale }: Props) {
  const [copied, setCopied] = useState(false);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing silently
    }
  };

  return (
    <div className="share-buttons">
      <span className="share-label">{locale === "tr" ? "Paylaş" : "Share"}</span>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="share-btn">
        X / Twitter
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="share-btn">
        LinkedIn
      </a>
      <button onClick={copyLink} className="share-btn share-btn-copy">
        {copied
          ? locale === "tr" ? "Kopyalandı ✓" : "Copied ✓"
          : locale === "tr" ? "Linki Kopyala" : "Copy Link"}
      </button>
    </div>
  );
}
