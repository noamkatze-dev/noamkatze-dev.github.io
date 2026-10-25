/**
 * Components available inside every case-study .mdx file WITHOUT importing them.
 * (They are passed to <Content components={...} /> in src/pages/work/[slug].astro.)
 */
import Figure from './Figure.astro';
import FigureGrid from './FigureGrid.astro';
import Gallery from './Gallery.astro';
import Embed from './Embed.astro';
import Steps from './Steps.astro';
import Flow from './Flow.astro';
import FlowStep from './FlowStep.astro';
import Iteration from './Iteration.astro';
import IterationStage from './IterationStage.astro';
import Decision from './Decision.astro';
import Decisions from './Decisions.astro';
import Persona from './Persona.astro';
import Callout from './Callout.astro';
import Stats from './Stats.astro';
import Swatches from './Swatches.astro';
import Video from './Video.astro';
import Screens from './Screens.astro';
import WireframePair from './WireframePair.astro';
import SideMedia from './SideMedia.astro';
import IntroMedia from './IntroMedia.astro';
import Phones from './Phones.astro';
import Checklist from './Checklist.astro';
import Cta from './Cta.astro';
import Pairs from './Pairs.astro';

export const mdxComponents = {
  SideMedia,
  IntroMedia,
  Phones,
  Checklist,
  Cta,
  Pairs,
  Swatches,
  Video,
  Screens,
  WireframePair,
  Figure,
  FigureGrid,
  Gallery,
  Embed,
  Steps,
  Flow,
  FlowStep,
  Iteration,
  IterationStage,
  Decision,
  Decisions,
  Persona,
  Callout,
  Stats,
};
