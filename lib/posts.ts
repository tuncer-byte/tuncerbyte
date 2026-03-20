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

export function getSortedPostsData(lang = "tr"): PostData[] {
  const postsDirectory = getPostsDirectory(lang);
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);
      return {
        slug,
        title: matterResult.data.title as string,
        date: matterResult.data.date as string,
        excerpt: matterResult.data.excerpt as string | undefined,
        tags: matterResult.data.tags as string[] | undefined,
        updated: matterResult.data.updated as string | undefined,
        category: matterResult.data.category as string | undefined,
        series: matterResult.data.series as string | undefined,
        seriesTitle: matterResult.data.seriesTitle as string | undefined,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs(lang = "tr") {
  const postsDirectory = getPostsDirectory(lang);
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => ({ slug: fileName.replace(/\.md$/, "") }));
}

export async function getPostData(slug: string, lang = "tr"): Promise<PostDataWithContent> {
  const postsDirectory = getPostsDirectory(lang);
  const fullPath = path.join(postsDirectory, `${slug}.md`);
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
