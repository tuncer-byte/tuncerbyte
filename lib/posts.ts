import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

const getPostsDirectory = (lang = "tr") =>
  path.join(process.cwd(), "posts", lang);

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  updated?: string;
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

  const processedContent = await remark().use(remarkGfm).use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

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
