import { getCollection, getEntry } from "astro:content";

import type { DocFrontmatter, DocNavEntry, DocNavGroup } from "@/lib/types";

export async function getDocSlugs(): Promise<string[]> {
  const entries = await getCollection("docs");
  return entries.map((entry) => entry.id);
}

export async function getDocBySlug(slug: string) {
  const entry = await getEntry("docs", slug);
  if (!entry) return null;
  return {
    slug,
    entry,
    frontmatter: entry.data as DocFrontmatter,
  };
}

export async function getAllDocs(): Promise<DocNavEntry[]> {
  const entries = await getCollection("docs");
  return entries
    .map((entry) => {
      const data = entry.data as DocFrontmatter;
      return {
        slug: entry.id,
        title: data.title,
        description: data.description,
        group: data.group ?? "Reference",
        order: data.order ?? 99,
      };
    })
    .sort((a, b) => a.order - b.order);
}

const GROUP_ORDER = ["Foundations", "Workflows", "Reference"];

export async function getDocNav(): Promise<DocNavGroup[]> {
  const all = await getAllDocs();
  const map = new Map<string, DocNavEntry[]>();
  for (const entry of all) {
    const list = map.get(entry.group) ?? [];
    list.push(entry);
    map.set(entry.group, list);
  }
  const groups = Array.from(map.entries()).map(([group, entries]) => ({
    group,
    entries: entries.sort((a, b) => a.order - b.order),
  }));
  groups.sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a.group);
    const bi = GROUP_ORDER.indexOf(b.group);
    return (
      (ai === -1 ? GROUP_ORDER.length : ai) -
      (bi === -1 ? GROUP_ORDER.length : bi)
    );
  });
  return groups;
}

export type TocEntry = {
  depth: number;
  title: string;
  url: string;
};

export function getTableOfContents(
  headings: { depth: number; slug: string; text: string }[],
): TocEntry[] {
  return headings
    .filter((h) => h.depth >= 2 && h.depth <= 3)
    .map((h) => ({
      depth: h.depth,
      title: h.text,
      url: `#${h.slug}`,
    }));
}
