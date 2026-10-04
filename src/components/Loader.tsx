/**
 * Signature loader (DESIGN.md v4 §3). Server component, rendered in layout.tsx before <Header>, outside the
 * MotionProvider: React is never involved. Pure CSS keyframes from first paint (globals.css "LOADER"):
 *   120 flag in · 220 pennant unfurls · 560 lockup slides left while "websport" slides out of the mask that
 *   starts at the flag's right edge · 1100 ".com.au" wipes on (sibling outside the mask) · hold ·
 *   1560 sheet lifts on a 9vw slant with a constant --band red edge · 2200 visibility:hidden (always, no JS).
 * Repeat visits: html.no-intro (head script) => display:none. Reduced motion: static lockup, 300ms fade at .6s.
 */
import { Mark } from "./Mark";
import { Wordmark, wordmarkBox } from "./Wordmark";

const word = wordmarkBox("word");
const tld = wordmarkBox("tld");

export function Loader() {
  return (
    <div
      className="ld"
      aria-hidden="true"
      style={{ "--ww": (word.w / word.h).toFixed(4), "--tw": (tld.w / tld.h).toFixed(4) } as React.CSSProperties}
    >
      <div className="ld-sheet">
        <div className="ld-white">
          <div className="ld-out">
            <div className="ld-lockup">
              <Mark className="ld-flag" />
              <span className="ld-mask">
                <Wordmark part="word" className="ld-word" decorative />
              </span>
              <Wordmark part="tld" className="ld-tld" decorative />
            </div>
          </div>
          <span className="ld-skip">
            <span className="ld-skip-f">Click or press any key to skip</span>
            <span className="ld-skip-t">Tap to skip</span>
          </span>
        </div>
      </div>
    </div>
  );
}
