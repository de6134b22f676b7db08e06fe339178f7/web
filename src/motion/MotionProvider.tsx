"use client";
/**
 * Mounted once in layout.tsx (DESIGN.md v4 §4.3). Owns:
 * - Lenis (duration 1.1, expo-out) on the GSAP ticker, lagSmoothing(0); off under reduced motion and coarse pointers
 * - ScrollTrigger.refresh() after route changes and after document.fonts.ready
 * - in-page anchor scrolling (96px = html scroll-padding-top), with focus
 * - html flags: `hydrated` (gates the split-heading hidden state), `has-cursor` (fine pointer + motion),
 *   `is-scrolled` / `hdr-hidden` (scroll down past 120px; never under reduced motion or while the menu is open),
 *   `navigated` (first client-side pathname change; never removed; --intro .38s + loader display:none, §3.5),
 *   `data-vt` (during a forward route change: the page-wipe red band)
 * - Ink button fill origin: --mx/--my on `.btn-ink` from the pointer entry point (M8)
 * - context { reduced, fine, lenis, scrollTo, stop, start }
 * Nothing in v4 depends on hydration for visibility: the loader and hero entrance are CSS (globals.css).
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { MotionCtx, useMediaQuery, type MotionContext, type ScrollOpts, type ScrollTarget } from "./useMotion";
import { ANCHOR_OFFSET, MQ } from "./tokens";

/** expo-out, the Lenis easing (§4.2). */
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function resolve(target: ScrollTarget): HTMLElement | number | null {
  if (typeof target === "number") return target;
  if (typeof target !== "string") return target;
  if (target === "#top" || target === "#main" || target === "") return document.getElementById("main");
  try {
    return document.querySelector<HTMLElement>(target.startsWith("#") ? `#${CSS.escape(target.slice(1))}` : target);
  } catch {
    return null;
  }
}

function focusEl(el: HTMLElement) {
  if (!el.hasAttribute("tabindex") && !el.matches("a[href],button,input,select,textarea,[tabindex]")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = useMediaQuery(MQ.reduced, true);
  const fine = useMediaQuery(MQ.fine, false);
  const coarse = useMediaQuery(MQ.coarse, true);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const first = useRef(true);

  const scrollTo = useCallback((target: ScrollTarget, opts: ScrollOpts = {}) => {
    const el = resolve(target);
    if (el === null) return;
    const lenis = lenisRef.current;
    const done = () => {
      if (opts.focus && typeof el !== "number") focusEl(el);
    };
    if (lenis) {
      // Lenis subtracts html scroll-padding-top itself: only an explicit extra offset is passed on.
      lenis.scrollTo(el, { offset: typeof el === "number" ? 0 : (opts.offset ?? 0), duration: 1.1, easing: expoOut, immediate: opts.immediate, force: true, onComplete: done });
      if (opts.immediate) done();
    } else {
      const y = typeof el === "number" ? el : el.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET + (opts.offset ?? 0);
      window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
      done();
    }
  }, []);

  // html flags that depend on media state.
  useEffect(() => {
    const d = document.documentElement;
    d.classList.add("hydrated");
    d.classList.toggle("has-cursor", fine && !reduced);
  }, [reduced, fine]);

  // Scroll flags: is-scrolled, hdr-hidden (down past 120px hides; any upward scroll shows).
  useEffect(() => {
    const d = document.documentElement;
    let lastY = window.scrollY;
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      d.classList.toggle("is-scrolled", y > 8);
      const hide = !reduced && !d.classList.contains("menu-open") && y > 120 && y > lastY + 2;
      if (hide) d.classList.add("hdr-hidden");
      else if (y < lastY - 2 || y <= 120) d.classList.remove("hdr-hidden");
      lastY = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      d.classList.remove("hdr-hidden");
    };
  }, [reduced]);

  // Lenis + ticker, only when motion is allowed. Loaded with import() after first paint (it is not needed to
  // render or for the CSS entrances), so it stays off the critical path; scrollTo falls back to native until then.
  useEffect(() => {
    if (reduced || coarse) return;
    let alive = true;
    let cleanup = () => {};
    const boot = () =>
      import("lenis").then(({ default: L }) => {
        if (!alive) return;
        const lenis = new L({ duration: 1.1, easing: expoOut, anchors: false });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        cleanup = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
        };
      });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => (w.requestIdleCallback ? w.requestIdleCallback(boot, { timeout: 1200 }) : window.setTimeout(boot, 200));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      alive = false;
      window.removeEventListener("load", start);
      cleanup();
    };
  }, [reduced, coarse]);

  // One-time: refresh after fonts + load; pause ambient work when hidden; delegated in-page anchors.
  useEffect(() => {
    const d = document.documentElement;
    // ScrollTrigger refreshes itself on `load` (autoRefreshEvents): only fonts that settle after load need another
    // pass. Each refresh re-measures every trigger, so the first load gets one, not three.
    document.fonts?.ready
      .then(() => {
        if (document.readyState === "complete") ScrollTrigger.refresh();
      })
      .catch(() => {});
    const vis = () => d.classList.toggle("is-hidden", document.hidden);
    document.addEventListener("visibilitychange", vis);
    // M8: the Ink button's Flag circle grows from where the pointer entered.
    const over = (e: PointerEvent) => {
      const b = (e.target as Element | null)?.closest?.(".btn-ink") as HTMLElement | null;
      if (!b || (e.relatedTarget instanceof Node && b.contains(e.relatedTarget))) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--mx", `${e.clientX - r.left}px`);
      b.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointerover", over, { passive: true });
    // Capture phase: runs before next/link's React onClick (which preventDefaults every same-origin click and
    // would otherwise skip this), so same-page hash links (header "PlayHQ" on /) also move focus to the section.
    // next/link bails out on defaultPrevented, so it does not navigate on top of this.
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const el = resolve(url.hash);
      if (!el) return;
      e.preventDefault();
      // Shareable/bookmarkable sections: the skip link replaces, real section links push.
      if (location.hash !== url.hash) history[url.hash === "#main" ? "replaceState" : "pushState"](history.state, "", url.hash);
      // From the open menu: its close (same click, React commit) un-inerts #main and restarts Lenis, and Lenis'
      // restart stops any scroll in flight. Scroll two frames later, once the page is live again.
      if (d.classList.contains("menu-open")) {
        requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(el, { focus: true })));
        return;
      }
      scrollTo(el, { focus: true });
    };
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click, true);
    };
  }, [scrollTo]);

  // Back/forward runs no view transition, so it must not get the red edge sweep (data-vt) either.
  const popped = useRef(false);
  useEffect(() => {
    const pop = () => (popped.current = true);
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  // Route change, in the commit (so the flags are in the view transition's new snapshot).
  const lastPath = useRef(pathname);
  const lastPop = useRef(false);
  const vtTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(vtTimer.current), []);
  useLayoutEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const wasPop = popped.current;
    popped.current = false;
    lastPop.current = wasPop;
    const d = document.documentElement;
    // §3.5: separate from the head script's no-intro; declared after it in globals.css, so it wins.
    d.classList.add("navigated");
    d.classList.remove("hdr-hidden");
    if (reduced || wasPop) return;
    d.setAttribute("data-vt", "");
    // One timer at a time: a second fast navigation must not have the first timer cut its sweep short.
    window.clearTimeout(vtTimer.current);
    vtTimer.current = window.setTimeout(() => d.removeAttribute("data-vt"), 760);
  }, [pathname, reduced]);

  // Route change, after paint: reset scroll (or go to hash), then refresh triggers.
  useEffect(() => {
    const wasFirst = first.current;
    first.current = false;
    const hash = window.location.hash;
    if (hash) {
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        // Lenis caches the scroll limit: from a short page it still holds the old height and would clamp.
        lenisRef.current?.resize();
        const el = resolve(hash);
        if (!el || typeof el === "number") return;
        scrollTo(el, { immediate: true, focus: !wasFirst });
        // One retry if late layout (fonts, images) moved the target off the 96px line.
        r2 = requestAnimationFrame(() => {
          if (Math.abs(el.getBoundingClientRect().top + ANCHOR_OFFSET) > 2) {
            lenisRef.current?.resize();
            scrollTo(el, { immediate: true });
          }
        });
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    if (!wasFirst) {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      // Keyboard users land on the new page's content, not back in the header they clicked from.
      const main = document.getElementById("main");
      if (!lastPop.current && main) focusEl(main);
    }
    // First load before `load`: ScrollTrigger's own load refresh covers it.
    if (wasFirst && document.readyState !== "complete") return;
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(r);
  }, [pathname, scrollTo]);

  const value = useMemo<MotionContext>(
    () => ({
      reduced,
      fine,
      lenis: () => lenisRef.current,
      scrollTo,
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [reduced, fine, scrollTo],
  );

  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>;
}
