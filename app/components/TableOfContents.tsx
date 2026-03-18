"use client";

import { useEffect, useRef, useState } from "react";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
  locale: string;
}

export default function TableOfContents({ headings, locale }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingEls = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    headingEls.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <button
        className="toc-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{locale === "tr" ? "İçindekiler" : "Contents"}</span>
        <span className={`toc-arrow${open ? " open" : ""}`}>▾</span>
      </button>
      {open && (
        <ol className="toc-list">
          {headings.map((h) => (
            <li
              key={h.id}
              className={`toc-item${h.level === 3 ? " toc-item-h3" : ""}${activeId === h.id ? " toc-active" : ""}`}
            >
              <a href={`#${h.id}`} className="toc-link">
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
