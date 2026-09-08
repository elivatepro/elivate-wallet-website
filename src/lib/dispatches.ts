import { getCollection, getEntry } from "astro:content";

import type { DispatchFrontmatter } from "@/lib/types";

function toFrontmatter(entry: {
  data: Record<string, unknown>;
}): DispatchFrontmatter {
  const d = entry.data as DispatchFrontmatter & { date: unknown };
  const rawDate: unknown = d.date;
  return {
    ...d,
    date:
      rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : String(rawDate),
  };
}

export async function getDispatchSlugs(): Promise<string[]> {
  const entries = await getCollection("dispatches");
  return entries.map((entry) => entry.id);
}

export async function getDispatchBySlug(slug: string) {
  const entry = await getEntry("dispatches", slug);
  if (!entry) return null;
  return {
    slug,
    entry,
    frontmatter: toFrontmatter(entry),
  };
}

export async function getAllDispatches(): Promise<DispatchFrontmatter[]> {
  const entries = await getCollection("dispatches");
  return entries
    .map(toFrontmatter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
