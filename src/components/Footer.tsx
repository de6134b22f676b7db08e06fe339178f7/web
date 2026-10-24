import Link from "@/components/IntentLink";
import { NAV, PLAYHQ_NOTE, SITE } from "@/lib/site";
import { Button } from "./Button";
import { CopyEmail } from "./CopyEmail";
import { Logo } from "./Logo";

/**
 * Footer (DESIGN.md §4): the night ground on every page, and the page's single close. "Tell us about your club." as a
 * display line with the address + Copy and the button beside it (`.split` from 600px, cols 1-8 / 8-13 from 900px);
 * then one row of three columns on one line: nav (cols 1-5), the brand line (5-9), legal right-aligned (9-13); then
 * the white lockup across the whole measure. The PlayHQ trademark note lives here only.
 * `cta=false` (/contact, via SiteFooter) drops the closing line: the page itself is the invitation.
 */
export function Footer({ cta = true }: { cta?: boolean }) {
  return (
    <footer className={cta ? "site-footer on-night" : "site-footer on-night site-footer-plain"}>
      <div className="wrap">
        {cta ? (
          <section className="foot-cta split" aria-labelledby="foot-h">
            <h2 id="foot-h" className="display foot-h">
              Tell us about your club<span className="accent">.</span>
            </h2>
            <div className="foot-actions">
              <CopyEmail email={SITE.email} />
              <Button href="/contact">Start a project</Button>
            </div>
          </section>
        ) : null}
        <div className="foot-rows">
          <nav aria-label="Footer" className="foot-nav">
            <Link href="/">Home</Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
          <p className="foot-line label">{SITE.line}</p>
          <p className="foot-legal label">
            <span>{PLAYHQ_NOTE}</span>
            <span>
              © {new Date().getFullYear()} {SITE.name}
            </span>
          </p>
        </div>
        <div className="foot-mark" aria-hidden="true">
          <Logo tone="white" size={120} />
        </div>
      </div>
    </footer>
  );
}
