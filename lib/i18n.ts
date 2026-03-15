import { tr } from "@/dictionaries/tr";
import { en } from "@/dictionaries/en";

export type Locale = "tr" | "en";
export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

export function getDictionary(locale: string) {
  if (locale === "en") return en;
  return tr;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
