import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { mdxHeadings, mdxToPlainText } from "@/lib/docs-text";

// Static search index for the docs ⌘K dialog. Includes headings and body text
// so searches match what a chapter says, not just its title.
export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");
  const items = docs
    .map((entry) => {
      const data = entry.data as {
        title: string;
        description: string;
        group: string;
        order: number;
      };
      return {
        slug: entry.id,
        title: data.title,
        description: data.description,
        group: data.group,
        url: `/docs/${entry.id}`,
        order: data.order ?? 99,
        headings: mdxHeadings(entry.body),
        text: mdxToPlainText(entry.body),
      };
    })
    .sort((a, b) => a.order - b.order);

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
