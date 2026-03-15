import { XMLParser } from "fast-xml-parser";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

const CHANNEL_ID = "UCQHqRmu1sqweqbCL_Zkfoag";

async function isShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: "HEAD",
      redirect: "manual",
    });
    // Shorts return 200; regular videos redirect (301/303) to /watch
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function getLatestVideos(count = 4): Promise<YouTubeVideo[]> {
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

    const videos: YouTubeVideo[] = items.map((entry: Record<string, unknown>) => {
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

    // Filter out Shorts in parallel
    const shortFlags = await Promise.all(videos.map((v) => isShort(v.videoId)));
    const regularVideos = videos.filter((_, i) => !shortFlags[i]);

    return regularVideos.slice(0, count);
  } catch {
    return fallbackVideos.slice(0, count);
  }
}

// Static fallback in case RSS is unreachable at build time
const fallbackVideos: YouTubeVideo[] = [
  { videoId: "gjnLtAGR_eQ", title: "Google Bolt ve Lovable'ı tokatlamaya gelmiş", published: "2025-12-09", thumbnail: "https://img.youtube.com/vi/gjnLtAGR_eQ/hqdefault.jpg", url: "https://www.youtube.com/watch?v=gjnLtAGR_eQ" },
  { videoId: "9BPnPHhVKjk", title: "Google Antigravity (Büyük Hayal Kırıklığı)", published: "2025-11-21", thumbnail: "https://img.youtube.com/vi/9BPnPHhVKjk/hqdefault.jpg", url: "https://www.youtube.com/watch?v=9BPnPHhVKjk" },
  { videoId: "aCHtZtAphoM", title: "Google Antigravity - Cursor işine bak", published: "2025-11-18", thumbnail: "https://img.youtube.com/vi/aCHtZtAphoM/hqdefault.jpg", url: "https://www.youtube.com/watch?v=aCHtZtAphoM" },
  { videoId: "deUCsISO9IA", title: "MCP Dersleri P8 - Firecrawl MCP kullanımı", published: "2025-11-06", thumbnail: "https://img.youtube.com/vi/deUCsISO9IA/hqdefault.jpg", url: "https://www.youtube.com/watch?v=deUCsISO9IA" },
];
