"use client";
/**
 * Menu (C3, M11). role="dialog" aria-modal; focus trap / Esc / inert background live in Header.
 * A full-screen white sheet wipes down on the flag slant (clip-path .7s lift); links rise from masks
 * (.8s expo, 50ms stagger); link hover glides weight 600 -> 780 (fine pointer). Closed = visibility:hidden
 * after the wipe, so nothing inside is focusable or announced. Reduced motion: instant.
 */
import Link from "@/components/IntentLink";
import { MENU, SITE, isCurrent } from "@/lib/site";

export type MenuOverlayProps = { open: boolean; email: string; pathname: string; onNavigate: () => void };

export function MenuOverlay({ open, email, pathname, onNavigate }: MenuOverlayProps) {
  return (
    <div id="menu" className={`menu${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent="">
      <div className="wrap menu-in">
        <p className="menu-eyebrow mono">Menu</p>
        <nav aria-label="Menu">
          <ol className="menu-list">
            {MENU.map((m, i) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  onClick={onNavigate}
                  aria-current={isCurrent(pathname, m.href) ? "page" : undefined}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="menu-l wglide">{m.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu-foot">
          <a href={`mailto:${email}?subject=New%20project`} className="menu-mail u-line">
            {email}
          </a>
          <p className="menu-line mono">{SITE.line}</p>
        </div>
      </div>
    </div>
  );
}
