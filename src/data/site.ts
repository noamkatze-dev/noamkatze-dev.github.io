/**
 * GLOBAL CONTENT — edit your copy here.
 * Everything on Home and About that isn't a case study lives in this file.
 * Any TODO marker in square brackets is highlighted on the page until you replace it.
 */

export const site = {
  name: 'Noam Katzenelbogen',
  role: 'Product Designer',
  /** Used as the default <title> and in social cards. */
  title: 'Noam Katzenelbogen, Product Designer',
  description:
    'Noam Katzenelbogen is a product designer who turns complex data and workflows into clear, trustworthy interfaces. Selected case studies in B2B, data and research tools.',
  email: 'noambogen@gmail.com',
  linkedin: 'https://www.linkedin.com/in/noam-katzenelbogen-3a1341353',
  cv: '/cv.pdf',
  locale: 'en_US',
};

export const hero = {
  headline: 'Product designer for complex systems.',
  /*
   * Alternative headlines (swap one into `headline` above):
   *   A) "I design clarity into complex products."
   *   B) "Hard problems, clear interfaces."
   */
  support: 'I turn complex data and workflows into clear, trustworthy interfaces.',
};

/** About text on Home (as on the Wix site). One string per paragraph. */
export const homeAbout = [
  "I'm a Product Designer (UX/UI) with a background in Visual Communication and a user-centered approach to design. I graduated in 2026 with a B.Des. in Visual Communication from the University of Haifa and hold a professional UX certification from BEX College.",
  'I currently work as a Product Designer at a design studio.',
  'My approach combines research-oriented and systems thinking with a strong visual foundation, allowing me to translate user needs into clear, cohesive, and intuitive digital experiences.',
];

/** Skill lines under the About text on Home. */
export const homeSkills = [
  { label: 'Design Skills', items: ['User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems'] },
  { label: 'Tools & Technologies', items: ['Figma', 'Adobe Creative Suite', 'AI Tools', 'Vibe Coding'] },
];

/** Short version shown on Home. */
export const aboutTeaser =
  "I'm a recent B.Des graduate from the University of Haifa. Before design, I spent five years in the IDF leading a procurement-system upgrade and managing a permits center, which taught me to work with complex systems and many stakeholders at once. Now I design data-heavy tools and multi-role workflows, end to end.";

/** Full bio on /about. One string per paragraph. */
export const about = [
  "I'm a product designer who recently graduated with a B.Des in Visual Communication from the University of Haifa.",
  'Before design, I spent five years in the IDF, including leading the upgrade of a procurement system in the Intelligence Corps and managing a permits center, which is where I learned to work with complex systems and many stakeholders at once.',
  "I'm drawn to products where the problem is hard: data-heavy tools, multi-role workflows, and anything where clarity is the whole point. I work end to end, from research and flows to interface and prototype, and I build working prototypes in code when it helps. For my thesis I designed and built a browser-based eye-tracking system from scratch.",
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Design', items: ['Figma', 'Design systems basics'] },
  { group: 'Research', items: ['User research', 'Usability testing'] },
  {
    group: 'Prototyping',
    items: ['Prototyping', 'AI-assisted prototypes', 'Code prototypes (JavaScript)'],
  },
  {
    group: 'Adobe Creative Suite',
    items: ['Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro', 'Animate'],
  },
];

export type TimelineItem = { period: string; title: string; org: string; detail?: string };

export const experience: TimelineItem[] = [
  {
    period: '2026 – present',
    title: 'Product Design',
    org: 'creative +',
    detail: '[TODO: 2 to 3 lines of concrete work done]',
  },
  {
    period: '2019 – 2022',
    title: 'Procurement Team Leader, Career Service',
    org: 'IDF Intelligence Corps',
    detail:
      'Led the upgrade of a procurement system. Released as Sergeant Major. [TODO: one line on scale or stakeholders, e.g. how many units or users the system served]',
  },
  {
    period: '2017 – 2019',
    title: 'Coordination and Liaison NCO, later Shift Manager',
    org: 'IDF, permits center',
    detail: 'Managed shifts at a permits center. [TODO: one concrete line on what the role involved]',
  },
];

export const education: TimelineItem[] = [
  {
    period: '2022 – 2026',
    title: 'B.Des Visual Communication, product design focus',
    org: 'University of Haifa',
    detail: 'Department Excellence Award, 2023.',
  },
  { period: '2020 – 2021', title: 'UX course', org: 'BEX College' },
];

export const recognition: { title: string; detail?: string }[] = [
  {
    title: 'Department Excellence Award, University of Haifa',
    detail: '2023.',
  },
  {
    title: '3rd place, MANARA Coexistence Competition',
    detail: "Abu Dhabi, 2025. A children's educational game, designed in a team of four.",
  },
  {
    title: 'Participated in the Excellence Exhibition, first year of studies, University of Haifa',
  },
];
