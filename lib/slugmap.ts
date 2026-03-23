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
  "ai-devlerinden-9-teknik-rehber": { tr: "ai-devlerinden-9-teknik-rehber", en: "9-technical-ai-guides-big-tech" },
  // EN slugs (reverse mapping)
  "open-swe-framework": { tr: "open-swe-nedir", en: "open-swe-framework" },
  "building-ai-agents-for-production": { tr: "bir-gunde-ai-agent-kurulumu", en: "building-ai-agents-for-production" },
  "what-is-mcp": { tr: "mcp-nedir-neden-onemli", en: "what-is-mcp" },
  "memory-bank-mcp": { tr: "memory-bank-mcp-nedir", en: "memory-bank-mcp" },
  "anthropic-academy-free-courses": { tr: "anthropic-academy-ucretsiz-kurslar", en: "anthropic-academy-free-courses" },
  "claude-certified-architect-guide": { tr: "claude-certified-architect-rehberi", en: "claude-certified-architect-guide" },
  "9-technical-ai-guides-big-tech": { tr: "ai-devlerinden-9-teknik-rehber", en: "9-technical-ai-guides-big-tech" },
  "recaptcha-gizli-veri-fabrikasi": { tr: "recaptcha-gizli-veri-fabrikasi", en: "recaptcha-googles-hidden-data-factory" },
  "recaptcha-googles-hidden-data-factory": { tr: "recaptcha-gizli-veri-fabrikasi", en: "recaptcha-googles-hidden-data-factory" },
  "vibe-coding-temelleri": { tr: "vibe-coding-temelleri", en: "vibe-coding-fundamentals" },
  "vibe-coding-fundamentals": { tr: "vibe-coding-temelleri", en: "vibe-coding-fundamentals" },
  "google-stitch-vibe-design": { tr: "google-stitch-vibe-design", en: "google-stitch-vibe-design" },
  "claude-code-channels-nedir": { tr: "claude-code-channels-nedir", en: "claude-code-channels" },
  "claude-code-channels": { tr: "claude-code-channels-nedir", en: "claude-code-channels" },
  "google-stitch-kullanim-rehberi": { tr: "google-stitch-kullanim-rehberi", en: "google-stitch-usage-guide" },
  "google-stitch-usage-guide": { tr: "google-stitch-kullanim-rehberi", en: "google-stitch-usage-guide" },
  "claude-klasoru-anatomisi": { tr: "claude-klasoru-anatomisi", en: "anatomy-of-claude-folder" },
  "anatomy-of-claude-folder": { tr: "claude-klasoru-anatomisi", en: "anatomy-of-claude-folder" },
};

export function getAlternateSlug(slug: string, targetLocale: "tr" | "en"): string {
  return slugMap[slug]?.[targetLocale] ?? slug;
}
