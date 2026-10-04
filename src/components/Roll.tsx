/**
 * Char-roll label (C5, M5). Pure CSS, server-safe. Each letter is replaced by a duplicate from below
 * (500ms expo, 16ms per letter) when the parent link/button (or any `.roll-host`) is hovered or focus-visible.
 * Screen readers get the visually-hidden text; the letters are aria-hidden. Reduced motion: instant swap.
 */
export type RollProps = { text: string; className?: string };

export function Roll({ text, className = "" }: RollProps) {
  return (
    <span className={`roll${className ? ` ${className}` : ""}`}>
      <span className="sr">{text}</span>
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {Array.from(text).map((c, i) => (
          <span key={i} className="roll-ch" data-c={c} style={{ "--ci": i } as React.CSSProperties}>
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}
