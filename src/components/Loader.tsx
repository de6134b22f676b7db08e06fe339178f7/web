import { BRAND } from "./brand.generated";

/**
 * The home loader (DESIGN.md §6.2): a night curtain (`.ldr-sheet`) with the icon tile (blue, white W, navy ball) in
 * the centre. The tile builds, the ball drops into the W, the tile fades and the curtain lifts (440ms) while the hero
 * headline is already rising through it. Pure CSS keyframes gated by `html.intro` (lib/gate.ts), so it never renders
 * for a repeat visit, under reduced motion or without JS; the page under it is complete at first paint and nothing
 * here waits on React. Server component, decorative. 1.1s in all; `.ldr` is display:none at 1120ms whatever happens.
 */
const { d, ball } = BRAND.mark;

export function Loader() {
  return (
    <div className="ldr" aria-hidden="true">
      <div className="ldr-sheet" />
      <div className="ldr-tile">
        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <rect width="256" height="256" rx="48" fill="#0062FF" />
          <g transform="translate(35.84 51.2) scale(1.536)">
            <path fill="#FFFFFF" d={d} />
            <circle className="logo-ball" fill="#00153D" cx={ball.cx} cy={ball.cy} r={ball.r} />
          </g>
        </svg>
      </div>
    </div>
  );
}
