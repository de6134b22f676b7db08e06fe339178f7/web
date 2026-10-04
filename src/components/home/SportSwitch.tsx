"use client";
/**
 * Sticky sport control above the plates (M24): "Kit in:" + a radiogroup of sports with a sliding indicator
 * (550ms) + "Sample data". A full-bleed sticky band under the header (top 68px, 0 while the header is hidden);
 * a horizontal scroll row under 760 with edge fades where more chips sit off-screen; a change centres the chip.
 */
import { useEffect, useRef } from "react";
import { Segmented } from "@/components/Segmented";
import { Tag } from "@/components/Tag";
import { KIT_CHIPS } from "./data";
import { useKit } from "./SportContext";

export function SportSwitch() {
  const { sport, setSport } = useKit();
  const scroller = useRef<HTMLDivElement>(null);
  // Horizontal only (never scrollIntoView, which would also move the page). Not on mount: the row loads at its
  // start (AFL first); a change centres the chosen chip.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const sc = scroller.current;
    const b = sc?.querySelector<HTMLElement>(`[data-v="${CSS.escape(sport)}"]`);
    if (!sc || !b || sc.scrollWidth <= sc.clientWidth) return;
    sc.scrollTo({ left: b.offsetLeft - (sc.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
  }, [sport]);
  // Edge fades only where there is more row to see (left fade once scrolled, right fade until the end).
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = sc.scrollWidth - sc.clientWidth;
      sc.classList.toggle("is-l", sc.scrollLeft > 2);
      sc.classList.toggle("is-r", max > 2 && sc.scrollLeft < max - 2);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    sc.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      sc.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div className="kit-sw">
      <div className="kit-sw-in">
        <span className="mono kit-sw-k" aria-hidden="true">
          Kit in:
        </span>
        <div ref={scroller} className="kit-sw-scroll">
          <Segmented options={KIT_CHIPS} value={sport} onChange={setSport} label="Show the kit in" role="radiogroup" />
        </div>
        <Tag />
      </div>
    </div>
  );
}
