import type { Dictionary } from "./tr";

export const en: Dictionary = {
  lang: "en" as const,

  nav: {
    experience: "experience",
    projects: "projects",
    videos: "videos",
    blog: "blog",
    switchLang: "TR",
  },

  meta: {
    title: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    description:
      "Konya-based software engineer and AI researcher. Building open source projects around MCP servers, TypeScript, ASP.NET Core and AI tools. Teaching 10,000+ students on Udemy.",
  },

  hero: {
    tagline: "Software Engineer · AI Researcher · Content Creator",
  },

  about: {
    heading: "About",
    p1: `Konya-based software engineer and AI researcher. I work as a Software Engineer at <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a>, building enterprise fintech applications with .NET (ASP.NET Core, C#) and modern frontend technologies. Computer Engineering graduate from Selçuk University.`,
    p2: `Beyond full-stack development, I have hands-on experience with Swift (iOS) and Flutter on mobile. In open source, I build AI tools, MCP servers and VS Code extensions with TypeScript and Python. I publish Turkish technical content on YouTube and Udemy.`,
    p3: `I write on Medium about Rust, Flutter, Swift and software architecture. <a href="https://medium.com/@tuncerbyte" target="_blank" rel="noreferrer">medium.com/@tuncerbyte</a>`,
  },

  experience: {
    heading: "Experience",
    items: [
      {
        year: "Jul 2024 –\npresent",
        html: `<strong>Software Engineer</strong> at <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a> (full-time · Konya · on-site). Building enterprise .NET and C# applications in the fintech domain.`,
      },
      {
        year: "Nov 2023 –\nMay 2024",
        html: `<strong>Full-stack Developer</strong> at <a href="https://www.architecht.com.tr" target="_blank" rel="noreferrer">Architecht</a> (part-time · hybrid). Frontend development with Angular and JavaScript, plus ASP.NET Core backend work.`,
      },
      {
        year: "Oct 2022 –\nJan 2024",
        html: `<strong>Developer</strong> at <strong>Truefeedback</strong> (full-time · Konya). Joined as an intern and transitioned to full-time. Built full-stack web applications.`,
      },
      {
        year: "Mar 2022 –\nSep 2024",
        html: `<strong>Board Member</strong> at <a href="https://github.com/selcukchain" target="_blank" rel="noreferrer">Selçuk Blockchain</a> (2 yrs 7 mo). Founded the blockchain community at Selçuk University, teaching Web3, smart contracts and crypto technologies.`,
      },
    ],
  },

  projects: {
    heading: "Projects",
    viewAll: "All projects on",
    items: [
      {
        name: "byte",
        desc: "AI-powered coding assistant for VS Code. Supports OpenAI, Gemini, Claude and Ollama. Open source developer tool for both local and cloud models.",
      },
      {
        name: "cursor25x",
        desc: "Interactive task-loop MCP server for Cursor IDE. Designed to automate complex development workflows.",
      },
      {
        name: "memory-bank-MCP",
        desc: "MCP server providing structured memory management for AI projects. Ranked among the most-used servers on PulseMCP.",
      },
      {
        name: "computer-vision",
        desc: "Computer vision assistant using Gemini Pro Vision, LLaMA and Ollama. Written in Python with image analysis and description generation.",
      },
    ],
  },

  courses: {
    heading: "Courses",
    sub: "I publish Turkish AI and software development courses on Udemy.",
    items: [
      { headline: "Build your own multi-agent AI architecture using LangChain and Google AI" },
      { headline: "Learn to quickly integrate AI models with external data sources using MCP" },
      { headline: "Code AI Agent automation with AI — get familiar with both AI and the software process." },
      { headline: "AI in mobile apps: learn to code with tomorrow's technology" },
    ],
  },

  videos: {
    heading: "Videos",
    sub: "— Turkish content on AI tools, software development and developer experience.",
  },

  writing: {
    heading: "Writing",
    sub: "Notes on software, AI and developer experience.",
    mediumNote: "Also publishing on Medium.",
    viewAll: "See all posts →",
  },

  blog: {
    back: "← Posts",
    backAll: "← All posts",
    heading: "Writing",
    sub: "Notes on software, AI and developer experience.",
    empty: "No posts yet.",
  },

  footer: {
    copy: "© 2025 Tuncer Bağçabaşı",
  },
};
