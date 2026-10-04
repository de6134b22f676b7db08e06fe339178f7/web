/**
 * Site config (DESIGN.md "Sources of truth"). Gated facts stay `undefined` until the founder confirms them;
 * nothing reads them until confirmed. Never fill one in with a guess.
 */
export type SiteConfig = {
  name: string;
  url: string;
  email: string;
  /** Brand line (fixed). */
  line: string;
  /** Tagline (fixed). */
  tagline: string;
  description: string;
  /** Gated: unconfirmed. */
  city?: string;
  timeZone?: string;
  availability?: string;
  replyTime?: string;
  copyrightFrom?: string;
};

export const SITE: SiteConfig = {
  name: "Websport",
  url: "https://websport.com.au",
  email: "hello@websport.com.au",
  line: "Every club plants its flag online.",
  tagline: "Websites & apps for community sports clubs",
  description:
    "Websport designs and builds websites and apps for community sports clubs on PlayHQ, across every code, and brings the same craft to any brand.",
};

/** Codes in display order (hero sport pill, codes list). */
export const CODES = ["AFL", "Soccer", "Basketball", "Baseball", "Netball", "Cricket", "Hockey"] as const;

/** Sports line (work band, menu): cricket is only one code among many. */
/** "And the rest" is bound with non-breaking spaces so it never wraps on its own ("AND THE / REST"). */
export const SPORTS_LINE = [...CODES, "And\u00a0the\u00a0rest"].join(" · ");

/** Header nav (v4 §5.1 C2). `/#playhq` is an in-page anchor on home. */
export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/#playhq", label: "PlayHQ" },
  { href: "/contact", label: "Contact" },
] as const;

/** Menu items (v4 §5.1 C3), numbered 01–05. */
export const MENU = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/#playhq", label: "PlayHQ" },
  { href: "/contact", label: "Contact" },
] as const;

/** aria-current test for nav links (hash links are never "current"). */
export const isCurrent = (pathname: string, href: string) =>
  href.includes("#") ? false : href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/** Trademark note: wherever PlayHQ is featured. */
export const PLAYHQ_NOTE = "PlayHQ is a trademark of its owner. Websport is an independent studio.";

/**
 * The site-wide Open Graph block for one page. Next merges `openGraph` shallowly per segment, so a page must
 * restate the whole block to set its own `url`. `alt` describes that route's card (scripts/og.mjs). `image` defaults to /og.png until per-route OG images exist (6.4).
 */
export function og(path: string, image = "/og.png", alt = "Websport — websites & apps for community sports clubs") {
  return {
    type: "website" as const,
    locale: "en_AU",
    siteName: SITE.name,
    url: path,
    images: [{ url: image, width: 1200, height: 630, alt }],
  };
}
