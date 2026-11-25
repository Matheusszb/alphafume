import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(), description: z.string(), category: z.string(),
    image: z.string(), publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
    relatedServices: z.array(z.string()).default([]),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([])
  })
});
export const collections = { blog };
