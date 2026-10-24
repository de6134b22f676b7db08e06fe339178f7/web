import type { CSSProperties, ReactNode } from "react";
import type { Shot } from "@/content/work";
import { Picture, isPhone } from "./Picture";

/**
 * Capture (BRIEF 3.6, 5.2): a plain <figure>, 1px --line border, radius 12 (phone 22), caption under in --ink-3.
 * No fake browser or phone chrome.
 * - `rise`: moment 3 (case study only), CSS in globals.css.
 * - `crop`: show a tall full-page capture through a 16:10 window whose top sits at this fraction of the capture height.
 * - `phoneShot`: under 600px the phone capture of the same screen replaces the desktop one (one <picture>, so phones
 *   fetch only the phone file), shown through a phone-shaped window at radius 22.
 * - `ratio`: the window's aspect ratio when it is not 16:10 (with `crop`), e.g. a case study's `heroRatio`.
 * - `zoom`: no phone counterpart; under 600px the desktop window is magnified so its text stays legible, shown
 *   through a 4:5 window (`zoomRatio` overrides it; a 16:10 source at 1.8x needs one no taller than 8:9).
 */
export type CaptureProps = {
  slug: string;
  shot: Shot;
  sizes: string;
  caption?: ReactNode;
  priority?: boolean;
  eager?: boolean;
  rise?: boolean;
  crop?: number;
  phoneShot?: Shot;
  zoom?: boolean;
  zoomRatio?: string;
  ratio?: string;
  className?: string;
};


const PHONE_SIZES = "min(280px, 72vw)";

export function Capture({
  slug,
  shot,
  sizes,
  caption,
  priority,
  eager,
  rise,
  crop,
  phoneShot,
  zoom,
  zoomRatio,
  ratio,
  className = "",
}: CaptureProps) {
  const cls = [
    "cap",
    isPhone(shot) ? "cap-phone" : "",
    phoneShot ? "cap-has-phone" : "",
    zoom && !phoneShot ? "cap-zoom" : "",
    rise ? "rise" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const frame = crop !== undefined;
  return (
    <figure className={cls}>
      <div className={frame ? "cap-img cap-crop" : "cap-img"} style={frame ? ({ "--at": crop, "--ratio": ratio, "--zr": zoomRatio } as CSSProperties) : undefined}>
        <Picture slug={slug} shot={shot} phoneShot={phoneShot} phoneSizes={PHONE_SIZES} sizes={sizes} priority={priority} eager={eager} />
      </div>
      {caption ? <figcaption className="meta cap-cap">{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * Desktop capture (cols 1-11) with the phone capture overlapping bottom-right (22% wide, 12% below). Under 600px
 * the desktop picture switches to the phone capture (art direction in one <picture>), centred at 72% width, and the
 * overlapping phone is hidden (display:none + lazy, so phones never fetch it twice). The overlapping phone repeats the
 * desktop image's subject, so its alt is empty. One caption for the pair.
 */
export function CaptureDuo({
  slug,
  desktop,
  phone,
  caption,
  priority,
  eager,
  ratio,
}: {
  slug: string;
  desktop: Shot;
  phone: Shot;
  caption: ReactNode;
  priority?: boolean;
  eager?: boolean;
  /** Window ratio for the desktop capture at >= 600px (top-anchored), e.g. a case study's `heroRatio`. */
  ratio?: string;
}) {
  return (
    <figure className="duo">
      <div className="duo-stage">
        <div className="cap-img duo-desk" style={ratio ? ({ "--ratio": ratio } as CSSProperties) : undefined}>
          <Picture
            slug={slug}
            shot={desktop}
            phoneShot={phone}
            phoneSizes="72vw"
            sizes="(min-width:1440px) 1212px, 84vw"
            priority={priority}
            eager={eager}
          />
        </div>
        <div className="cap-img duo-phone">
          <Picture slug={slug} shot={phone} sizes="(min-width:1440px) 290px, 22vw" decorative />
        </div>
      </div>
      <figcaption className="meta cap-cap">{caption}</figcaption>
    </figure>
  );
}
