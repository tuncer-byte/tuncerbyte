"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface Props {
  currentLang: Locale;
  label: string;
}

export default function LanguageSwitcher({ currentLang, label }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = () => {
    const newLang: Locale = currentLang === "tr" ? "en" : "tr";
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={handleSwitch}
      aria-label={`Switch to ${label}`}
      style={{
        background: "none",
        border: "1px solid var(--border)",
        borderRadius: 4,
        padding: "2px 8px",
        fontSize: "0.78rem",
        fontFamily: "monospace",
        color: "var(--text-muted)",
        cursor: "pointer",
        lineHeight: 1.5,
      }}
    >
      {label}
    </button>
  );
}
