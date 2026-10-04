import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { SplitHeading } from "./Reveal";
import { ContactMark } from "./ContactMark";
import { CopyEmail } from "./CopyEmail";

/**
 * Shared contact band. Ink rule + mono key, split-reveal headline (size "cta" = --t-cta "Plant your flag.",
 * "h2" = --t-h2 for Work/Studio), optional ContactMark (columns 8–12; never overlaps the headline), then the
 * action row (`actions`, e.g. a "Start a project" Button) + the email link + "Copy email", and the sub line.
 * Home: <section data-sec="07" data-sec-name="Contact"> is set via `sec`.
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
  sec?: { n: string; name: string };
};

export function ContactBand({ title, id = "contact", n, name = "Contact", size = "cta", mark = false, sub, actions, sec }: ContactBandProps) {
  return (
    <section id={id} className={`sec cta-band${mark ? "" : " no-mark"}`} aria-labelledby={`${id}-h`} data-sec={sec?.n} data-sec-name={sec?.name}>
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
          {actions}
          <CopyEmail email={SITE.email} size="mail" />
        </div>
        {sub ? <p className="cta-sub">{sub}</p> : null}
      </div>
    </section>
  );
}
