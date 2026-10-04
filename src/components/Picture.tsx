import { preload } from "react-dom";
import type { Shot } from "@/content/work";

const DESKTOP = [720, 1080, 1440, 2880];
const PHONE = [390, 780];

/** `sizes` presets (DESIGN.md 4.26). */
export const SIZES = {
  flood: "(min-width:1024px) 34vw, 92vw",
  featureFrame: "(min-width:1024px) 56vw, 92vw",
  preview: "380px",
  phone: "(min-width:1024px) 22vw, 70vw",
  thumb: "(min-width:1024px) 160px, 92vw",
  workFeature: "(min-width:1600px) 1320px, (min-width:1024px) 84vw, 92vw",
} as const;

export type Sizes = keyof typeof SIZES | (string & {});

export function sizesOf(s: Sizes): string {
  return (SIZES as Record<string, string>)[s] ?? s;
}

/** Phone captures are 780 wide; everything else (viewport and -full) is 2880. */
export function isPhone(shot: Shot): boolean {
  return shot.width === 780;
}

export function srcFor(slug: string, shot: Shot) {
  const base = `/work/${slug}/${shot.file}`;
  const widths = isPhone(shot) ? PHONE : DESKTOP;
  const fallback = isPhone(shot) ? 780 : 1440;
  return {
    base,
    srcSet: widths.map((w) => `${base}-${w}.webp ${w}w`).join(", "),
    jpg: `${base}-${fallback}.jpg`,
  };
}

export type PictureProps = {
  slug: string;
  shot: Shot;
  /** Shown below 768 instead of `shot`; its <source media> is emitted first. */
  phoneShot?: Shot;
  /** A preset name from SIZES or a raw `sizes` expression. */
  sizes: Sizes;
  /** Only for the phone source; defaults to "100vw". */
  phoneSizes?: string;
  priority?: boolean;
  /** Eager without preload or high priority: an image that is the LCP on some viewports (desktop) but below the
   *  fold on others (phones), where a preload would compete with the real LCP. */
  eager?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * Responsive <picture> for a pre-optimised capture (scripts/optimize-images.mjs).
 * Explicit width/height from the content model; CLS 0. `priority` = LCP image (eager, fetchPriority high, preload()).
 */
export function Picture({ slug, shot, phoneShot, sizes, phoneSizes = "100vw", priority = false, eager = false, className = "", imgClassName = "" }: PictureProps) {
  const d = srcFor(slug, shot);
  const p = phoneShot ? srcFor(slug, phoneShot) : null;
  const s = sizesOf(sizes);
  if (priority) {
    if (p) {
      preload(p.jpg, { as: "image", imageSrcSet: p.srcSet, imageSizes: phoneSizes, fetchPriority: "high", media: "(max-width: 767px)" });
      preload(d.jpg, { as: "image", imageSrcSet: d.srcSet, imageSizes: s, fetchPriority: "high", media: "(min-width: 768px)" });
    } else {
      preload(d.jpg, { as: "image", imageSrcSet: d.srcSet, imageSizes: s, fetchPriority: "high" });
    }
  }
  return (
    <picture className={className || undefined}>
      {p ? <source media="(max-width: 767px)" type="image/webp" srcSet={p.srcSet} sizes={phoneSizes} /> : null}
      <source type="image/webp" srcSet={d.srcSet} sizes={s} />
      <img
        src={d.jpg}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading={priority || eager ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : eager ? "auto" : "low"}
        className={`block h-auto w-full ${imgClassName}`}
      />
    </picture>
  );
}
