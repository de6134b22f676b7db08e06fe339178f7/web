/**
 * Splits a headline into lines for the masked rise (DESIGN.md §6.1): each line sits in a clipped box and rises out of it
 * with a stagger (`--i`). CSS only, so it starts at first paint. Lines are given explicitly ("|" separates them) so the
 * typography is set, not left to wrapping; a line still wraps on narrow screens, inside its own box. Screen readers get
 * the plain string. `accent` ends the last line in a blue character (a full stop by default).
 */
export function Lines({ text, from = 0, accent, className = "" }: { text: string; from?: number; accent?: string; className?: string }) {
  const lines = text.split("|").map((l) => l.trim());
  const last = lines.length - 1;
  return (
    <>
      <span className="sr-only">{`${lines.join(" ")}${accent ?? ""}`}</span>
      <span aria-hidden="true" className={`lines ${className}`.trim()}>
        {lines.map((l, i) => (
          <span key={i} className="lm">
            <span className="ln" style={{ "--i": from + i } as React.CSSProperties}>
              {l}
              {accent && i === last ? <span className="accent">{accent}</span> : null}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
