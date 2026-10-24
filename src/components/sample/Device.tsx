import type { ReactNode } from "react";

/**
 * Device frames (DESIGN.md §5): a desktop (16:10, design size 1280x800) or a phone (390:844, design size 390x844).
 * The screen inside is laid out at the design width and scaled to the frame (CSS `.screen`), so the sample club
 * screens are one layout at every size. Explicit aspect ratios: no layout shift.
 *
 * Renders `.device-wrap` (position only, no clip; `width: 100%`) around the clipped frame, so `tag` ("Sample data")
 * can sit as a sticker on the frame's top-right edge without being cut by the radius. The sticker is decorative
 * (`aria-hidden`): the page's own caption states "Sample data" in text. `className` goes on the wrapper, which is the
 * element that selectors size and animate. Decorative unless given a `label`.
 */
export function Device({
  kind,
  children,
  className = "",
  label,
  tag,
}: {
  kind: "desk" | "phone";
  children: ReactNode;
  className?: string;
  label?: string;
  /** Sticker text on the frame's edge, e.g. "Sample data". */
  tag?: string;
}) {
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };
  return (
    <div className={`device-wrap ${className}`.trim()} {...a11y}>
      <div className={`device device-${kind}`}>
        <div className="screen">{children}</div>
      </div>
      {tag ? (
        <span className="device-tag" aria-hidden="true">
          {tag}
        </span>
      ) : null}
    </div>
  );
}
