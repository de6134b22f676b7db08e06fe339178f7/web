export type Shot = {
  /** Basename inside /work/<slug>/ without extension. */
  file: string;
  alt: string;
  /** Real source pixel dimensions (from captures.generated.ts). */
  width: number;
  height: number;
  /** Caption under the figure, when the page does not supply one. */
  caption?: string;
};

/** A primary feature (DESIGN.md 5.3): exactly 5, in founder order. Drives FeatureFrame (>= 1024) and FeatureIndex. */
export type Feature = {
  /** "01".."05". */
  no: string;
  title: string;
  body: string;
  /** The feature's own full-page capture(s): at least one (the first drives the frame and the index). */
  shots: [Shot, ...Shot[]];
  /** URL bar text after the domain, e.g. "/fixtures". */
  path: string;
  /** Top of the visible window as a fraction of the capture height, start -> end (scrubbed inside the frame). */
  scroll: [number, number];
  /** Mobile/RM accordion only: top of its 4:3 window (defaults to scroll[0]); used when the uncropped 4:3 window would reach a capture footer. */
  indexAt?: number;
  /** What the frame visibly shows (caption under the frame / in the index). */
  caption: string;
};

/** "Also in the build" (5.3 CS3): stories + committee admin. */
export type SupportingFeature = {
  title: string;
  body: string;
  /** Thumbnail (4:3 window at the top of the capture). */
  shot?: Shot;
  /** Live link for the thumbnail (new tab). */
  href?: string;
  chips?: string[];
  /** An action the committee can run, shown apart from the numbered areas (e.g. the PlayHQ resync). */
  action?: string;
  note?: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  kind: string;
  /** Short feature tags for the /work row (founder order). */
  tags: string[];
  /** Case hero sub: "A club that lives on its website." */
  headline: string;
  /** CS1 "The club" paragraph. */
  intro: string;
  /** Launch year, shown only when confirmed. */
  year?: string;
  live: { href: string; label: string };
  stack: string[];
  /** Meta description / summary line. */
  summary: string;
  /** Case hero frame + compare "now" side (viewport home capture). */
  hero: Shot;
  /** Viewport home shot, for OG images. */
  og: Shot;
  before: { heading: string; old: { label: string; body: string; shot: Shot }; now: { label: string; body: string; shot: Shot } };
  vision: { label: string; heading: string; paragraphs: string[] };
  built: { heading: string; note: string; primary: Feature[]; supporting: SupportingFeature[] };
  /** CS4: exactly two counters. */
  numbers: { value: string; label: string }[];
  excerpt: { quote: string; href: string; caption: string };
  /** `shots`: the case-study phone strip (`play`: the full-page capture that scrolls itself). Case study only; Home never renders client captures. */
  mobile: { heading: string; shots: { shot: Shot; label: string; play?: boolean }[] };
};
