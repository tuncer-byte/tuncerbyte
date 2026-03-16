const courses = [
  {
    url: "https://www.udemy.com/course/sifirdan-multi-agent-yapay-zeka-sistemleri-gelistirme/",
    titleTr: "Sıfırdan Multi-Agent Yapay Zekâ Sistemleri Geliştirme",
    titleEn: "Build Multi-Agent AI Systems from Scratch",
    descTr: "LangChain ve Google AI ile çok-ajanlı yapay zeka mimarileri kuruyoruz.",
    descEn: "Build multi-agent AI architectures with LangChain and Google AI.",
    image: "https://img-c.udemycdn.com/course/480x270/6885093_4481.jpg",
  },
  {
    url: "https://www.udemy.com/course/en-ince-detaylaryla-mcp-model-context-protocol/",
    titleTr: "En İnce Detaylarıyla MCP (Model Context Protocol)",
    titleEn: "Model Context Protocol — In Depth",
    descTr: "TypeScript ile MCP sunucuları ve istemcileri geliştirmeyi öğreniyoruz.",
    descEn: "Build MCP servers and clients with TypeScript from scratch.",
    image: "https://img-c.udemycdn.com/course/480x270/6557551_47f3_4.jpg",
  },
  {
    url: "https://www.udemy.com/course/yapay-zeka-ile-ai-agent-otomasyonu-yapmak/",
    titleTr: "Yapay Zeka ile AI Agent Otomasyonu Yapmak",
    titleEn: "AI Agent Automation with Artificial Intelligence",
    descTr: "Python ile AI agent iş akışları ve otomasyon sistemleri kuruyoruz.",
    descEn: "Build AI agent workflows and automation systems with Python.",
    image: "https://img-c.udemycdn.com/course/480x270/6452589_e9b3_2.jpg",
  },
  {
    url: "https://www.udemy.com/course/yapay-zeka-ile-yazlm-gelistirme-mobil-uygulama/",
    titleTr: "Yapay Zeka İle Yazılım Geliştirme — Mobil Uygulama",
    titleEn: "AI-Powered Mobile App Development",
    descTr: "Yapay zeka destekli mobil uygulama geliştirme tekniklerini öğreniyoruz.",
    descEn: "Learn AI-powered mobile application development techniques.",
    image: "https://img-c.udemycdn.com/course/480x270/6442111_338b_2.jpg",
  },
];

function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  }
  return h;
}

export function BlogCourseCta({ slug, locale }: { slug: string; locale: string }) {
  const course = courses[slugHash(slug) % courses.length];
  const isTr = locale === "tr";

  return (
    <a
      href={course.url}
      target="_blank"
      rel="noreferrer"
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "14px 16px",
          background: "var(--bg-section)",
          margin: "32px 0",
          transition: "border-color 0.15s",
        }}
        className="course-cta-card"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.image}
          alt={isTr ? course.titleTr : course.titleEn}
          loading="lazy"
          style={{
            width: 96,
            height: 54,
            objectFit: "cover",
            borderRadius: 4,
            flexShrink: 0,
            border: "1px solid var(--border)",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.4, marginBottom: 3, fontFamily: "Georgia, serif" }}>
            {isTr ? course.titleTr : course.titleEn}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 8 }}>
            {isTr ? course.descTr : course.descEn}
          </div>
          <span style={{
            display: "inline-block",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            fontWeight: 700,
            color: "var(--link)",
          }}>
            {isTr ? "Kursa git →" : "Go to course →"}
          </span>
        </div>
      </div>
    </a>
  );
}
