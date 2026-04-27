import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { blogLoader } from "./lib/blog-loader";

const blog = defineCollection({
  loader: blogLoader(),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    authorName: z.string().default("鸣"),
    status: z.enum(["draft", "published"]).default("published"),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
