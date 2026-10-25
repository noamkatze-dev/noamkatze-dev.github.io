# Noam Katzenelbogen, Product Designer

My portfolio: a fast, static site built with [Astro](https://astro.build), plain CSS and a few lines of vanilla JS. It's hosted on GitHub Pages.

- **Content**: Markdown/MDX case studies in `src/content/projects/`, global copy in `src/data/site.ts`
- **Design**: a 1:1 rebuild of the Wix Studio design (noamkatze.wixstudio.com/my-site-6): black on white, Heebo (self-hosted in `public/fonts/`, OFL licence included), uppercase section titles on the left, text from the middle of the page. Desktop sizes were measured on the Wix page at 1440px and written in `--u` units in `src/styles/global.css`, so the layout scales with the window like Wix Studio; below 1100px it stacks into one column
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
| `links` | Buttons under the title (one black button style). `primary: true` puts a link first |
| `draft: true` | Hides the project everywhere |

**Body**: write normal Markdown. Each `## Heading` becomes a section: title on the left, text on the right. Omit any section that doesn't apply.

**Frontmatter extras for the page top:** `shortTitle` (big title and Home card name), `heroTitle: false` (open with media only), and `hero: { file | video, alt, width, radius }` (defaults to the cover, 888px wide).

**Components** you can use anywhere in the body, without importing them:

```mdx
<IntroMedia video="250ms/landing" width={796} alt="..." />          // centred media above the first section

<Steps items={["Research", "Wireframes", "Prototype"]} />           // work process row

<Flow>                                                               // media left, title + text right
  <FlowStep title="Dashboard" video="slug/flow-1" alt="...">Markdown text</FlowStep>
</Flow>
<Iteration>
  <IterationStage title="v1" video="..." alt="...">What this version was.</IterationStage>
</Iteration>

<SideMedia video="250ms/calibration" alt="..." />                   // media beside the title, text below (add `wide` for 788px)
<Video src="calcalist-next/app-walkthrough" phone autoplay radius={20} label="..." />

<Screens>                                                            // 5 phone screens per row (`dark` = black band)
  <Figure phone file="..." alt="..." caption="Splash" />
</Screens>
<Phones> <Figure phone file="..." alt="..." /> <Figure phone ... /> </Phones>

<Persona title="Data Analyst" photo="..." background={["...", "..."]} workflow={["..."]} goals={["..."]} />
<Checklist good={["What worked"]} bad={["What didn't"]} />
<Cta href="https://..." label="Explore the feature" />
```

Older components (`Figure`, `FigureGrid`, `Gallery`, `Embed`, `Decisions`, `Stats`, `Swatches`, `Callout`, `WireframePair`) still work but are not used in the Wix layout.

MDX gotchas: don't use bare `{`, `}` or `<` in normal text. Inside `"..."` attributes, use curly quotes “ ” instead of straight double quotes.

### TODO markers
Anything you don't know yet is written as `[TODO: what I need]`. In `npm run dev` these are **highlighted** on the page. In the production build (what GitHub Pages serves) they are removed automatically, together with the sentence they sit in; sections, links, embeds and galleries that only contained TODOs are left out. Unfinished links (`url: "[TODO link]"`) show as a disabled button in dev and are hidden in production. Run `npm run todos` to refresh `TODO.md`.

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
<Video src="250ms/viewing-session" label="What the clip shows" caption="Caption" />       // click to play
<Video src="calcalist-next/app-walkthrough" phone label="..." />                          // narrow phone frame
<FlowStep video="dark-pattern-detection/flow-2-session-impact" ... />                    // also works in FlowStep / IterationStage
```

To add one, compress it first (keeps pages fast), then add its entry to `videos.json`:

```bash
ffmpeg -i input.mov -vf "scale='min(1600,iw)':-2,fps=30,format=yuv420p" -c:v libx264 -crf 26 -preset slow -movflags +faststart -an public/videos/<project>/<name>.mp4
ffmpeg -ss 1 -i input.mov -frames:v 1 -vf "scale='min(1600,iw)':-2" -q:v 3 public/videos/<project>/<name>.jpg
```

Only the poster loads (`preload="none"`) until a video is needed. Videos in `FlowStep`, `IterationStage`, the hero, or with `autoplay` play muted and looped only while on screen (like the Wix site); with reduced motion they wait for a click. Keep each file under 25 MB (GitHub's web upload limit).

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
  styles/global.css        ← all styles + design tokens (top of file)
  components/              ← layout pieces (Header, Footer, ProjectCard, Media…)
  components/mdx/          ← components usable inside case studies
  layouts/Base.astro       ← <head>, SEO, Open Graph, skip link
  pages/                   ← routes: /, /about/, /work/[slug]/, 404, robots.txt
public/                    ← copied as-is: cv.pdf, favicons, og-default.png
scripts/list-todos.mjs     ← generates TODO.md
.github/workflows/         ← GitHub Pages deploy
```

## Accessibility and performance notes

- Skip link, landmarks, one `h1` per page, logical heading order, visible 2px black focus outlines.
- Black, white and one gray (#6b6b6b, 5.3:1): all text meets WCAG AA. No dark mode, no animation beyond a 150ms hover fade.
- Galleries use native `<details>`, so they're keyboard and screen-reader friendly with no JS.
- Embeds (YouTube, Vimeo, Figma, Base44) load nothing until clicked.
- Fonts are self-hosted via Fontsource (no Google Fonts CDN). All client JS lives in `src/scripts/ui.js` (scroll reveal, muted autoplay for flow videos while on screen, lightbox, click-to-load embeds). Every image in a case study opens in a lightbox. Everything respects `prefers-reduced-motion`, and all content stays visible if the script fails.
