"use client";
/**
 * Segmented control (C7). role "tablist" (view switches; pass `controls` = tabpanel id) or "radiogroup" (choices).
 * Sliding indicator (CSS vars --x/--w, 550ms expo), arrow keys + Home/End with roving tabindex, selection
 * follows focus. Before hydration the selected button paints its own background (no indicator jump).
 * tone "ink" (inside plates: Ink indicator, white label; automatic inside `.plate`) or default (white indicator).
 */
import { useLayoutEffect, useRef, type KeyboardEvent } from "react";

export type SegOption<T extends string> = { value: T; label: string };
export type SegmentedProps<T extends string> = {
  options: readonly SegOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  role?: "tablist" | "radiogroup";
  /** tablist: id of the controlled tabpanel. */
  controls?: string;
  /** id prefix for the tab buttons (tabpanel aria-labelledby = `${idBase}-${value}`). */
  idBase?: string;
  tone?: "ink" | "default";
  className?: string;
};

export function Segmented<T extends string>({ options, value, onChange, label, role = "tablist", controls, idBase, tone = "default", className = "" }: SegmentedProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const tab = role === "tablist";

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const place = () => {
      const b = root.querySelector<HTMLElement>(`[data-v="${CSS.escape(value)}"]`);
      if (!b) return;
      root.style.setProperty("--x", `${b.offsetLeft}px`);
      root.style.setProperty("--w", `${b.offsetWidth}px`);
      root.classList.add("is-ready");
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    return () => ro.disconnect();
  }, [value]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = options.findIndex((o) => o.value === value);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % options.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + options.length) % options.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = options.length - 1;
    if (n < 0) return;
    e.preventDefault();
    onChange(options[n].value);
    requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>(`[data-v="${CSS.escape(options[n].value)}"]`)?.focus());
  };

  return (
    <div ref={ref} className={`seg${tone === "ink" ? " seg-ink" : ""} ${className}`.trim()} role={role} aria-label={label}>
      <span className="seg-ind" aria-hidden="true" />
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            id={idBase ? `${idBase}-${o.value}` : undefined}
            className="seg-btn"
            data-v={o.value}
            role={tab ? "tab" : "radio"}
            aria-selected={tab ? on : undefined}
            aria-checked={tab ? undefined : on}
            aria-controls={tab ? controls : undefined}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={onKey}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
