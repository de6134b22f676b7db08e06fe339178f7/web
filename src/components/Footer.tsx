import Link from "@/components/IntentLink";
import { PLAYHQ_NOTE, SITE } from "@/lib/site";
import { Mark } from "./Mark";
import { FooterWordmark } from "./FooterWordmark";

/**
 * Footer (C9). Ink rule; brand line + Mark; footer nav (Work · Studio · PlayHQ · Contact · Email); legal line +
 * PlayHQ trademark note; the giant outlined wordmark (M27). The only Work link besides the header nav and menu.
 */
const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/#playhq", label: "PlayHQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-top">
          <div className="ftr-brand">
            <Mark className="mark" />
            <p>{SITE.line}</p>
          </div>
          <nav className="ftr-nav" aria-label="Footer">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="u-line">
                {l.label}
              </Link>
            ))}
            <a href={`mailto:${SITE.email}?subject=New%20project`} className="u-line">
              Email
            </a>
          </nav>
          <div className="ftr-legal mono">
            <span>Websport · websport.com.au</span>
            <span>{PLAYHQ_NOTE}</span>
          </div>
        </div>
        <FooterWordmark />
        <div className="ftr-pad" />
      </div>
    </footer>
  );
}
