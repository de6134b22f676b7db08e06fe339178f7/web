/** Tag (C6): mono 10px, --ui-line border, Flag pennant bullet, a real word (never icon-only). */
export function Tag({ children = "Sample data", className = "" }: { children?: string; className?: string }) {
  return <span className={`tag ${className}`.trim()}>{children}</span>;
}
