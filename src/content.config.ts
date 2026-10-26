import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Case studies live in src/content/projects/*.mdx.
 * The file name becomes the URL: 250ms.mdx → /work/250ms
 *
 * Image fields take a path relative to src/assets/images/,
 * e.g. "250ms/cover.png". If the file doesn't exist yet, a labelled
 * placeholder frame is shown instead, so the build never breaks.
 */
const link = z.object({
  label: z.string(),
  url: z.string(), // may be "[TODO link]" — unfinished links render as a visible TODO, not a dead button
  kind: z.enum(['prototype', 'live', 'video', 'code', 'other']).default('other'),
  primary: z.boolean().default(false),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(), // shorter name for the Home card and the big page title
    outcome: z.string().optional(), // one or two lines at the top of the page: result, feedback or key insight
    teaser: z.string().optional(), // one short line on the Home card (falls back to summary)
    card: z.string().optional(), // Home card image under src/assets/images/ (falls back to cover)
    heroTitle: z.boolean().default(true), // false: the hero opens with media only (the title stays for screen readers)
    // Media at the top of the page. Defaults to the cover image, 888px wide.
    hero: z
      .object({
        file: z.string().optional(), // image under src/assets/images/
        video: z.string().optional(), // or a video under public/videos/ (no extension)
        alt: z.string().optional(),
        width: z.number().default(888), // px at 1440px wide
        radius: z.number().default(0),
      })
      .optional(),
    tagline: z.string().optional(), // optional poetic line under the title
    summary: z.string(), // one line: used on cards, in the header and as meta description
    context: z.string(), // e.g. "Academic project, University of Haifa"
    year: z.union([z.string(), z.number()]),
    duration: z.string(), // "Oct 2024 – Jan 2025"
    role: z.string(), // the most important line on the page: what YOU did
    team: z.string(),
    tools: z.array(z.string()),
    tags: z.array(z.string()).default([]),
    discipline: z.string().optional(), // short label under the project title on Home, e.g. "UX/UI"
    order: z.number(),
    cover: z.string(),
    coverAlt: z.string(),
    coverNote: z.string().optional(), // what the cover should show (shown in placeholder)
    links: z.array(link).default([]),
    deliverables: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
