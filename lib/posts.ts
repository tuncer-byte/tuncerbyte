import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const getPostsDirectory = (lang = "tr") =>
  path.join(process.cwd(), "posts", lang);

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  updated?: string;
  category?: string;
  series?: string;
  seriesTitle?: string;
}

export interface PostDataWithContent extends PostData {
  contentHtml: string;
}

/** posts/lang/ altındaki tüm .md dosyalarını (news/ alt klasörü dahil) döner */
function collectMdFiles(dir: string): { slug: string; fullPath: string }[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: { slug: string; fullPath: string }[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Yalnızca news/ alt klasörünü tara
      if (entry.name === "news") {
        const subDir = path.join(dir, entry.name);
        const subEntries = fs.readdirSync(subDir, { withFileTypes: true });
        for (const sub of subEntries) {
          if (sub.isFile() && sub.name.endsWith(".md")) {
            results.push({
              slug: sub.name.replace(/\.md$/, ""),
              fullPath: path.join(subDir, sub.name),
            });
          }
        }
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push({
        slug: entry.name.replace(/\.md$/, ""),
        fullPath: path.join(dir, entry.name),
      });
    }
  }

  return results;
}

export function getSortedPostsData(lang = "tr"): PostData[] {
  const postsDirectory = getPostsDirectory(lang);
  const files = collectMdFiles(postsDirectory);

  const allPostsData = files.map(({ slug, fullPath }) => {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    return {
      slug,
      title:       matterResult.data.title       as string,
      date:        matterResult.data.date         as string,
      excerpt:     matterResult.data.excerpt      as string | undefined,
      tags:        matterResult.data.tags         as string[] | undefined,
      updated:     matterResult.data.updated      as string | undefined,
      category:    matterResult.data.category     as string | undefined,
      series:      matterResult.data.series       as string | undefined,
      seriesTitle: matterResult.data.seriesTitle  as string | undefined,
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs(lang = "tr") {
  const postsDirectory = getPostsDirectory(lang);
  return collectMdFiles(postsDirectory).map(({ slug }) => ({ slug }));
}

/** Slug için doğru dosya yolunu bulur (önce kök, sonra news/) */
function resolvePostPath(slug: string, lang: string): string {
  const postsDirectory = getPostsDirectory(lang);
  const rootPath  = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(rootPath)) return rootPath;
  const newsPath  = path.join(postsDirectory, "news", `${slug}.md`);
  if (fs.existsSync(newsPath)) return newsPath;
  return rootPath; // hata fs.readFileSync'e düşer
}

export async function getPostData(slug: string, lang = "tr"): Promise<PostDataWithContent> {
  const fullPath    = resolvePostPath(slug, lang);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString().replace(
    /<(h[23])>(.*?)<\/\1>/g,
    (_, tag, inner) => {
      const id = inner
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .replace(/[şş]/g, "s").replace(/[ğ]/g, "g").replace(/[ıi̇]/g, "i")
        .replace(/[öo]/g, "o").replace(/[üu]/g, "u").replace(/[çc]/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<${tag} id="${id}">${inner}</${tag}>`;
    }
  );

  return {
    slug,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    excerpt: matterResult.data.excerpt as string | undefined,
    tags: matterResult.data.tags as string[] | undefined,
    updated: matterResult.data.updated as string | undefined,
    contentHtml,
  };
}
