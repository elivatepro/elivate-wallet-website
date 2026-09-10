import { readFile } from "node:fs/promises";

export const BLOG_CATEGORIES = [
  "Product",
  "Financial Records",
  "Network Operations",
  "Guides",
  "Company",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
  bio: string;
  active: boolean;
  photo: string | null;
};

export type BlogContentsEntry = {
  id: string;
  text: string;
  level: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  publishDate: string;
  displayDate: string;
  monthKey: string;
  monthLabel: string;
  excerpt: string;
  featuredLede: string | null;
  category: BlogCategory;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImage: string | null;
  socialImage: string | null;
  author: BlogAuthor;
  readMin: number;
  contents: BlogContentsEntry[];
  html: string;
  articleNumber: string;
};

export type BlogSummary = Omit<BlogPost, "html" | "contents">;

type GeneratedBlogData = {
  generatedAt: string;
  currentDate: string;
  timeZone: string;
  posts: BlogPost[];
};

let dataPromise: Promise<GeneratedBlogData> | undefined;

async function loadBlogData() {
  if (!dataPromise) {
    const file = new URL("../generated/blog-data.json", import.meta.url);
    dataPromise = readFile(file, "utf8").then((raw) => JSON.parse(raw));
  }
  return dataPromise;
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return (await loadBlogData()).posts;
}

export async function getPublishedBlogSummaries(): Promise<BlogSummary[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map(({ html: _html, contents: _contents, ...summary }) => summary);
}
