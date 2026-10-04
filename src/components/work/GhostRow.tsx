import Link from "@/components/IntentLink";

/**
 * "Your club, next." ghost row (DESIGN.md v4 §5.5, §6.2, CS7). A dashed --ui-line outline (the empty slot in the
 * list). Hover / focus: the outline draws solid Ink, a Flag pennant is planted before the name, the name shifts
 * and glides weight, the arrow turns -45deg. Touch: static. Forced colours: system border.
 */
export function GhostRow({
  no,
  href = "/contact",
  name = "Your club, next.",
  kind = "Any code on PlayHQ",
  sub,
}: {
  no?: string;
  href?: string;
  name?: string;
  kind?: string;
  sub?: string;
}) {
  return (
    <div className="wk-ghost">
      <Link href={href} className="wk-ghost__a">
        {no ? <span className="wk-ghost__no mono">{no}</span> : null}
        <span className="wk-ghost__main">
          <span className="wk-ghost__name t-h2">
            <span className="wk-row__pen" aria-hidden="true" />
            <span className="wk-row__nt">{name}</span>
          </span>
          {sub ? <span className="wk-ghost__sub">{sub}</span> : null}
        </span>
        <span className="wk-ghost__kind mono">{kind}</span>
        <span className="wk-ghost__go">
          <svg className="wk-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
