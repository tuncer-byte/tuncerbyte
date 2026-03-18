// Maps slug → { tr: string, en: string } for cross-language hreflang
// Add new pairs here whenever a TR/EN post is published

export const slugMap: Record<string, { tr: string; en: string }> = {
  // TR slugs
  "open-swe-nedir": { tr: "open-swe-nedir", en: "open-swe-framework" },
  "bir-gunde-ai-agent-kurulumu": { tr: "bir-gunde-ai-agent-kurulumu", en: "building-ai-agents-for-production" },
  "mcp-nedir-neden-onemli": { tr: "mcp-nedir-neden-onemli", en: "what-is-mcp" },
  "memory-bank-mcp-nedir": { tr: "memory-bank-mcp-nedir", en: "memory-bank-mcp" },
  "anthropic-academy-ucretsiz-kurslar": { tr: "anthropic-academy-ucretsiz-kurslar", en: "anthropic-academy-free-courses" },
  "claude-certified-architect-rehberi": { tr: "claude-certified-architect-rehberi", en: "claude-certified-architect-guide" },
  // EN slugs (reverse mapping)
  "open-swe-framework": { tr: "open-swe-nedir", en: "open-swe-framework" },
  "building-ai-agents-for-production": { tr: "bir-gunde-ai-agent-kurulumu", en: "building-ai-agents-for-production" },
  "what-is-mcp": { tr: "mcp-nedir-neden-onemli", en: "what-is-mcp" },
  "memory-bank-mcp": { tr: "memory-bank-mcp-nedir", en: "memory-bank-mcp" },
  "anthropic-academy-free-courses": { tr: "anthropic-academy-ucretsiz-kurslar", en: "anthropic-academy-free-courses" },
  "claude-certified-architect-guide": { tr: "claude-certified-architect-rehberi", en: "claude-certified-architect-guide" },
};

export function getAlternateSlug(slug: string, targetLocale: "tr" | "en"): string {
  return slugMap[slug]?.[targetLocale] ?? slug;
}
