import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['AI', 'Design', 'Photography', 'Work', 'Life']),
    summary: z.string(),
    placeholder: z.boolean().default(false), // shows a "placeholder" mark
    draft: z.boolean().default(false),       // hidden from production builds
  }),
});

export const collections = { notes };
