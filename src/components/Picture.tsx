import { preload } from "react-dom";
import type { Shot } from "@/content/work";

const DESKTOP = [720, 1080, 1440, 2880];
const PHONE = [390, 780];

/** Below this width a `phoneShot` replaces the desktop capture (DESIGN.md §5 Capture). */
export const PHONE_MEDIA = "(max-width: 599px)";
const WIDE_MEDIA = "(min-width: 600px)";

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
  /** Shown below 600px instead of `shot` (art direction); its <source media> is emitted first. */
  phoneShot?: Shot;
  sizes: string;
  /** `sizes` for the phone source. */
  phoneSizes?: string;
  priority?: boolean;
  /** Eager + fetchPriority high, but no preload: an image that is the LCP on some viewports but below the fold on
   *  others, where a preload would compete with the real LCP. */
  eager?: boolean;
  /** alt="" for an image that repeats one already described (e.g. the phone half of a CaptureDuo). */
  decorative?: boolean;
};

/**
 * Responsive <picture> for a pre-optimised capture (scripts/optimize-images.mjs).
 * Explicit width/height from the content model; CLS 0. `priority` = LCP image (eager, fetchPriority high, preload()).
 */
export function Picture({ slug, shot, phoneShot, sizes, phoneSizes = "100vw", priority = false, eager = false, decorative = false }: PictureProps) {
  const d = srcFor(slug, shot);
  const p = phoneShot ? srcFor(slug, phoneShot) : null;
  if (priority) {
    if (p) {
      preload(p.jpg, { as: "image", imageSrcSet: p.srcSet, imageSizes: phoneSizes, fetchPriority: "high", media: PHONE_MEDIA });
      preload(d.jpg, { as: "image", imageSrcSet: d.srcSet, imageSizes: sizes, fetchPriority: "high", media: WIDE_MEDIA });
    } else {
      preload(d.jpg, { as: "image", imageSrcSet: d.srcSet, imageSizes: sizes, fetchPriority: "high" });
    }
  }
  return (
    <picture>
      {p ? <source media={PHONE_MEDIA} type="image/webp" srcSet={p.srcSet} sizes={phoneSizes} /> : null}
      <source type="image/webp" srcSet={d.srcSet} sizes={sizes} />
      <img
        src={d.jpg}
        alt={decorative ? "" : shot.alt}
        width={shot.width}
        height={shot.height}
        loading={priority || eager ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority || eager ? "high" : "low"}
        className="block h-auto w-full"
      />
    </picture>
  );
}
