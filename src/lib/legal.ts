import { getCollection, getEntry } from "astro:content";

import type { LegalFrontmatter } from "@/lib/types";

function toFrontmatter(entry: {
  data: Record<string, unknown>;
}): LegalFrontmatter {
  const d = entry.data as LegalFrontmatter & { lastUpdated: unknown };
  const raw: unknown = d.lastUpdated;
  return {
    ...d,
    lastUpdated:
      raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw),
  };
}

export async function getLegalSlugs(): Promise<string[]> {
  const entries = await getCollection("legal");
  return entries.map((entry) => entry.id);
}

export async function getLegalPageBySlug(slug: string) {
  const entry = await getEntry("legal", slug);
  if (!entry) return null;
  return {
    slug,
    entry,
    frontmatter: toFrontmatter(entry),
  };
}

export async function getAllLegalPages(): Promise<LegalFrontmatter[]> {
  const entries = await getCollection("legal");
  return entries
    .map(toFrontmatter)
    .sort((a, b) => a.title.localeCompare(b.title));
}
