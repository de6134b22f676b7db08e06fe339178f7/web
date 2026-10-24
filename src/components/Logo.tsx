import type { CSSProperties } from "react";
import { BRAND } from "./brand.generated";

/**
 * The Websport logo as inline SVG (DESIGN.md §2), from scripts/brand.mjs path data, so it never waits on a font.
 * - variant "lockup": the mark is the capital W of "Websport". "mark": the W alone.
 * - tone "primary" (Night + blue ball), "white" (all white), "mono" (all Night). In the header the tone follows the
 *   ground through CSS (`.site-header[data-tone]` recolours `.logo-ink` and `.logo-ball`).
 * - label: accessible name (role="img"). Omit it when the parent link already names the destination.
 * - size: rendered height in px; sets the hop (§2.2, 3px up / 2px right) and the build drop (one cap height) in the
 *   ball's user units. Both animations are CSS in globals.css.
 */
type Tone = "primary" | "white" | "mono" | "night";
const INK: Record<Tone, [ink: string, ball: string]> = {
  primary: ["var(--ink)", "var(--blue)"],
  white: ["#FFFFFF", "#FFFFFF"],
  mono: ["var(--ink)", "var(--ink)"],
  /** On the Night ground: white W, the blue ball (the home intro, where the ball leaves the mark as the hero ball). */
  night: ["#FFFFFF", "var(--blue)"],
};

export type LogoProps = {
  variant?: "lockup" | "mark";
  tone?: Tone;
  size?: number;
  label?: string;
  className?: string;
};

export function Logo({ variant = "lockup", tone = "primary", size = 22, label, className = "" }: LogoProps) {
  const [ink, ball] = INK[tone];
  const lockup = variant === "lockup";
  const vb = lockup ? BRAND.lockup.viewBox : BRAND.mark.viewBox;
  const vbH = lockup ? BRAND.lockup.height : BRAND.mark.height;
  const vbW = Number(vb.split(" ")[2]);
  const scale = lockup ? BRAND.lockup.markScale : 1;
  const unit = vbH / (size * scale);
  const style = {
    "--hop-x": `${(2 * unit).toFixed(2)}px`,
    "--hop-y": `${(-3 * unit).toFixed(2)}px`,
    "--drop": `-${(100).toFixed(0)}px`,
  } as CSSProperties;
  const { cx, cy, r } = BRAND.mark.ball;
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const, focusable: "false" as const };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={vb}
      height={size}
      width={Math.round(((size * vbW) / vbH) * 100) / 100}
      className={`logo ${className}`.trim()}
      style={style}
      {...a11y}
    >
      {label ? <title>{label}</title> : null}
      <g transform={lockup ? BRAND.lockup.markTransform : undefined}>
        <path className="logo-ink" fill={ink} d={BRAND.mark.d} />
        <circle className="logo-ball" fill={ball} cx={cx} cy={cy} r={r} />
      </g>
      {lockup ? <path className="logo-ink" fill={ink} transform={BRAND.lockup.wordTransform} d={BRAND.lockup.wordD} /> : null}
    </svg>
  );
}
