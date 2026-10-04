/**
 * "A · B · C" rendered so a line never starts or ends on a middot: each item is unbreakable and carries its own
 * leading dot in a fixed-width slot; the row is shifted left by one slot inside a clipping box, so the dot of any
 * item that starts a line falls in the clipped margin. The dots are decorative (CSS content with empty alt text).
 */
export function DotList({ items, className = "" }: { items: string[] | string; className?: string }) {
  const list = typeof items === "string" ? items.split(" · ") : items;
  return (
    <span className={`dl ${className}`.trim()}>
      <span className="dl-in">
        {list.map((t) => (
          <span key={t} className="dl-i">
            {t}
          </span>
        ))}
      </span>
    </span>
  );
}
