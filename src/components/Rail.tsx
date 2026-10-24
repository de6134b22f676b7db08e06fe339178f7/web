import type { ReactNode } from "react";

/**
 * The rail (DESIGN.md §4): a hairline, then the section's index and name left (`01 — Name`) and a note right.
 * Every section opens with one. The index is the section's position on its page.
 */
export function Rail({ index, name, note, className = "" }: { index: string; name: ReactNode; note?: ReactNode; className?: string }) {
  return (
    <div className={`rail ${className}`.trim()}>
      <p className="kicker">
        <b>{index}</b>
        <span aria-hidden="true"> — </span>
        <span className="sr-only">, </span>
        {name}
      </p>
      {note ? <p className="kicker rail-note">{note}</p> : null}
    </div>
  );
}
