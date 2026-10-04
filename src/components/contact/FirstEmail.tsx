/**
 * "What helps in a first email" (§6.5): a numbered list on hairline rules. Hover: the Ink rule sweeps in from
 * the left, the number turns Flag text and a small pennant plants beside it (contact.css).
 */
export function FirstEmail({ items, labelledBy }: { items: readonly string[]; labelledBy: string }) {
  return (
    <ol className="fe" aria-labelledby={labelledBy}>
      {items.map((t, i) => (
        <li key={t} className="fe-row">
          <span className="fe-n mono" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="fe-t">{t}</span>
        </li>
      ))}
    </ol>
  );
}
