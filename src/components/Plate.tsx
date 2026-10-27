import type { ReactNode } from "react";
import { Tag } from "./Tag";

/**
 * Plate shell (§5.3 shared anatomy, M30). <article aria-labelledby> with a head ("Plate 0N", h3 title,
 * Sample data tag, optional controls), a flex-column body (put the action row in `.plate-act` so it pins to the
 * bottom), and a footer: "Decision …" + "Interact ↗". `ink` = Ink stage (.is-ink).
 * The corner pennant tab unfolds on hover/focus-within (CSS). Height per row is set by the page grid.
 */
export type PlateProps = {
  n: number;
  id: string;
  title: string;
  decision: string;
  children: ReactNode;
  controls?: ReactNode;
  tag?: string;
  ink?: boolean;
  className?: string;
  bodyClassName?: string;
};

export function Plate({ n, id, title, decision, children, controls, tag = "Sample data", ink = false, className = "", bodyClassName = "" }: PlateProps) {
  return (
    <article className={`plate${ink ? " is-ink" : ""} ${className}`.trim()} aria-labelledby={`${id}-t`}>
      <header className="plate-hd">
        <span className="plate-n mono">{String(n).padStart(2, "0")}</span>
        <h3 id={`${id}-t`} className="plate-t">
          {title}
        </h3>
        <Tag>{tag}</Tag>
        {controls}
      </header>
      <div className={`plate-body ${bodyClassName}`.trim()}>{children}</div>
      <footer className="plate-ft">
        <p>
          {decision}
        </p>
        <span className="interact mono" aria-hidden="true">
          Interact ↗
        </span>
      </footer>
    </article>
  );
}
