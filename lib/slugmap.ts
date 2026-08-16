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
  "turboquant-asiri-sikistirma-ile-llm-verimliligi": { tr: "turboquant-asiri-sikistirma-ile-llm-verimliligi", en: "turboquant-extreme-compression-llm-efficiency" },
  "turboquant-extreme-compression-llm-efficiency": { tr: "turboquant-asiri-sikistirma-ile-llm-verimliligi", en: "turboquant-extreme-compression-llm-efficiency" },
  "rate-limiting-nasil-kurgulanmali": { tr: "rate-limiting-nasil-kurgulanmali", en: "how-to-design-rate-limiting" },
  "how-to-design-rate-limiting": { tr: "rate-limiting-nasil-kurgulanmali", en: "how-to-design-rate-limiting" },
  "claude-fable-5-mythos-5-yayinlandi": { tr: "claude-fable-5-mythos-5-yayinlandi", en: "claude-fable-5-mythos-5" },
  "claude-fable-5-mythos-5": { tr: "claude-fable-5-mythos-5-yayinlandi", en: "claude-fable-5-mythos-5" },
  "claude-fable-5-ihracat-kontrolu-krizi": { tr: "claude-fable-5-ihracat-kontrolu-krizi", en: "claude-fable-5-export-control-crisis" },
  "claude-fable-5-export-control-crisis": { tr: "claude-fable-5-ihracat-kontrolu-krizi", en: "claude-fable-5-export-control-crisis" },
  "grok-4-5-nedir": { tr: "grok-4-5-nedir", en: "grok-4-5-released" },
  "grok-4-5-released": { tr: "grok-4-5-nedir", en: "grok-4-5-released" },
  "gpt-5-6-sol-terra-luna-nedir": { tr: "gpt-5-6-sol-terra-luna-nedir", en: "gpt-5-6-sol-terra-luna-released" },
  "gpt-5-6-sol-terra-luna-released": { tr: "gpt-5-6-sol-terra-luna-nedir", en: "gpt-5-6-sol-terra-luna-released" },
  "meta-muse-spark-1-1-nedir": { tr: "meta-muse-spark-1-1-nedir", en: "meta-muse-spark-1-1-released" },
  "meta-muse-spark-1-1-released": { tr: "meta-muse-spark-1-1-nedir", en: "meta-muse-spark-1-1-released" },
  "gemini-3-5-pro-neden-gecikti": { tr: "gemini-3-5-pro-neden-gecikti", en: "why-gemini-3-5-pro-was-delayed" },
  "why-gemini-3-5-pro-was-delayed": { tr: "gemini-3-5-pro-neden-gecikti", en: "why-gemini-3-5-pro-was-delayed" },
  "claude-opus-5-nedir": { tr: "claude-opus-5-nedir", en: "claude-opus-5-released" },
  "claude-opus-5-released": { tr: "claude-opus-5-nedir", en: "claude-opus-5-released" },
  "grok-4-6-nedir": { tr: "grok-4-6-nedir", en: "grok-4-6-released" },
  "grok-4-6-released": { tr: "grok-4-6-nedir", en: "grok-4-6-released" },
  "anthropic-ilk-kar-openai-halka-arz": { tr: "anthropic-ilk-kar-openai-halka-arz", en: "anthropic-first-profit-openai-ipo" },
  "anthropic-first-profit-openai-ipo": { tr: "anthropic-ilk-kar-openai-halka-arz", en: "anthropic-first-profit-openai-ipo" },
};

export function getAlternateSlug(slug: string, targetLocale: "tr" | "en"): string {
  return slugMap[slug]?.[targetLocale] ?? slug;
}
