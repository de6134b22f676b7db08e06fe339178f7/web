/** One line of items running across the measure (DESIGN.md §4). The list is doubled for the loop; the copy is aria-hidden. */
export function Marquee({ items, label }: { items: readonly string[]; label: string }) {
  const row = (k: string) => (
    <span key={k}>
      {items.map((it) => (
        <span key={it}>
          {it}
          <i aria-hidden="true" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" role="img" aria-label={label}>
      <div className="marquee-in" aria-hidden="true">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
