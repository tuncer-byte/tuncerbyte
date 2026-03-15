export const tr = {
  lang: "tr" as "tr" | "en",

  nav: {
    experience: "deneyim",
    projects: "projeler",
    videos: "videolar",
    blog: "blog",
    switchLang: "EN",
  },

  meta: {
    title: "Tuncer Bağçabaşı — Yazılım Mühendisi & AI Araştırmacısı",
    description:
      "Konya merkezli yazılım mühendisi ve AI araştırmacısı. MCP sunucuları, TypeScript, ASP.NET Core ve yapay zeka araçları üzerine açık kaynak projeler üretiyor. Udemy'de 10.000+ öğrenciye kurs veriyor.",
  },

  hero: {
    tagline: "Software Engineer · AI Researcher · İçerik Üreticisi",
  },

  about: {
    heading: "Hakkımda",
    p1: `Konya merkezli yazılım mühendisi ve AI araştırmacısı. <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a>'te Software Engineer olarak .NET ekosistemi (ASP.NET Core, C#) ve modern frontend teknolojileriyle çalışıyorum. Selçuk Üniversitesi Bilgisayar Mühendisliği mezunuyum.`,
    p2: `Full-stack geliştirmenin yanı sıra mobil tarafta Swift (iOS) ve Flutter ile deneyim sahibiyim. Açık kaynak tarafında TypeScript ve Python ile AI araçları, MCP sunucuları ve VS Code uzantıları üretiyorum. YouTube kanalımda ve Udemy'de Türkçe teknik içerikler paylaşıyorum.`,
    p3: `Medium'da Rust, Flutter, Swift ve yazılım mimarisi üzerine makaleler yazıyorum. <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer">medium.com/@tuncerbyte</a>`,
  },

  experience: {
    heading: "Deneyim",
    items: [
      {
        year: "Tem 2024 –\ndevam ediyor",
        html: `<a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a>'te <strong>Software Engineer</strong> (tam zamanlı · Konya · ofiste). Fintech alanında .NET ve C# tabanlı kurumsal uygulamalar geliştiriyorum.`,
      },
      {
        year: "Kas 2023 –\nMay 2024",
        html: `<a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a>'te <strong>Full-stack Developer</strong> (yarı zamanlı · hibrit). Ön uç geliştirme (Angular, JavaScript) ve ASP.NET Core backend çalışmaları yaptım.`,
      },
      {
        year: "Eki 2022 –\nOca 2024",
        html: `<strong>Truefeedback</strong>'te <strong>Developer</strong> (tam zamanlı · Konya). Stajdan başlayarak tam zamanlı pozisyona geçtim. Full-stack web uygulamaları geliştirdim.`,
      },
      {
        year: "Mar 2022 –\nEyl 2024",
        html: `<a href="https://github.com/selcukchain" target="_blank" rel="noreferrer">Selçuk Blockchain</a>'de <strong>Board Member</strong> (2 yıl 7 ay). Selçuk Üniversitesi bünyesinde blockchain topluluğu kurarak öğrencilere Web3, akıllı sözleşmeler ve kripto teknolojilerini anlattım.`,
      },
    ],
  },

  projects: {
    heading: "Projeler",
    viewAll: "Tüm projeler için",
    items: [
      {
        name: "byte",
        desc: "VS Code için yapay zeka destekli kodlama asistanı. OpenAI, Gemini, Claude ve Ollama modellerini destekliyor. Yerel ve bulut modellerle çalışan açık kaynaklı geliştirici aracı.",
      },
      {
        name: "cursor25x",
        desc: "Cursor IDE için interaktif görev döngüsü MCP sunucusu. Karmaşık geliştirme iş akışlarını otomatikleştirmek için tasarlandı.",
      },
      {
        name: "memory-bank-MCP",
        desc: "Yapay zeka projeleri için yapılandırılmış bellek yönetimi sağlayan MCP sunucusu. PulseMCP'de en çok kullanılan sunucular arasında yer alıyor.",
      },
      {
        name: "computer-vision",
        desc: "Gemini Pro Vision, LLaMA ve Ollama kullanan bilgisayarlı görü asistanı. Görüntü analizi ve açıklama üretme yetenekleriyle Python ile yazıldı.",
      },
    ],
  },

  courses: {
    heading: "Eğitimler",
    sub: "Udemy'de yapay zeka ve yazılım geliştirme üzerine Türkçe kurslar yayınlıyorum.",
    items: [
      { headline: "LangChain, Google AI kullanarak kendi çok-ajanlı yapay zekâ mimarinizi inşa edelim" },
      { headline: "MCP ile yapay zeka modellerini harici veri kaynaklarına hızlıca entegre etmeyi öğrenin" },
      { headline: "Yapay zeka kullanarak AI Agent otomasyonu kodlayalım. Hem AI'yı hem yazılım sürecini öğrenelim." },
      { headline: "Mobil uygulamalarda yapay zeka: geleceğin teknolojisiyle kod yazmayı öğrenin" },
    ],
  },

  videos: {
    heading: "Videolar",
    sub: "— AI araçları, yazılım geliştirme ve geliştirici deneyimi üzerine Türkçe içerikler.",
  },

  writing: {
    heading: "Yazılar",
    sub: "Yazılım, yapay zeka ve geliştirici deneyimi üzerine notlar.",
    mediumNote: "Medium'da da yayınlıyorum.",
    viewAll: "Tüm yazıları gör →",
  },

  blog: {
    back: "← Yazılar",
    backAll: "← Tüm yazılar",
    heading: "Yazılar",
    sub: "Yazılım, yapay zeka ve geliştirici deneyimi üzerine notlar ve düşünceler.",
    empty: "Henüz yazı yok. Yakında eklenecek.",
  },

  footer: {
    copy: "© 2025 Tuncer Bağçabaşı",
  },
};

export type Dictionary = typeof tr;
