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
  const navRef = useRef<HTMLElement | null>(null);
  const headingObserverRef = useRef<IntersectionObserver | null>(null);

  // Active heading tracking
  useEffect(() => {
    if (headings.length === 0) return;

    const headingEls = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    headingObserverRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    headingEls.forEach((el) => headingObserverRef.current!.observe(el));
    return () => headingObserverRef.current?.disconnect();
  }, [headings]);

  // Auto-collapse when ToC scrolls out of view
  useEffect(() => {
    const handleScroll = () => {
      const el = navRef.current;
      if (!el) return;
      if (el.getBoundingClientRect().bottom < 0) setOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav ref={navRef} className="toc" aria-label="Table of contents">
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
              <a
                href={`#${h.id}`}
                className="toc-link"
                onClick={() => setOpen(false)}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
