/**
 * The mark: a forward-leaning WS monogram with a blue blade cut through the W. Exact geometry, never redrawn: viewBox "0 0 100 100".
 * (`pole` = the letters, `pennant` = the blade; the names are kept for the animation hooks.)
 * tone "ink":    Ink pole/pointer, Flag pennant (on paper; default)
 * tone "white":  white pole, Flag pennant (on the Ink stage)
 * tone "onflag": white pole, Ink pennant (on a Flag ground)
 * Animation hooks are always present: `.mk-pole` (path) and `.mk-pennant` (polygon). For a transform on the
 * pennant use `transform-box: fill-box; transform-origin: 0 50%` (it unfurls from the pole).
 */
export type MarkTone = "ink" | "white" | "onflag";

export const MARK_PATH =
  "M6.93 44L46.91 42.87L55.29 6L44.36 6L36.27 41.62L36.93 6L26 6L17.9 41.62L18.56 6L7.63 6ZM42.44 43L6.71 56L6 94L16.93 94L25.03 58.38L24.36 94L35.3 94L46.91 42.87ZM94 15.27C90.59 8.31 83.6 4.83 76.1 6.35C68.6 7.88 61.96 14.14 59.12 22.38C56.27 30.62 57.73 39.32 62.85 44.67L79.85 62.39C83.15 65.83 83.27 71.93 80.12 76.55C76.97 81.16 71.56 82.82 67.56 80.39C63.57 77.96 62.26 72.22 64.53 67.07L54.79 62.8C49.87 73.93 52.7 86.34 61.34 91.59C69.98 96.84 81.68 93.27 88.5 83.29C95.31 73.31 95.06 60.12 87.92 52.67L70.92 34.94C68.74 32.67 68.12 28.97 69.33 25.47C70.54 21.96 73.36 19.3 76.55 18.65C79.74 18 82.72 19.48 84.16 22.44Z";
export const MARK_PENNANT = "6.71,56 42.7,43 6.93,44";
export const MARK_VIEWBOX = "0 0 100 100";

const FILL: Record<MarkTone, [pole: string, pennant: string]> = {
  ink: ["var(--ink, #0F1729)", "var(--flag, #1F5BFF)"],
  white: ["#FFFFFF", "var(--flag, #1F5BFF)"],
  onflag: ["#FFFFFF", "var(--ink, #0F1729)"],
};

export type MarkProps = {
  /** px or any CSS length (width = height). Omit to size it from CSS. */
  size?: number | string;
  tone?: MarkTone;
  /** Accessible name; omitted = decorative (aria-hidden). */
  title?: string;
  className?: string;
  /** Extra class on the pennant polygon (e.g. the loader's `ld-pen`). */
  pennantClassName?: string;
  style?: React.CSSProperties;
};

export function Mark({ size, tone = "ink", title, className, pennantClassName, style }: MarkProps) {
  const [pole, pennant] = FILL[tone];
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path className="mk-pole" d={MARK_PATH} fill={pole} />
      <polygon className={`mk-pennant${pennantClassName ? ` ${pennantClassName}` : ""}`} points={MARK_PENNANT} fill={pennant} />
    </svg>
  );
}

/** Construction guides for the figures (Fig. 1/2), in the mark's 100-unit box: square, cap line, baseline, W/S seam. */
export const MARK_GUIDES = ["M6 6H94V94H6Z", "M0 6H100", "M0 94H100", "M50.5 2V98"];
