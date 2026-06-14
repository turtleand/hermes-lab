import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    module: z.string(),
    subtopic: z.string(),
    summary: z.string(),
    status: z.enum(['planned', 'in-progress', 'done']).default('planned'),
    articles: z.array(z.object({
      title: z.string(),
      description: z.string(),
      type: z.enum(['article', 'project']).default('article'),
      status: z.enum(['planned', 'in-progress', 'done']).default('planned'),
      link: z.string().optional(),
    })).default([]),
  }),
});

export const collections = { topics };
