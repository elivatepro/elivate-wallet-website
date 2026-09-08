export type BlogEntry = {
  slug: string;
  num: string;
  date: string;
  time: string;
  monthKey: string;
  title: string;
  dek: string;
  author: string;
  authorRole: string;
  authorImage: string;
  category: string;
  severity: "info" | "note" | "warn";
  readMin: number;
  coverImage: string;
  featuredLede?: string;
};

export type DispatchFrontmatter = {
  slug: string;
  num: string;
  title: string;
  dek: string;
  date: string;
  time: string;
  author: string;
  authorRole: string;
  authorImage: string;
  category: string;
  readMin: number;
  chapters?: string[];
  filedFrom?: string;
  coverImage?: string;
  coverCaption?: string;
};

export type Dispatch = {
  slug: string;
  content: string;
  frontmatter: DispatchFrontmatter;
};

export type DocFrontmatter = {
  title: string;
  description: string;
  group: string;
  order: number;
  full?: boolean;
};

export type Doc = {
  slug: string;
  content: string;
  frontmatter: DocFrontmatter;
};

export type DocNavEntry = {
  slug: string;
  title: string;
  description: string;
  group: string;
  order: number;
};

export type DocNavGroup = {
  group: string;
  entries: DocNavEntry[];
};

export type LegalFrontmatter = {
  title: string;
  slug: string;
  description: string;
  lastUpdated: string;
};

export type LegalPage = {
  slug: string;
  content: string;
  frontmatter: LegalFrontmatter;
};
