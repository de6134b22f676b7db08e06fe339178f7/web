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

/** A primary feature (BRIEF 5.2): exactly 5, in the club's order. */
export type Feature = {
  /** "01".."05". */
  no: string;
  title: string;
  body: string;
  /** The feature's own full-page capture(s): at least one (the first is shown). */
  shots: [Shot, ...Shot[]];
  /** Top of the window as a fraction of the capture height (the resting frame under reduced motion / no JS). */
  at: number;
  /** Where the window's bottom edge rests at the end of the pan, as a fraction of the capture height. Chosen so the
   *  resting frame never shows an empty state or a footer. */
  to: number;
  /** Window aspect ratio at >= 900px when 16:10 would not fit the subject (e.g. "2 / 1"). */
  ratio?: string;
  /** Horizontal anchor of the 180% zoom under 900px, as a fraction of the capture width (default 0.1). */
  zoomX?: number;
  /** What the window visibly shows (caption under the figure). */
  caption: string;
  /** Label of the `mobile.shots` entry that shows the same screen; shown instead of the desktop window under 900px.
   *  Only set when the phone capture really is the same page (the caption must stay true). */
  phone?: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  kind: string;
  /** Short feature tags for the /work entry (club order). */
  tags: string[];
  /** Case h1, "|" marks the line breaks: "A club that lives|on its website". */
  headline: string;
  /** The /work entry's one-sentence outcome. */
  outcome: string;
  /** Intro under the case h1 (two sentences). */
  intro: string;
  /** Launch year, shown only when confirmed. */
  year?: string;
  live: { href: string; label: string };
  /** Kept in the content model; not rendered (BRIEF 5.2). */
  stack: string[];
  /** "What the club got", plain English, for the meta cells. */
  got: string[];
  /** Meta description / summary line. */
  summary: string;
  /** Viewport home capture: home + /work duo, case hero, "Now" side of the pair. */
  hero: Shot;
  /** Aspect ratio of the window onto `hero` (>= 600px) when the full capture ends on something unfinished. */
  heroRatio?: string;
  before: { heading: string; old: { label: string; body: string; shot: Shot }; now: { label: string; body: string; shot: Shot } };
  vision: { heading: string; paragraphs: string[] };
  built: { heading: string; note: string; primary: Feature[] };
  /** Closing act: what the committee now does themselves, and the one-line outcome. */
  close: { heading: string; note: string; body: string; outcome: string };
  /** Phone captures, by label (shown under 900px in place of the desktop capture of the same screen). */
  mobile: { shots: { shot: Shot; label: string }[] };
};
