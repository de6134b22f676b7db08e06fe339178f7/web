import type { Metadata } from "next";
import Link from "@/components/IntentLink";
import { SITE } from "@/lib/site";
import { Roll } from "@/components/Roll";
import { Arrow } from "@/components/Button";
import { SwayMark } from "@/components/contact/SwayMark";

export const metadata: Metadata = { title: "Page not found" };

const ROWS = [
  ["/", "Home"],
  ["/work", "Work"],
  ["/studio", "Studio"],
  ["/contact", "Contact"],
] as const;

/** 404 (§6.6): exported as out/404.html. The mark has fallen out of bounds (M38); the rows wedge in Flag. */
export default function NotFound() {
  return (
    <>
      <header className="wrap pg-hd nf-hd">
        <p className="pg-eyebrow mono h-fade" style={{ "--i": 0 } as React.CSSProperties}>
          <span>404</span>
          <span>Page not found</span>
        </p>
        <div className="nf-top">
          <h1 className="pg-h t-display nf-h">
            <span className="h-line" style={{ "--i": 0 } as React.CSSProperties}>
              Out of
            </span>
            <span className="h-line" style={{ "--i": 1 } as React.CSSProperties}>
              <em>bounds.</em>
            </span>
          </h1>
          <SwayMark />
        </div>
        <p className="pg-lede t-lead h-fade" style={{ "--i": 1 } as React.CSSProperties}>
          This page isn&rsquo;t on the field. These ones are:
        </p>
      </header>
      <nav className="wrap nf-nav h-fade" style={{ "--i": 2 } as React.CSSProperties} aria-label="Pages">
        <ul className="nf-list">
          {ROWS.map(([href, label], i) => (
            <li key={href}>
              <Link href={href} className="nf-row">
                <span className="nf-n mono" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="nf-l t-kit wglide">
                  <Roll text={label} />
                </span>
                <span className="nf-a" aria-hidden="true">
                  <Arrow dir="→" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="nf-mail">
          Or email{" "}
          <a href={`mailto:${SITE.email}`} className="nf-mail-a">
            <Roll text={SITE.email} />
          </a>
        </p>
      </nav>
    </>
  );
}
