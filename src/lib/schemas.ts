import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  url: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  status: z.enum(['active', 'completed', 'upcoming']),
  featured: z.boolean().default(false),
  currentFocus: z.boolean().default(false),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date().optional(),
  image: z.string().optional(),
  order: z.number().default(0),
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;

export const journalSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  ogImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  draft: z.boolean().default(false),
});

export type JournalFrontmatter = z.infer<typeof journalSchema>;
