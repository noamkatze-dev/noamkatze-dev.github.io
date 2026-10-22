# Noam Katzenelbogen, Product Designer

My portfolio: a fast, static site built with [Astro](https://astro.build), plain CSS and a few lines of vanilla JS. It's hosted on GitHub Pages.

- **Content**: Markdown/MDX case studies in `src/content/projects/`, global copy in `src/data/site.ts`
- **Design**: every color, font, size and spacing value is a CSS variable in `src/styles/tokens.css`
- **To-do list**: `TODO.md` lists every unfinished marker and missing image. Regenerate it with `npm run todos`.

---

## 1. Run it locally

Requires Node.js 20.3+ (22 recommended).

```bash
npm install        # first time only, creates package-lock.json (commit it)
npm run dev        # http://localhost:4321, live-reloads as you edit
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run todos      # refresh TODO.md
npm run check      # optional: type-check .astro/.ts files
```

## 2. Edit content

### Case studies
Each case study is one file in `src/content/projects/`. The file name becomes the URL (`250ms.mdx` → `/work/250ms/`).

**Frontmatter** (the block between `---` lines) holds the header data:

| Field | What it's for |
|---|---|
| `title`, `tagline` | Page title; optional poetic line under it |
| `summary` | One line. Used on the home card, under the title, and as the page's meta description |
| `context`, `year`, `duration` | "Academic project, University of Haifa", 2025, "Oct 2024 – Jan 2025" |
| `role` | **The most important line.** What *you* did, specifically |
| `team`, `tools`, `deliverables` | Meta row |
| `tags` | Small chips on the home card |
| `order` | Position on the home page (1 = first, shown large) |
| `cover`, `coverAlt`, `coverNote` | Cover image path, its alt text, and what it should show (used by the placeholder) |
| `links` | Buttons under the title. `primary: true` makes it the accent button |
| `draft: true` | Hides the project everywhere |

**Body**: write normal Markdown. Each `## Heading` becomes a section and an entry in the sticky table of contents. Omit any section that doesn't apply.

**Components** you can use anywhere in the body, without importing them:

```mdx
<Figure file="250ms/calibration.png" alt="What's on screen" caption="Short caption" note="What to export" />

<FigureGrid cols={3}> ...Figures... </FigureGrid>

<Gallery title="Wireframes" count={12}>          // expandable, keyboard accessible
  <Figure thumb file="..." alt="..." caption="..." />
</Gallery>

<Embed url="https://youtu.be/..." title="Promo video" />            // click-to-load YouTube/Vimeo/Figma
<Embed url="https://www.figma.com/proto/..." title="Prototype" ratio="9 / 16" />

<Steps items={["Research", "Wireframes", "Prototype"]} />

<Flow>
  <FlowStep n={1} title="Dashboard" file="..." alt="...">Markdown text</FlowStep>
</Flow>

<Iteration>
  <IterationStage n={1} title="v1" file="..." alt="..." why="Why I changed it" gaveUp="What I gave up">
    What this version was.
  </IterationStage>
</Iteration>

<Decisions>
  <Decision title="..." choice="What I decided" why="Why" tradeoff="What it cost" />
</Decisions>

<Persona title="Data Analyst" background="..." workflow={["..."]} goals={["..."]} jobs={["..."]} />
<Callout label="Framing">Markdown text</Callout>
<Stats items={[{ value: "16", label: "images per session" }]} />
<Swatches colors={[{ hex: "#003BAB", name: "Primary" }]} />
```

MDX gotchas: don't use bare `{`, `}` or `<` in normal text. Inside `"..."` attributes, use curly quotes “ ” instead of straight double quotes.

### TODO markers
Anything you don't know yet is written as `[TODO: what I need]`. These show up **highlighted in yellow on the site**, so nothing ships unfinished by accident. Unfinished links (`url: "[TODO link]"`) become a dashed, disabled button. Run `npm run todos` to refresh `TODO.md`.

### Home, About, contact
Edit `src/data/site.ts`: hero headline (with two alternatives in a comment), support line, About text, skills, timeline, recognition, email, LinkedIn.

### CV
Replace `public/cv.pdf` with your real CV and keep the same file name.

## 3. Add images

1. Export from Figma at **2×** (about 2400px wide for full-width shots, 1200px for phone screens). PNG or JPG are both fine.
2. Save into `src/assets/images/<project>/` using the **exact file name** listed in `TODO.md` (the extension doesn't matter).
3. That's it. The placeholder frame is replaced automatically, and Astro generates AVIF and WebP at several sizes with width/height set and lazy loading.
4. Check the `alt="..."` next to that image in the `.mdx` file. It should describe what's actually on screen.

> **Why `src/assets/images` and not `public/images`?** Astro only optimizes images that live in `src/`. Files in `public/` are copied as-is (no AVIF/WebP, no resizing), which would hurt Lighthouse. Use `public/` only for files that must keep an exact URL, like `cv.pdf` or `og-default.png`.

### Videos

Short screen recordings live in `public/videos/<project>/` as `name.mp4` plus a `name.jpg` poster, and each one is listed in `src/data/videos.json` (width, height, duration, audio). Use them in a case study with:

```mdx
<Video src="250ms/calibration" label="What the clip shows" caption="Caption" />          // silent loop, plays while visible
<Video src="calcalist-next/app-walkthrough" mode="player" phone label="..." />           // normal player with sound
<FlowStep video="dark-pattern-detection/flow-2-session-impact" ... />                    // also works in FlowStep / IterationStage
```

To add one, compress it first (keeps pages fast), then add its entry to `videos.json`:

```bash
ffmpeg -i input.mov -vf "scale='min(1600,iw)':-2,fps=30,format=yuv420p" -c:v libx264 -crf 26 -preset slow -movflags +faststart -an public/videos/<project>/<name>.mp4
ffmpeg -ss 1 -i input.mov -frames:v 1 -vf "scale='min(1600,iw)':-2" -q:v 3 public/videos/<project>/<name>.jpg
```

Loops never autoplay for visitors who prefer reduced motion. They get normal controls instead, and everyone else gets a pause button.

**Social preview image**: each case study uses its `cover` image (auto-cropped to 1200×630). Other pages use `public/og-default.png`.

## 4. Deploy to GitHub Pages

The site deploys automatically on every push to `main` via `.github/workflows/deploy.yml`.

**One-time setup:**

1. Create a **public** repo named **`<username>.github.io`** on GitHub (no README).
2. In `astro.config.mjs`, set `site: 'https://<username>.github.io'`.
3. Push:
   ```bash
   npm install                     # creates package-lock.json
   git init -b main                # skip if the folder is already a git repo
   git add -A
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/<username>/<username>.github.io.git
   git push -u origin main
   ```
4. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to go green (about 1 to 2 minutes). The site is live at `https://<username>.github.io`.

**Using a project repo instead** (e.g. `github.com/<username>/portfolio`): also set `base: '/portfolio'` in `astro.config.mjs`. Internal links already go through the `url()` helper, so they pick it up automatically.

## 5. Connect a custom domain

1. Buy a domain (e.g. `noamk.design`).
2. Create `public/CNAME` containing just the domain, e.g. `www.noamk.design`.
3. In `astro.config.mjs`, set `site: 'https://www.noamk.design'` and make sure there's no `base`.
4. At your DNS provider:
   - `www` → **CNAME** → `<username>.github.io`
   - apex (`noamk.design`) → **A** records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
5. GitHub → **Settings → Pages → Custom domain**: enter the domain, wait for the DNS check, then tick **Enforce HTTPS**.
6. Push. DNS can take up to 24 hours.

## Project structure

```
src/
  content/projects/*.mdx   ← case studies (edit these)
  data/site.ts             ← global copy (edit this)
  assets/images/<slug>/    ← image exports (drop files here)
  styles/tokens.css        ← design tokens (colors, type, spacing, motion)
  styles/global.css        ← all styles
  components/              ← layout pieces (Header, Footer, ProjectCard, Toc, Media…)
  components/mdx/          ← components usable inside case studies
  layouts/Base.astro       ← <head>, SEO, Open Graph, skip link
  pages/                   ← routes: /, /about/, /work/[slug]/, 404, robots.txt
public/                    ← copied as-is: cv.pdf, favicons, og-default.png
scripts/list-todos.mjs     ← generates TODO.md
.github/workflows/         ← GitHub Pages deploy
```

## Accessibility and performance notes

- Skip link, landmarks, one `h1` per page, logical heading order, visible focus rings (a distinct blue, not the accent).
- Colors meet WCAG AA in light and dark mode. Dark mode follows the OS setting.
- All motion (scroll reveals, hovers, smooth scroll) is off under `prefers-reduced-motion`.
- Galleries use native `<details>`, so they're keyboard and screen-reader friendly with no JS.
- Embeds (YouTube, Vimeo, Figma, Base44) load nothing until clicked.
- Fonts are self-hosted via Fontsource (no Google Fonts CDN). The only JS is the scroll reveal, the TOC highlighter and the embed loader, all tiny and inlined by Astro.
