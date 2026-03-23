"use client";

import { useEffect, useState } from "react";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
  locale: string;
  className?: string;
}

export default function TableOfContents({ headings, locale, className }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className={`toc${className ? ` ${className}` : ""}`} aria-label="Table of contents">
      <p className="toc-title">{locale === "tr" ? "İçindekiler" : "Table of Contents"}</p>
      <ol className="toc-list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`toc-item${h.level === 3 ? " toc-item-h3" : ""}`}
          >
            <a
              href={`#${h.id}`}
              className={`toc-link${activeId === h.id ? " toc-link-active" : ""}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
