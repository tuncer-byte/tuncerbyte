import Link from "next/link";
import type { PostData } from "@/lib/posts";

interface Props {
  currentSlug: string;
  seriesPosts: PostData[];
  locale: string;
  seriesTitle: string;
}

export default function SeriesNav({ currentSlug, seriesPosts, locale, seriesTitle }: Props) {
  if (seriesPosts.length < 2) return null;

  return (
    <div className="series-nav">
      <p className="series-nav-label">
        {locale === "tr" ? "Bu seri:" : "This series:"}
        <span className="series-nav-title">{seriesTitle}</span>
      </p>
      <ol className="series-nav-list">
        {seriesPosts.map((post, i) => (
          <li key={post.slug} className={`series-nav-item${post.slug === currentSlug ? " series-nav-current" : ""}`}>
            {post.slug === currentSlug ? (
              <span className="series-nav-current-label">
                <span className="series-nav-num">{i + 1}.</span>
                {post.title}
                <span className="series-nav-reading">{locale === "tr" ? " — şu an okuyorsunuz" : " — currently reading"}</span>
              </span>
            ) : (
              <Link href={`/${locale}/blog/${post.slug}`} className="series-nav-link">
                <span className="series-nav-num">{i + 1}.</span>
                {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
