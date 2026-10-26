/**
 * GLOBAL CONTENT — edit your copy here.
 * Everything on Home and About that isn't a case study lives in this file.
 * Any TODO marker in square brackets is highlighted in dev and removed from the live site.
 */

export const site = {
  name: 'Noam Katzenelbogen',
  role: 'Product Designer',
  /** Used as the default <title> and in social cards. */
  title: 'Noam Katzenelbogen, Product Designer',
  description:
    'Noam Katzenelbogen is a product designer who turns complex data and workflows into clear, trustworthy interfaces. Case studies in B2B analytics, research tools and mobile products.',
  email: 'noambogen@gmail.com',
  linkedin: 'https://www.linkedin.com/in/noam-katzenelbogen-3a1341353',
  cv: '/cv.pdf',
  locale: 'en_US',
};

export const hero = {
  headline: 'Product designer for complex systems.',
  support: 'I turn complex data and workflows into clear, trustworthy interfaces.',
};

/** Short introduction on Home. It links to the About page. */
export const aboutTeaser = [
  "I'm a Product Designer (UX/UI) with a background in Visual Communication and a user-centered approach to design. I graduated in 2026 with a B.Des. in Visual Communication from the University of Haifa, and I currently work as a Product Designer at a design studio.",
  'My approach combines research-oriented and systems thinking with a strong visual foundation, so I can turn user needs into clear, cohesive and intuitive digital experiences.',
];

/** Full bio on /about. One string per paragraph. */
export const about = [
  "I'm a Product Designer (UX/UI) with a background in Visual Communication and a user-centered approach to design. I graduated in 2026 with a B.Des. in Visual Communication from the University of Haifa and hold a professional UX certification from BEX College.",
  "I'm drawn to products where the problem is hard: data-heavy tools, multi-role workflows, and anything where clarity is the whole point. I work end to end, from research and flows to interface and prototype, and I build working prototypes in code when it helps. For my thesis I designed and built a browser-based eye-tracking system from scratch.",
];

/** Design achievements, newest first. */
export const achievements: { year: string; title: string; detail?: string }[] = [
  {
    year: '2025',
    title: '3rd place, MANARA Coexistence Competition',
    detail: "Abu Dhabi. A children's educational game, designed in a team of four.",
  },
  {
    year: '2023',
    title: 'Department Excellence',
    detail: 'Visual Communication, University of Haifa.',
  },
];

/** Design skills: each one points to the project that shows it. */
export const skills: { name: string; proof: string; project: string; slug: string }[] = [
  {
    name: 'User Research',
    proof: 'An independent analysis of the Microsoft Clarity platform, plus team interviews, a literature review and a usability test.',
    project: 'Dark Pattern Detection',
    slug: 'dark-pattern-detection',
  },
  {
    name: 'Wireframing',
    proof: "Turned a client's needs into user flows and wireframes before any visual design.",
    project: 'Calcalist Next',
    slug: 'calcalist-next',
  },
  {
    name: 'Prototyping',
    proof: 'A working, live eye-tracking experience, designed and built in JavaScript.',
    project: '250ms',
    slug: '250ms',
  },
  {
    name: 'UI Design',
    proof: 'App UI for a real client, presented to Calcalist, plus a self-initiated website.',
    project: 'Calcalist Next',
    slug: 'calcalist-next',
  },
  {
    name: 'Design Systems',
    proof: 'A visual system of sky, thin red grid and red type, applied across every screen.',
    project: '250ms',
    slug: '250ms',
  },
];

/** Tools, grouped. */
export const tools: { group: string; items: string[] }[] = [
  { group: 'Design', items: ['Figma', 'Photoshop', 'Illustrator', 'InDesign'] },
  { group: 'Motion & video', items: ['After Effects', 'Premiere Pro', 'Animate'] },
  { group: 'Prototyping & code', items: ['Base44', 'JavaScript & Canvas', 'HTML & CSS', 'MediaPipe', 'Vibe coding'] },
  { group: 'AI', items: ['AI tools'] },
];

export type TimelineItem = { period: string; title: string; org: string; detail?: string };

export const experience: TimelineItem[] = [
  {
    period: '2026 – present',
    title: 'Product Designer',
    org: 'creative +, design studio',
    detail: '[TODO: 2 to 3 lines of concrete design work done there]',
  },
];

export const education: TimelineItem[] = [
  {
    period: '2022 – 2026',
    title: 'B.Des. Visual Communication, product design focus',
    org: 'University of Haifa',
  },
  { period: '2020 – 2021', title: 'Professional UX certification', org: 'BEX College' },
];
