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
  if (headings.length < 2) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="toc-title">{locale === "tr" ? "İçindekiler" : "Contents"}</p>
      <ol className="toc-list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`toc-item${h.level === 3 ? " toc-item-h3" : ""}`}
          >
            <a href={`#${h.id}`} className="toc-link">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
