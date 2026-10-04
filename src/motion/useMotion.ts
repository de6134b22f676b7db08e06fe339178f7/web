"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
import type Lenis from "lenis";

export type ScrollTarget = string | HTMLElement | number;
export type ScrollOpts = { immediate?: boolean; offset?: number; focus?: boolean };

export type MotionContext = {
  /** prefers-reduced-motion: reduce. SSR + first hydration render: true (nothing motion-only differs in HTML). */
  reduced: boolean;
  /** (pointer: fine). SSR: false. */
  fine: boolean;
  /** Current Lenis instance (null in reduced motion / before mount). A getter, so reading it never re-renders. */
  lenis: () => Lenis | null;
  /** Smooth (Lenis, 1.1s expo-out) or native scroll to a target; optional focus with preventScroll. */
  scrollTo: (target: ScrollTarget, opts?: ScrollOpts) => void;
  /** Lenis stop/start (menu). No-ops without Lenis. */
  stop: () => void;
  start: () => void;
};

const noop = () => {};
export const MotionCtx = createContext<MotionContext>({
  reduced: true,
  fine: false,
  lenis: () => null,
  scrollTo: noop,
  stop: noop,
  start: noop,
});

/** { reduced, fine, lenis, scrollTo, stop, start } from the nearest MotionProvider. */
export function useMotion(): MotionContext {
  return useContext(MotionCtx);
}

/** Subscribe to a media query without setState-in-effect. `server` is the SSR/hydration value. */
export function useMediaQuery(query: string, server: boolean): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}
