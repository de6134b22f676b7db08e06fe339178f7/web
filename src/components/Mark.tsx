/**
 * The mark (DESIGN.md v4 §2.1). Exact geometry, never redrawn: viewBox "14 13 66 66".
 * tone "ink":    Ink pole/pointer, Flag pennant (on paper; default)
 * tone "white":  white pole, Flag pennant (on the Ink stage)
 * tone "onflag": Ink pole, white pennant (on a Flag ground)
 * Animation hooks are always present: `.mk-pole` (path) and `.mk-pennant` (polygon). For a transform on the
 * pennant use `transform-box: fill-box; transform-origin: 0 50%` (it unfurls from the pole).
 */
export type MarkTone = "ink" | "white" | "onflag";

export const MARK_PATH = "M20 16 L72.38 68.38 A5.5 5.5 0 0 1 64.61 76.16 L43.83 55.38 L20 68 Z";
export const MARK_PENNANT = "20,31.56 20,68 43.83,55.38";
export const MARK_VIEWBOX = "14 13 66 66";

const FILL: Record<MarkTone, [pole: string, pennant: string]> = {
  ink: ["var(--ink, #0F1729)", "var(--flag, #E8442B)"],
  white: ["#FFFFFF", "var(--flag, #E8442B)"],
  onflag: ["var(--ink, #0F1729)", "#FFFFFF"],
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
