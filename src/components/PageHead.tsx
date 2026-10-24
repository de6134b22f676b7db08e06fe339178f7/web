import type { ReactNode } from "react";
import { Lines } from "./Lines";

/**
 * Inner-page head (DESIGN.md §4): a rail (kicker left, note right; the note is hidden under 600px), the display h1
 * (lines rise out of their boxes, ending in the blue stop), then the lede and an optional aside. At >= 900px the lede
 * sits in cols 1-6 under the h1; with `wide` the h1 runs cols 1-11 and the next row is lede (cols 1-6) | aside
 * (cols 7-13). Stacked under 900px. `title` without its final full stop; "|" marks the line breaks.
 */
export function PageHead({
  id,
  title,
  kicker,
  note,
  lede,
  aside,
  wide = false,
  accent = ".",
}: {
  id: string;
  title: string;
  kicker: ReactNode;
  note?: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  /** Let the h1 run the full measure (long headlines). */
  wide?: boolean;
  accent?: string;
}) {
  return (
    <>
      <div className="rail head-in" style={{ "--i": 0 } as React.CSSProperties}>
        <p className="kicker">{kicker}</p>
        {note ? <p className="kicker rail-note">{note}</p> : null}
      </div>
      <div className="ph-grid">
        <h1 id={id} className={wide ? "display ph-h ph-wide" : "display ph-h"}>
          <Lines text={title} accent={accent} />
        </h1>
        {lede ? (
          <p className="lede head-in" style={{ "--i": 6 } as React.CSSProperties}>
            {lede}
          </p>
        ) : null}
        {aside ? (
          <div className="ph-aside head-in" style={{ "--i": 6 } as React.CSSProperties}>
            {aside}
          </div>
        ) : null}
      </div>
    </>
  );
}
