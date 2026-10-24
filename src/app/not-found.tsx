import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { PageHead } from "@/components/PageHead";
import "./not-found.css";

/** No `robots` here: Next already sends noindex for the not-found page. */
export const metadata: Metadata = { title: "Page not found" };

/**
 * 404: the standard page head (no decorative numeral, no "Error 404" kicker; the <title> is the one "404"), two ways
 * back in the aside, a rule, then the footer like every other page.
 */
export default function NotFound() {
  return (
    <section className="page-head nf" aria-labelledby="nf-h">
      <div className="wrap">
        <PageHead
          id="nf-h"
          kicker="Not found"
          title="Out of|bounds"
          lede="That page isn’t on the ground. Head home, or see the work."
          aside={
            <div className="actions">
              <ArrowLink href="/">Back to home</ArrowLink>
              <ArrowLink href="/work">See the work</ArrowLink>
            </div>
          }
        />
        <hr className="rule" />
      </div>
    </section>
  );
}
