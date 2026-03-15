import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { getDictionary, isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale;
  const d = getDictionary(locale);

  return (
    <>
      <nav>
        <div className="container">
          <Link href={`/${locale}`} className="nav-brand">
            tuncer byte
          </Link>
          <div className="nav-links">
            <Link href={`/${locale}#experience`}>{d.nav.experience}</Link>
            <Link href={`/${locale}#projects`}>{d.nav.projects}</Link>
            <Link href={`/${locale}#videos`}>{d.nav.videos}</Link>
            <Link href={`/${locale}/blog`}>{d.nav.blog}</Link>
            <LanguageSwitcher currentLang={locale} label={d.nav.switchLang} />
            <ThemeToggle />
          </div>
        </div>
      </nav>
      {children}
      <footer>
        <div className="container">
          <p>
            {d.footer.copy} ·{" "}
            <a href="https://github.com/tuncer-byte" target="_blank" rel="noreferrer">
              GitHub
            </a>{" "}
            ·{" "}
            <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer">
              Medium
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
