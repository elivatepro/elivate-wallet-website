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

export const collections = { dispatches };