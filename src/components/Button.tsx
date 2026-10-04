import Link from "@/components/IntentLink";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";
import { Roll } from "./Roll";

/**
 * Button (C4, M7–M9). Renders <a> (href) or <button> (no href), never a div.
 * variant "ink" (primary: white label; hover fills Flag from the pointer entry point, label turns Ink),
 *         "flag" (Ink label, 4.51:1), "ghost" (--ui-line inset -> Ink inset). `size="sm"`: 40px (44px under 760).
 * The label char-rolls (Roll). `arrow`: "→" | "↗" | "↓" draws an SVG arrow that nudges on hover.
 * `magnetic` wraps it in <Magnetic> (fine pointer only). Disabled: aria-disabled, opacity .4, no magnet.
 * Internal hrefs ("/…" or "#…") use next/link; mailto/external use <a>.
 */
export type ButtonVariant = "ink" | "flag" | "ghost";
type Common = {
  children: string;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  arrow?: "→" | "↗" | "↓";
  magnetic?: boolean;
  className?: string;
  "aria-label"?: string;
  /** Cursor tag label (data-cursor); buttons normally show the ring instead. */
  cursor?: string;
  /** Extra content after the label (e.g. an Odometer). */
  after?: ReactNode;
};
export type ButtonProps =
  | (Common & { href: string; external?: boolean; onClick?: never; type?: never; disabled?: never })
  | (Common & { href?: undefined; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; external?: never; "aria-pressed"?: boolean; "aria-busy"?: boolean });

const ARROW: Record<NonNullable<Common["arrow"]>, { d: string; cls: string }> = {
  "→": { d: "M2 8h11M9 4l4 4-4 4", cls: "btn-arr" },
  "↗": { d: "M4 12L12 4M5.5 4H12v6.5", cls: "btn-arr is-ne" },
  "↓": { d: "M8 2v11M4 9l4 4 4-4", cls: "btn-arr" },
};

export function Arrow({ dir = "→" }: { dir?: NonNullable<Common["arrow"]> }) {
  const a = ARROW[dir];
  return (
    <svg className={a.cls} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={a.d} />
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const { children, variant = "ink", size = "md", arrow, magnetic = false, className = "", cursor, after } = props;
  const cls = `btn btn-${variant}${size === "sm" ? " btn-sm" : ""} ${className}`.trim();
  const inner = (
    <span className="btn-in" data-magnetic-inner="">
      <Roll text={children} />
      {after}
      {arrow ? <Arrow dir={arrow} /> : null}
    </span>
  );
  let el: ReactNode;
  if (props.href !== undefined) {
    const { href, external } = props;
    const common = { className: cls, "aria-label": props["aria-label"], "data-cursor": cursor };
    el =
      href.startsWith("/") || href.startsWith("#") ? (
        <Link href={href} {...common}>
          {inner}
        </Link>
      ) : (
        <a href={href} {...common} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {inner}
        </a>
      );
  } else {
    el = (
      <button
        type={props.type ?? "button"}
        className={cls}
        onClick={props.disabled ? undefined : props.onClick}
        aria-disabled={props.disabled || undefined}
        aria-label={props["aria-label"]}
        aria-pressed={props["aria-pressed"]}
        aria-busy={props["aria-busy"]}
        data-cursor={cursor}
      >
        {inner}
      </button>
    );
  }
  return magnetic && !(props.href === undefined && props.disabled) ? <Magnetic>{el}</Magnetic> : el;
}

/** Underline text link (`.link-u`) with char-roll; internal hrefs use next/link. */
export function TextLink({ href, children, className = "", external = false, arrow }: { href: string; children: string; className?: string; external?: boolean; arrow?: Common["arrow"] }) {
  const content = (
    <>
      <Roll text={children} />
      {arrow ? <Arrow dir={arrow} /> : null}
    </>
  );
  const cls = `link-u ${className}`.trim();
  return href.startsWith("/") || href.startsWith("#") ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      {content}
    </a>
  );
}
