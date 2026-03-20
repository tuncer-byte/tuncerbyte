import type { Dictionary } from "./tr";

export const en: Dictionary = {
  lang: "en" as const,

  nav: {
    experience: "experience",
    projects: "projects",
    videos: "videos",
    blog: "blog",
    contact: "contact",
    switchLang: "TR",
  },

  meta: {
    title: "Tuncer Bağçabaşı — Software Engineer & AI Researcher",
    description:
      "Computer Engineering graduate from Selçuk University. Software Engineer at Architecht working with .NET and React. Builds open source AI tools — agents, MCP servers, and autonomous systems. Delivers AI training on YouTube, Udemy and LinkedIn.",
  },

  hero: {
    tagline: "Software Engineer · AI Researcher · Educator",
  },

  about: {
    heading: "About",
    p1: `Computer Engineering graduate from Selçuk University. I currently work as a Software Engineer at <a href="https://www.architecht.com" target="_blank" rel="noreferrer">Architecht</a>, building enterprise fintech applications with .NET and React. I started my career contributing to community-driven open source projects and working as a freelance full-stack developer with Node.js and React, gaining experience across a wide range of products and domains.`,
    p2: `For the past 3 years I've been focused on building AI-powered products — AI agents, autonomous systems, MCP servers, and workflow automation are my core areas. I build open source tooling in this space with TypeScript and Python; <a href="https://github.com/tuncer-byte/memory-bank-MCP" target="_blank" rel="noreferrer">memory-bank-MCP</a> has become one of the most-used servers in the global MCP ecosystem.`,
    p3: `I create Turkish-language content about AI and software development on YouTube, Instagram, LinkedIn, and Udemy, and deliver AI training programs at various platforms and organizations.`,
  },

  stack: {
    heading: "Stack",
    sub: "Technologies and tools I work with daily.",
  },

  series: {
    label: "Series",
    parts: "parts",
    read: "Start series →",
  },

  experience: {
    heading: "Experience",
    items: [
      {
        year: "Jul 2024 –\npresent",
        html: `<strong>Software Engineer</strong> at <a href="https://www.architecht.com" target="_blank" rel="noreferrer">Architecht</a> (full-time · Konya · on-site). Building enterprise .NET and C# applications in the fintech domain.`,
      },
      {
        year: "Nov 2023 –\nMay 2024",
        html: `<strong>Full-stack Developer</strong> at <a href="https://www.architecht.com" target="_blank" rel="noreferrer">Architecht</a> (part-time · hybrid). Frontend development with Angular and JavaScript, plus ASP.NET Core backend work.`,
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
