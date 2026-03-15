import { XMLParser } from "fast-xml-parser";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

const CHANNEL_ID = "UCQHqRmu1sqweqbCL_Zkfoag";

export async function getLatestVideos(count = 10): Promise<YouTubeVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const res = await fetch(rssUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return fallbackVideos.slice(0, count);

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const data = parser.parse(xml);

    const entries = data?.feed?.entry;
    if (!entries) return fallbackVideos.slice(0, count);

    const items = Array.isArray(entries) ? entries : [entries];
    return items.slice(0, count).map((entry: Record<string, unknown>) => {
      const videoId = (entry["yt:videoId"] as string) || "";
      const mediaGroup = entry["media:group"] as Record<string, unknown> | undefined;
      const thumbnail =
        (mediaGroup?.["media:thumbnail"] as Record<string, string> | undefined)?.[
          "@_url"
        ] || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return {
        videoId,
        title: entry.title as string,
        published: ((entry.published as string) || "").slice(0, 10),
        thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  } catch {
    return fallbackVideos.slice(0, count);
  }
}

// Static fallback in case RSS is unreachable at build time
const fallbackVideos: YouTubeVideo[] = [
  { videoId: "B-0mV3lVQ5A", title: "Kangal ile Microservice Nedir?", published: "2026-01-06", thumbnail: "https://img.youtube.com/vi/B-0mV3lVQ5A/hqdefault.jpg", url: "https://www.youtube.com/watch?v=B-0mV3lVQ5A" },
  { videoId: "4-C8NO7pn1A", title: "Kangal ile Load Balancer Nedir?", published: "2026-01-02", thumbnail: "https://img.youtube.com/vi/4-C8NO7pn1A/hqdefault.jpg", url: "https://www.youtube.com/watch?v=4-C8NO7pn1A" },
  { videoId: "NROWqWrMzyg", title: "Kangal ile Kubernates Nedir?", published: "2025-12-29", thumbnail: "https://img.youtube.com/vi/NROWqWrMzyg/hqdefault.jpg", url: "https://www.youtube.com/watch?v=NROWqWrMzyg" },
  { videoId: "sCR3_niwaFQ", title: "Kangal ile Docker Nedir?", published: "2025-12-25", thumbnail: "https://img.youtube.com/vi/sCR3_niwaFQ/hqdefault.jpg", url: "https://www.youtube.com/watch?v=sCR3_niwaFQ" },
  { videoId: "0WlOj0YxRIc", title: "Kangal ile API nedir?", published: "2025-12-18", thumbnail: "https://img.youtube.com/vi/0WlOj0YxRIc/hqdefault.jpg", url: "https://www.youtube.com/watch?v=0WlOj0YxRIc" },
  { videoId: "gjnLtAGR_eQ", title: "Google Bolt ve Lovable'ı tokatlamaya gelmiş", published: "2025-12-09", thumbnail: "https://img.youtube.com/vi/gjnLtAGR_eQ/hqdefault.jpg", url: "https://www.youtube.com/watch?v=gjnLtAGR_eQ" },
  { videoId: "9BPnPHhVKjk", title: "Google Antigravity (Büyük Hayal Kırıklığı)", published: "2025-11-21", thumbnail: "https://img.youtube.com/vi/9BPnPHhVKjk/hqdefault.jpg", url: "https://www.youtube.com/watch?v=9BPnPHhVKjk" },
  { videoId: "aCHtZtAphoM", title: "Google Antigravity - Cursor işine bak", published: "2025-11-18", thumbnail: "https://img.youtube.com/vi/aCHtZtAphoM/hqdefault.jpg", url: "https://www.youtube.com/watch?v=aCHtZtAphoM" },
  { videoId: "deUCsISO9IA", title: "MCP Dersleri P8 - Firecrawl MCP kullanımı", published: "2025-11-06", thumbnail: "https://img.youtube.com/vi/deUCsISO9IA/hqdefault.jpg", url: "https://www.youtube.com/watch?v=deUCsISO9IA" },
  { videoId: "3oEuBykCANo", title: "MCP Dersleri P7 - Firecrawl MCP kullanımı", published: "2025-11-02", thumbnail: "https://img.youtube.com/vi/3oEuBykCANo/hqdefault.jpg", url: "https://www.youtube.com/watch?v=3oEuBykCANo" },
];
