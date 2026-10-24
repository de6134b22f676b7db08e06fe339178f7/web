/**
 * The mark: a WS monogram. The W carries a cursor cut out of its middle stroke; the S is three stacked bars with
 * the pointer's tail notched into its foot. Exact geometry, never redrawn: viewBox "0 0 265.32 100" (wide, 2.65:1;
 * both letters run cap y=0 to base y=100, and never overlap).
 * (`pole` = the W, `pennant` = the S; the class names are kept for the animation hooks.)
 * tone "ink":    Ink W, Flag S (on paper / light surfaces; default)
 * tone "white":  white W, Flag S (on the Ink stage; #0061FD on #00204E is 3.1:1, clears non-text 3:1)
 * tone "onflag": white W, Ink S (on a Flag ground)
 * The W is never white on a light surface. Animation hooks are always present: `.mk-pole` (W path) and
 * `.mk-pennant` (S path). To reveal the S, wipe it with `clip-path: inset(0 100% 0 0)` -> `inset(0)` rather than
 * scaling it (a scaleX squashes the arcs and the cursor notch mid-flight).
 */
export type MarkTone = "ink" | "white" | "onflag";

export const MARK_W =
  "M0 0L44.62 0L68.42 49.88L97.58 8.63A20.43 20.43 0 0 1 129.83 7.19L178.44 64.38L157.14 64.38L122.72 37.9L122.72 82.93L115.8 93.74L99.73 66.18L80 91.29A22.8 22.8 0 0 1 41.51 87.01Z";
export const MARK_S =
  "M132.72 0L265.32 0L235.7 28.76L157.16 28.76ZM162.99 35.62L226.08 35.62A32.19 32.19 0 0 1 226.08 100L116.96 100L134.06 73.12L145.16 93.13L150.71 90.05L140.27 71.24L224.4 71.24A3.43 3.43 0 0 0 224.4 64.38L187.44 64.38Z";
/** Aliases kept for the animation code: the W is the old "pole", the S the old "pennant" (now a path). */
export const MARK_PATH = MARK_W;
export const MARK_PENNANT_D = MARK_S;
export const MARK_W_UNITS = 265.32;
export const MARK_VIEWBOX = "0 0 265.32 100";
/** Width / height. */
export const MARK_ASPECT = MARK_W_UNITS / 100;

const FILL: Record<MarkTone, [w: string, s: string]> = {
  ink: ["var(--ink, #00204E)", "var(--flag, #0061FD)"],
  white: ["#FFFFFF", "var(--flag, #0061FD)"],
  onflag: ["#FFFFFF", "var(--ink, #00204E)"],
};

export type MarkProps = {
  /** Height: px number or any CSS length (width follows at 2.65:1). Omit to size it from CSS (set a height, width auto). */
  size?: number | string;
  tone?: MarkTone;
  /** Accessible name; omitted = decorative (aria-hidden). */
  title?: string;
  className?: string;
  /** Extra class on the S path (e.g. the loader's `ld-pen`). */
  pennantClassName?: string;
  style?: React.CSSProperties;
};

export function Mark({ size, tone = "ink", title, className, pennantClassName, style }: MarkProps) {
  const [w, s] = FILL[tone];
  const width = typeof size === "number" ? +(size * MARK_ASPECT).toFixed(2) : undefined;
  const sized = typeof size === "string" ? { height: size, width: "auto", aspectRatio: `${MARK_W_UNITS} / 100`, ...style } : style;
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={width}
      height={typeof size === "number" ? size : undefined}
      className={className}
      style={sized}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path className="mk-pole" d={MARK_W} fill={w} />
      <path className={`mk-pennant${pennantClassName ? ` ${pennantClassName}` : ""}`} d={MARK_S} fill={s} />
    </svg>
  );
}

/**
 * Construction guides for the figures (Fig. 1/2), in the mark's units (viewBox 0 0 265.32 100):
 * artwork box, cap line, baseline, the W/S seam (the 9-unit parallel gap between the W's right arm and the S),
 * the S bar rows (28.76 / 35.62 and 64.38 / 71.24; the W's arm ends on the 64.38 row) and the cursor (the
 * pointer left in the negative space: tip on the W's middle stroke, tail notched into the S's foot).
 * Draw them inside a viewBox of FIG_VIEWBOX so the labels fit.
 */
export const MARK_GUIDE_BOX = "M0 0H265.32V100H0Z";
export const MARK_GUIDE_CAP = "M-6 0H271.32";
export const MARK_GUIDE_BASE = "M-6 100H271.32";
export const MARK_GUIDE_SEAM = "M123.12 -6L182.94 64.38";
export const MARK_GUIDE_BARS = ["M104 28.76H275.32", "M104 35.62H275.32", "M104 64.38H275.32", "M104 71.24H275.32"];
export const MARK_GUIDE_CURSOR = "M122.72 37.9L157.14 64.38L140.27 71.24L150.71 90.05L145.16 93.13L134.06 73.12L122.72 82.93Z";
export const MARK_GUIDES = [MARK_GUIDE_BOX, MARK_GUIDE_CAP, MARK_GUIDE_BASE, MARK_GUIDE_SEAM, ...MARK_GUIDE_BARS, MARK_GUIDE_CURSOR];
/** Figure viewBox: the artwork plus room for the mono notes (Cap/Base right, Seam above, Bars at the row ends, Cursor below). */
export const FIG_VIEWBOX = "-10 -16 318 136";

/** Mono notes shared by the figures, in figure units: [text, x, y, anchor]. Font size ~7 units. None sits on a guide. */
export const FIG_NOTES: [string, number, number, "start" | "middle" | "end"][] = [
  ["Cap", 304, 2.4, "end"],
  ["Base", 304, 102.4, "end"],
  ["Seam", 119, -6, "end"],
  ["Bars", 279, 34.6, "start"],
  ["Cursor", 134, 114, "middle"],
];
