// Maps slug → { tr: string, en: string } for cross-language hreflang
// Add new pairs here whenever a TR/EN post is published

export const slugMap: Record<string, { tr: string; en: string }> = {
  // Pairs (bidirectional)
  "open-swe-nedir": { tr: "open-swe-nedir", en: "open-swe-framework" },
  "open-swe-framework": { tr: "open-swe-nedir", en: "open-swe-framework" },

  "bir-gunde-ai-agent-kurulumu": { tr: "bir-gunde-ai-agent-kurulumu", en: "building-ai-agents-for-production" },
  "building-ai-agents-for-production": { tr: "bir-gunde-ai-agent-kurulumu", en: "building-ai-agents-for-production" },

  "mcp-nedir-neden-onemli": { tr: "mcp-nedir-neden-onemli", en: "what-is-mcp" },
  "what-is-mcp": { tr: "mcp-nedir-neden-onemli", en: "what-is-mcp" },

  "memory-bank-mcp-nedir": { tr: "memory-bank-mcp-nedir", en: "memory-bank-mcp" },
  "memory-bank-mcp": { tr: "memory-bank-mcp-nedir", en: "memory-bank-mcp" },

  "anthropic-academy-ucretsiz-kurslar": { tr: "anthropic-academy-ucretsiz-kurslar", en: "anthropic-academy-free-courses" },
  "anthropic-academy-free-courses": { tr: "anthropic-academy-ucretsiz-kurslar", en: "anthropic-academy-free-courses" },

  "claude-certified-architect-rehberi": { tr: "claude-certified-architect-rehberi", en: "claude-certified-architect-guide" },
  "claude-certified-architect-guide": { tr: "claude-certified-architect-rehberi", en: "claude-certified-architect-guide" },

  "ai-devlerinden-9-teknik-rehber": { tr: "ai-devlerinden-9-teknik-rehber", en: "9-technical-ai-guides-big-tech" },
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

  // Newly mapped pairs
  "llm-kv-cache-nedir": { tr: "llm-kv-cache-nedir", en: "llm-kv-cache-explained" },
  "llm-kv-cache-explained": { tr: "llm-kv-cache-nedir", en: "llm-kv-cache-explained" },

  "claude-code-auto-mode-nedir": { tr: "claude-code-auto-mode-nedir", en: "claude-code-auto-mode" },
  "claude-code-auto-mode": { tr: "claude-code-auto-mode-nedir", en: "claude-code-auto-mode" },

  "claude-code-en-iyi-pratikler": { tr: "claude-code-en-iyi-pratikler", en: "claude-code-best-practices" },
  "claude-code-best-practices": { tr: "claude-code-en-iyi-pratikler", en: "claude-code-best-practices" },

  "claude-code-skills-nedir": { tr: "claude-code-skills-nedir", en: "claude-code-skills" },
  "claude-code-skills": { tr: "claude-code-skills-nedir", en: "claude-code-skills" },

  "claude-computer-use-rehberi": { tr: "claude-computer-use-rehberi", en: "claude-computer-use-guide" },
  "claude-computer-use-guide": { tr: "claude-computer-use-rehberi", en: "claude-computer-use-guide" },

  "claude-design-nedir": { tr: "claude-design-nedir", en: "claude-design-anthropic-labs" },
  "claude-design-anthropic-labs": { tr: "claude-design-nedir", en: "claude-design-anthropic-labs" },

  "claude-sonnet-4-7-nedir": { tr: "claude-sonnet-4-7-nedir", en: "claude-opus-4-7-released" },
  "claude-opus-4-7-released": { tr: "claude-sonnet-4-7-nedir", en: "claude-opus-4-7-released" },

  "claude-token-kullanim-optimizasyonu": { tr: "claude-token-kullanim-optimizasyonu", en: "claude-token-usage-optimization" },
  "claude-token-usage-optimization": { tr: "claude-token-kullanim-optimizasyonu", en: "claude-token-usage-optimization" },

  "deepseek-v4-nedir": { tr: "deepseek-v4-nedir", en: "deepseek-v4-released" },
  "deepseek-v4-released": { tr: "deepseek-v4-nedir", en: "deepseek-v4-released" },

  "design-md-nedir": { tr: "design-md-nedir", en: "design-md-google-guide" },
  "design-md-google-guide": { tr: "design-md-nedir", en: "design-md-google-guide" },

  "gpt-5-5-nedir": { tr: "gpt-5-5-nedir", en: "gpt-5-5-released" },
  "gpt-5-5-released": { tr: "gpt-5-5-nedir", en: "gpt-5-5-released" },

  "chatgpt-images-2-0-nedir": { tr: "chatgpt-images-2-0-nedir", en: "chatgpt-images-2-0" },
  "chatgpt-images-2-0": { tr: "chatgpt-images-2-0-nedir", en: "chatgpt-images-2-0" },

  "claude-40-gizli-ozellik-ayar-kisayol": { tr: "claude-40-gizli-ozellik-ayar-kisayol", en: "claude-40-hidden-features-settings-shortcuts" },
  "claude-40-hidden-features-settings-shortcuts": { tr: "claude-40-gizli-ozellik-ayar-kisayol", en: "claude-40-hidden-features-settings-shortcuts" },

  "ucretsiz-sertifikali-ai-egitimler": { tr: "ucretsiz-sertifikali-ai-egitimler", en: "free-certified-ai-courses-2026" },
  "free-certified-ai-courses-2026": { tr: "ucretsiz-sertifikali-ai-egitimler", en: "free-certified-ai-courses-2026" },

  "global-akseleratorler-startup-butcesi": { tr: "global-akseleratorler-startup-butcesi", en: "global-accelerators-startup-budget" },
  "global-accelerators-startup-budget": { tr: "global-akseleratorler-startup-butcesi", en: "global-accelerators-startup-budget" },

  "unity-ai-nedir-nasil-kullanilir": { tr: "unity-ai-nedir-nasil-kullanilir", en: "unity-ai-what-it-is-how-to-use" },
  "unity-ai-what-it-is-how-to-use": { tr: "unity-ai-nedir-nasil-kullanilir", en: "unity-ai-what-it-is-how-to-use" },

  "mcp-2026-spesifikasyonu-neler-yeni": { tr: "mcp-2026-spesifikasyonu-neler-yeni", en: "mcp-2026-specification-whats-new" },
  "mcp-2026-specification-whats-new": { tr: "mcp-2026-spesifikasyonu-neler-yeni", en: "mcp-2026-specification-whats-new" },

  "test-time-compute-inference-scaling-nedir": { tr: "test-time-compute-inference-scaling-nedir", en: "test-time-compute-inference-scaling-explained" },
  "test-time-compute-inference-scaling-explained": { tr: "test-time-compute-inference-scaling-nedir", en: "test-time-compute-inference-scaling-explained" },
};

export function getAlternateSlug(slug: string, targetLocale: "tr" | "en"): string | null {
  const mapping = slugMap[slug];
  if (!mapping) return null;
  return mapping[targetLocale] ?? null;
}
