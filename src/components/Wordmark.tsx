/**
 * Wordmark (DESIGN.md v4 §2.2): outlined Sora 800 paths, never a font. Server-safe (no hooks).
 * part "full" = websport.com.au · "word" = websport · "tld" = .com.au
 * Every part shares one vertical box (WM.top/WM.height, ascender to the "p" descender), so two parts set at the
 * same CSS height keep a common baseline (the loader relies on this). Width follows from the viewBox: set a
 * height (or width) in CSS and leave the other `auto`.
 * Colours: websport = currentColor, .com.au = var(--flag).
 * `glyphs` wraps every glyph in <g class="wm-g" style="--gi:i"> (footer M27); glyphs have transform-box fill-box.
 */
import { WM, type WmPart } from "./wordmark.generated";

export type WordmarkPart = "full" | "word" | "tld";
export type WordmarkProps = {
  part?: WordmarkPart;
  glyphs?: boolean;
  className?: string;
  /** Decorative (next to visible text, or a duplicate). Default: role="img" with an aria-label. */
  decorative?: boolean;
  style?: React.CSSProperties;
};

const LABEL: Record<WordmarkPart, string> = { full: "websport.com.au", word: "websport", tld: ".com.au" };

function Glyphs({ part, glyphs, fill, offset }: { part: WmPart; glyphs: boolean; fill: string; offset: number }) {
  if (!glyphs) return <path d={part.glyphs.map((g) => g.d).join("")} fill={fill} />;
  return (
    <>
      {part.glyphs.map((g, i) =>
        g.d ? (
          <g key={i} className="wm-g" style={{ "--gi": i + offset } as React.CSSProperties}>
            <path d={g.d} fill={fill} />
          </g>
        ) : null,
      )}
    </>
  );
}

/** viewBox per part (exported for layout maths: aspect = w / h). */
export function wordmarkBox(part: WordmarkPart) {
  const x0 = part === "tld" ? WM.tld.x0 : WM.word.x0;
  const x1 = part === "word" ? WM.word.x1 : WM.tld.x1;
  return { x: x0, y: WM.top, w: +(x1 - x0).toFixed(2), h: WM.height };
}

export function Wordmark({ part = "full", glyphs = false, className, decorative = false, style }: WordmarkProps) {
  const b = wordmarkBox(part);
  return (
    <svg
      viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
      className={className}
      style={style}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : LABEL[part]}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      overflow="visible"
    >
      {part !== "tld" ? <Glyphs part={WM.word} glyphs={glyphs} fill="currentColor" offset={0} /> : null}
      {part !== "word" ? <Glyphs part={WM.tld} glyphs={glyphs} fill="var(--flag, #E8442B)" offset={WM.word.glyphs.length} /> : null}
    </svg>
  );
}
