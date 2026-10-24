import Link from "@/components/IntentLink";
import type { ReactNode } from "react";

/**
 * The one button (DESIGN.md §5): blue pill, white 15px/500 label, 48px tall (`.btn-sm` 40px via className; the header
 * button is 44px via `.site-header .site-cta`). Hover `--blue-deep`, press scale(.97). Renders <a> (href) or
 * <button>, never a div. `.btn-ghost` is outlined in the current colour. A secondary action is an ArrowLink.
 */
type Common = { children: ReactNode; className?: string; "aria-label"?: string };
export type ButtonProps =
  | (Common & { href: string; external?: boolean })
  | (Common & { href?: undefined; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean; "aria-busy"?: boolean });

const isInternal = (href: string) => href.startsWith("/") || href.startsWith("#");

export function Button(props: ButtonProps) {
  const cls = `btn ${props.className ?? ""}`.trim();
  if (props.href !== undefined) {
    const { href, external, children } = props;
    return isInternal(href) ? (
      <Link href={href} className={cls} aria-label={props["aria-label"]}>
        {children}
      </Link>
    ) : (
      <a href={href} className={cls} aria-label={props["aria-label"]} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
        {children}
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <button
      type={props.type ?? "button"}
      className={cls}
      onClick={props.disabled ? undefined : props.onClick}
      aria-disabled={props.disabled || undefined}
      aria-busy={props["aria-busy"]}
      aria-label={props["aria-label"]}
    >
      {props.children}
    </button>
  );
}

/** Arrow link (DESIGN.md §5): 15px/500 text with "→" after it; hover/focus: underline, the arrow moves 4px. */
export function ArrowLink({ href, children, className = "", external = false }: { href: string; children: ReactNode; className?: string; external?: boolean }) {
  const cls = `arrow ${className}`.trim();
  return isInternal(href) ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
