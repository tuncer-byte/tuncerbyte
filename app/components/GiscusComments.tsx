"use client";

import { useEffect, useRef } from "react";

interface Props {
  locale: string;
  slug: string;
}

export default function GiscusComments({ locale, slug }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "tuncer-byte/tuncerbyte");
    script.setAttribute("data-repo-id", "R_kgDOO_placeholder"); // set after enabling Discussions
    script.setAttribute("data-category", "Blog Comments");
    script.setAttribute("data-category-id", "DIC_placeholder"); // set after enabling Discussions
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", locale === "tr" ? "tr" : "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;
    ref.current.appendChild(script);
  }, [locale, slug]);

  return (
    <div style={{ marginTop: 48 }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
        {locale === "tr" ? "Yorumlar" : "Comments"}
      </h3>
      <div ref={ref} />
    </div>
  );
}
