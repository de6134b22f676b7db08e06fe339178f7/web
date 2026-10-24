/**
 * Site config (DESIGN.md §7.7, §8). Gated facts stay `undefined` until the founder confirms them; nothing renders
 * a placeholder for them. Never fill one in with a guess.
 */
export type SiteConfig = {
  name: string;
  url: string;
  email: string;
  /** Brand line (footer). */
  line: string;
  /** Tagline (default <title>). */
  tagline: string;
  description: string;
  /** Gated: unconfirmed. */
  city?: string;
  timeZone?: string;
  replyTime?: string;
  copyrightFrom?: string;
};

export const SITE: SiteConfig = {
  name: "Websport",
  url: "https://websport.com.au",
  email: "hello@websport.com.au",
  line: "Websites and apps for sports clubs.",
  tagline: "Websites and apps for community sports clubs",
  description:
    "Websport designs and builds websites, platforms and apps for community sports clubs, with fixtures and ladders from PlayHQ.",
};

/** Codes in display order (codes row, contact select). */
export const CODES = ["AFL", "Soccer", "Basketball", "Netball", "Cricket", "Hockey", "Baseball"] as const;

/** Codes row items. "And the rest" is bound with non-breaking spaces so it never wraps on its own. */
export const CODES_ROW = [...CODES, "And the rest"];

/** Header and footer nav. */
export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
] as const;

/** aria-current test for nav links. */
export const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/** Trademark note: every section that features PlayHQ, and the footer. */
export const PLAYHQ_NOTE = "PlayHQ is a trademark of its owner. Websport is an independent studio.";

/**
 * The Open Graph block for one page. Next merges `openGraph` shallowly per segment, so a page restates the whole
 * block to set its own `url`. Images come from scripts/og.mjs (public/og/<name>.png; /og.png = home).
 */
export function og(path: string, image = "/og.png", alt = `${SITE.name}: ${SITE.tagline.toLowerCase()}`) {
  return {
    type: "website" as const,
    locale: "en_AU",
    siteName: SITE.name,
    url: path,
    images: [{ url: image, width: 1200, height: 630, alt }],
  };
}
