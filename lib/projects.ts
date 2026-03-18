export interface Project {
  slug: string;
  name: string;
  url: string;
  stars: number;
  tags: string[];
  descTr: string;
  descEn: string;
  longDescTr: string;
  longDescEn: string;
  features: { tr: string; en: string }[];
  status: "active" | "maintained" | "archived";
}

export const projects: Project[] = [
  {
    slug: "byte",
    name: "byte",
    url: "https://github.com/tuncer-byte/byte",
    stars: 21,
    tags: ["TypeScript", "VS Code Extension", "AI", "OpenAI", "Gemini", "Claude", "Ollama"],
    descTr: "VS Code için yapay zeka destekli kodlama asistanı.",
    descEn: "AI-powered coding assistant for VS Code.",
    longDescTr: "byte, VS Code içinden doğrudan OpenAI, Gemini, Claude ve Ollama modellerine erişim sağlayan açık kaynaklı bir kodlama asistanıdır. Hem bulut modelleri hem de tamamen yerel çalışan Ollama modelleriyle çalışır. Kod açıklama, refactoring, test yazma ve sohbet arayüzü özelliklerine sahiptir.",
    longDescEn: "byte is an open-source coding assistant for VS Code that connects directly to OpenAI, Gemini, Claude and Ollama models. Works with both cloud models and fully local Ollama models. Features code explanation, refactoring, test generation and a chat interface.",
    features: [
      { tr: "OpenAI, Gemini, Claude ve Ollama model desteği", en: "OpenAI, Gemini, Claude and Ollama model support" },
      { tr: "Tamamen yerel çalışma (Ollama)", en: "Fully local execution (Ollama)" },
      { tr: "Kod açıklama ve refactoring", en: "Code explanation and refactoring" },
      { tr: "Test kodu üretimi", en: "Test code generation" },
      { tr: "VS Code sohbet paneli entegrasyonu", en: "VS Code chat panel integration" },
    ],
    status: "active",
  },
  {
    slug: "cursor25x",
    name: "cursor25x",
    url: "https://github.com/tuncer-byte/cursor25x",
    stars: 22,
    tags: ["TypeScript", "MCP", "Cursor", "AI Agent"],
    descTr: "Cursor IDE için interaktif görev döngüsü MCP sunucusu.",
    descEn: "Interactive task-loop MCP server for Cursor IDE.",
    longDescTr: "cursor25x, Cursor IDE içinde karmaşık geliştirme iş akışlarını otomatikleştirmek için tasarlanmış bir MCP sunucusudur. Görev döngüleri oluşturarak agent'ların adım adım çalışmasını sağlar ve geliştirici onayıyla süreçleri kontrol altında tutar.",
    longDescEn: "cursor25x is an MCP server designed to automate complex development workflows inside Cursor IDE. Creates task loops that allow agents to work step by step, keeping processes under developer control with approval checkpoints.",
    features: [
      { tr: "Cursor IDE ile native entegrasyon", en: "Native Cursor IDE integration" },
      { tr: "Adım adım görev döngüsü yönetimi", en: "Step-by-step task loop management" },
      { tr: "Geliştirici onay noktaları", en: "Developer approval checkpoints" },
      { tr: "Karmaşık iş akışı otomasyonu", en: "Complex workflow automation" },
      { tr: "MCP protokolü üzerine inşa", en: "Built on MCP protocol" },
    ],
    status: "active",
  },
  {
    slug: "memory-bank-mcp",
    name: "memory-bank-MCP",
    url: "https://github.com/tuncer-byte/memory-bank-MCP",
    stars: 101,
    tags: ["TypeScript", "MCP", "Memory Management", "AI"],
    descTr: "Yapay zeka projeleri için yapılandırılmış bellek yönetimi sağlayan MCP sunucusu.",
    descEn: "MCP server providing structured memory management for AI projects.",
    longDescTr: "memory-bank-MCP, AI agent'ların ve asistanların oturumlar arasında bilgiyi kalıcı olarak saklamasını sağlayan bir MCP sunucusudur. PulseMCP'de en çok kullanılan sunucular arasında yer almaktadır. Yapılandırılmış bellek formatları, bağlam yönetimi ve hızlı bilgi erişimi özelliklerine sahiptir.",
    longDescEn: "memory-bank-MCP is an MCP server that enables AI agents and assistants to persistently store information across sessions. Ranked among the most-used servers on PulseMCP. Features structured memory formats, context management and fast information retrieval.",
    features: [
      { tr: "Oturumlar arası kalıcı bellek", en: "Persistent memory across sessions" },
      { tr: "Yapılandırılmış bellek formatları", en: "Structured memory formats" },
      { tr: "Hızlı bağlam erişimi", en: "Fast context retrieval" },
      { tr: "PulseMCP'de top-ranked", en: "Top-ranked on PulseMCP" },
      { tr: "Tüm MCP uyumlu sistemlerle çalışır", en: "Works with any MCP-compatible system" },
    ],
    status: "active",
  },
  {
    slug: "computer-vision",
    name: "computer-vision",
    url: "https://github.com/atesbey-design/computer-vision",
    stars: 9,
    tags: ["Python", "Computer Vision", "Gemini", "LLaMA", "Ollama"],
    descTr: "Gemini Pro Vision, LLaMA ve Ollama kullanan bilgisayarlı görü asistanı.",
    descEn: "Computer vision assistant using Gemini Pro Vision, LLaMA and Ollama.",
    longDescTr: "Python ile yazılmış bu proje, Gemini Pro Vision, LLaMA ve Ollama modellerini kullanarak görüntü analizi ve açıklama üretimi yapar. Hem bulut tabanlı hem de yerel model desteği sunar. Görüntü içeriğini anlayan ve sorgulara yanıt veren interaktif bir asistan olarak çalışır.",
    longDescEn: "Written in Python, this project performs image analysis and description generation using Gemini Pro Vision, LLaMA and Ollama models. Supports both cloud-based and local models. Works as an interactive assistant that understands image content and responds to queries.",
    features: [
      { tr: "Gemini Pro Vision, LLaMA ve Ollama desteği", en: "Gemini Pro Vision, LLaMA and Ollama support" },
      { tr: "Görüntü analizi ve açıklama üretimi", en: "Image analysis and description generation" },
      { tr: "Yerel model desteği", en: "Local model support" },
      { tr: "Görüntü içeriği sorgulama", en: "Image content querying" },
      { tr: "Python CLI arayüzü", en: "Python CLI interface" },
    ],
    status: "maintained",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
