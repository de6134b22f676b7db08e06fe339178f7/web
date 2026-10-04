import { useId } from "react";
import { CREST_SHAPES, type Club } from "@/content/sample";

/**
 * Generated sample crest (§2.9.2): geometric, fictional, never resembles a real club. 48×48 viewBox.
 * `club` null renders the neutral "Unmatched" monogram placeholder (Ink 9% fill, dashed --ui-line, initials in
 * mono) used before logo matching (W8). Decorative by default; pass `label` to name it.
 * Under 28px the crest is pattern only (initials would be noise); from 28px the initials sit on a solid Ink
 * knockout disc, so two-colour patterns never cut their contrast. `keyline` (Ink grounds) draws the outline in white.
 */
export function Crest({ club, initials, size = 28, label, className = "", keyline = false }: { club: Club | null; initials?: string; size?: number; label?: string; className?: string; keyline?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  if (!club) {
    return (
      <svg viewBox="0 0 48 48" width={size} height={size} className={`crest crest-ph ${className}`.trim()} {...a11y} focusable="false">
        <path d={CREST_SHAPES[0]} />
        <text x="24" y="29" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="12" fill="var(--muted)">
          {initials ?? "?"}
        </text>
      </svg>
    );
  }
  const [a, b] = club.colours;
  const p = CREST_SHAPES[club.shape];
  const pattern =
    club.pattern === "stripe" ? <rect x="19" y="0" width="10" height="48" fill={b} /> :
    club.pattern === "half" ? <rect x="24" y="0" width="24" height="48" fill={b} opacity=".9" /> :
    club.pattern === "chev" ? <path d="M0 14l24 14 24-14v8L24 36 0 22z" fill={b} /> :
    <rect x="0" y="16" width="48" height="10" fill={b} />;
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={`crest ${className}`.trim()} {...a11y} focusable="false" overflow={keyline ? "visible" : undefined}>
      <defs>
        <clipPath id={`c${id}`}>
          <path d={p} />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <rect width="48" height="48" fill={a} />
        {pattern}
      </g>
      {/* On the Ink stage a white keyline keeps an Ink half (split, stripe) from vanishing into the ground. */}
      <path d={p} fill="none" stroke={keyline ? "rgba(255,255,255,.92)" : "rgba(15,23,41,.18)"} strokeWidth={keyline ? 2.5 : 1} />
      {size >= 28 ? (
        <g>
          <circle cx="24" cy={club.shape === 3 ? 23 : 24} r="12.5" fill="rgba(15,23,41,.9)" />
          <text x="24" y={club.shape === 3 ? 27 : 28} textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="11" letterSpacing="-.3" fill="#fff">
            {club.initials}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
