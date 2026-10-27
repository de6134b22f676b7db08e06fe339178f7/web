import type { ReactNode } from "react";
import { SplitHeading } from "./Reveal";
import { ContactMark } from "./ContactMark";
import { Button } from "./Button";

/**
 * Shared contact band. Ink rule + mono key, split-reveal headline (size "cta" = --t-cta the closing line,
 * "h2" = --t-h2 for Work/Studio), optional ContactMark (columns 8–12; never overlaps the headline), then the
 * action row (`actions`, e.g. a "Start a project" Button) (defaults to "Start a project" → /contact), and the sub line.
 * Home: <section data-sec-name="Contact"> is set via `sec`.
 */
export type ContactBandProps = {
  title: ReactNode;
  id?: string;
  n?: string;
  name?: string;
  size?: "cta" | "h2";
  mark?: "scrub" | "static" | false;
  sub?: string;
  actions?: ReactNode;
  sec?: { name: string };
};

export function ContactBand({ title, id = "contact", n, name = "Contact", size = "cta", mark = false, sub, actions, sec }: ContactBandProps) {
  return (
    <section id={id} className={`sec cta-band${mark ? "" : " no-mark"}`} aria-labelledby={`${id}-h`} data-sec-name={sec?.name}>
      <div className="wrap">
        <div className="sec-hd">
          <p className="sec-k mono">
            {n ? <span>{n}</span> : null}
            <span>{name}</span>
          </p>
          <div className="cta-grid">
            <SplitHeading as="h2" id={`${id}-h`} className={`cta-h ${size === "cta" ? "t-cta" : "t-h2"}`}>
              {title}
            </SplitHeading>
            {mark ? <ContactMark mode={mark} className="cta-mark" /> : null}
          </div>
        </div>
        <div className="cta-row">
          {actions ?? (
            <Button href="/contact" magnetic arrow="→">
              Start a project
            </Button>
          )}
        </div>
        {sub ? <p className="cta-sub">{sub}</p> : null}
      </div>
    </section>
  );
}
