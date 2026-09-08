import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const dispatches = defineCollection({
  loader: glob({ base: "./src/content/dispatches", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    slug: z.string(),
    num: z.string(),
    title: z.string(),
    dek: z.string(),
    date: z.coerce.date(),
    time: z.string(),
    author: z.string(),
    authorRole: z.string(),
    authorImage: z.string(),
    category: z.string(),
    readMin: z.number(),
    chapters: z.array(z.string()).optional(),
    filedFrom: z.string().optional(),
    coverImage: z.string().optional(),
    coverCaption: z.string().optional(),
  }),
});

const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: z.string(),
    order: z.number(),
    full: z.boolean().optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ base: "./src/content/legal", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

export const collections = { dispatches, docs, legal };
