"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LOCALES = ["tr", "en"];

export default function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname.split("/")[1];
    const locale = LOCALES.includes(segment) ? segment : "tr";
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
