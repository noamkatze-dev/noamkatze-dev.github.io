// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeTodo from './src/lib/rehype-todo.mjs';

export default defineConfig({
  // ---------------------------------------------------------------------------
  // DEPLOYMENT URL — EDIT THIS
  //
  // 1) User site (repo named <username>.github.io), the default setup:
  //      site: 'https://<username>.github.io',
  //      (no `base`)
  //
  // 2) Project site (repo named e.g. "portfolio"):
  //      site: 'https://<username>.github.io',
  //      base: '/portfolio',
  //    All internal links use the `url()` helper in src/lib/url.ts,
  //    so they pick up `base` automatically.
  //
  // 3) Custom domain (see README → "Custom domain"):
  //      site: 'https://www.yourdomain.com',
  //      (no `base`), and put the domain in public/CNAME
  //
  // `site` is used for canonical URLs, Open Graph URLs, the sitemap and robots.txt.
  // ---------------------------------------------------------------------------
  site: 'https://USERNAME.github.io', // TODO: replace USERNAME with your GitHub username
  // base: '/portfolio',

  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Highlights every "[TODO: ...]" marker in case-study text so nothing ships unnoticed.
    rehypePlugins: [rehypeTodo],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
