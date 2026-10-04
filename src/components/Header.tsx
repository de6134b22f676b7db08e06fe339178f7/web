"use client";
/**
 * Site header (C2, M10, M31). Fixed, 68px (60 under 760), white .86 + blur. Brand (Mark 26 + Wordmark) -> "/",
 * home-only section counter (>= 1100; reads `[data-sec][data-sec-name]` sections), nav (>= 1100) with M6
 * underline + aria-current, "Start a project" Ink button (> 760), Menu button (< 1100).
 * Hides on scroll down past 120px via html.hdr-hidden (MotionProvider), never while focus is inside it.
 * Red progress hairline at the bottom edge. Owns the menu state + side effects (html.menu-open, Lenis stop,
 * `inert` on #main + footer, focus move/trap/return, Esc).
 */
import Link from "@/components/IntentLink";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMotion } from "@/motion/useMotion";
import { NAV, isCurrent } from "@/lib/site";
import { Mark } from "./Mark";
import { Wordmark } from "./Wordmark";
import { Button } from "./Button";
import { MenuOverlay } from "./MenuOverlay";

export function SkipLink() {
  return (
    <a href="#main" className="skiplink">
      Skip to content
    </a>
  );
}

/** Brand lockup: Mark 26 + wordmark (paths), one link home. */
export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Websport, home" className={`brand ${className}`}>
      <Mark className="brand-mark" />
      <Wordmark part="word" className="brand-word" decorative />
    </Link>
  );
}

type Sec = { n: string; name: string };

function SectionCounter() {
  const [sec, setSec] = useState<Sec>({ n: "00", name: "Index" });
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-sec]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const t = e.target as HTMLElement;
          setSec({ n: t.dataset.sec ?? "00", name: t.dataset.secName ?? "" });
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const total = "07";
  return (
    <p className="hdr-sec mono" aria-hidden="true">
      <b key={`n${sec.n}`} className="swap">
        {sec.n}
      </b>
      /{total}
      <span key={`s${sec.n}`} className="hdr-sec-name swap">
        {sec.name}
      </span>
    </p>
  );
}

export function Header({ email }: { email: string }) {
  const pathname = usePathname();
  const { stop, start } = useMotion();
  const btn = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const returnFocus = useRef(true);
  // Latest committed pathname: a route change closes the menu without pulling focus back to the button.
  const pathRef = useRef(pathname);
  useLayoutEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  // Close on any route change (link click, back/forward), without stealing focus back.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (open) setOpen(false);
  }

  // Progress hairline (scaleX), rAF-throttled. Native scroll fires under Lenis too.
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [pathname]);

  const close = useCallback((focus = true) => {
    returnFocus.current = focus;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const openedAt = pathRef.current;
    const d = document.documentElement;
    const bg = [document.getElementById("main"), document.querySelector<HTMLElement>("footer.ftr")].filter(Boolean) as HTMLElement[];
    d.classList.add("menu-open");
    d.classList.remove("hdr-hidden");
    bg.forEach((el) => (el.inert = true));
    stop();
    const menu = document.getElementById("menu");
    const focusables = () => [btn.current, ...Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button") ?? [])].filter(Boolean) as HTMLElement[];
    const raf = requestAnimationFrame(() => menu?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true }));
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1]?.focus();
      } else if (!e.shiftKey && (i === f.length - 1 || i === -1)) {
        e.preventDefault();
        f[0]?.focus();
      }
    };
    document.addEventListener("keydown", key);
    const button = btn.current;
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", key);
      d.classList.remove("menu-open");
      bg.forEach((el) => (el.inert = false));
      start();
      if (returnFocus.current && pathRef.current === openedAt) button?.focus({ preventScroll: true });
    };
  }, [open, stop, start, close]);

  return (
    <>
      <header className="hdr">
        <div className="wrap hdr-in">
          <Brand />
          {pathname === "/" ? <SectionCounter key={pathname} /> : null}
          <nav className="nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="u-line" aria-current={isCurrent(pathname, n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Button href="/contact" size="sm" className="hdr-cta" arrow="↗">
            Start a project
          </Button>
          <button
            ref={btn}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => (open ? close(true) : ((returnFocus.current = true), setOpen(true)))}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="menu-ico" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
        <span ref={bar} className="hdr-progress" aria-hidden="true">
          <i />
        </span>
      </header>
      <MenuOverlay open={open} email={email} pathname={pathname} onNavigate={() => close(false)} />
    </>
  );
}
