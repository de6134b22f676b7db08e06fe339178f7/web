"use client";
/**
 * Floating header (DESIGN.md §4): two frosted pills 14px below the top edge. Left: the lockup (links home; the ball
 * hops on hover/focus), the mark alone under 420px. Right: Work · Studio · Contact and the blue button, which reads
 * "Start" under 600px and is hidden under 420px (Contact is in the nav). It slips away while scrolling down past
 * 200px and returns on the way up. On the home loader it waits and fades in once the curtain is gone (CSS, §6.2).
 */
import Link from "@/components/IntentLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { NAV, isCurrent } from "@/lib/site";
import { ScrollTrigger, reduced } from "@/lib/motion";
import { Logo } from "./Logo";

export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  );
}

export function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = reduced();
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        el.setAttribute("data-hide", !still && self.direction === 1 && y > 200 ? "1" : "0");
      },
    });
    return () => st.kill();
  }, [pathname]);

  return (
    <header ref={ref} className="site-header">
      <div className="wrap site-header-in">
        <Link href="/" className="pill logo-link" aria-label="Websport, home">
          <Logo size={20} className="logo-wide" />
          <Logo variant="mark" size={20} className="logo-narrow" />
        </Link>
        <div className="site-right">
          <nav aria-label="Primary" className="pill site-nav">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isCurrent(pathname, n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="btn site-cta">
            <span className="cta-long">Start a project</span>
            <span className="cta-short">Start</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
