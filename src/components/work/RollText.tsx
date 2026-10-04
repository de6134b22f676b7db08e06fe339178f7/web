"use client";
/**
 * Programmatic text roll (M31 URL bar / NN counter, M32 digit roll). When `value` changes the old text rolls up
 * and out while the new text rises in (CSS keyframes in work.css, gated by html.motion). No effects: the previous
 * value is derived during render. Screen readers get the current value only.
 */
import { useState } from "react";

export function RollText({ value, className = "" }: { value: string; className?: string }) {
  const [state, setState] = useState({ cur: value, prev: null as string | null, n: 0 });
  if (state.cur !== value) setState({ cur: value, prev: state.cur, n: state.n + 1 });
  return (
    <span className={`cs-roll ${className}`}>
      {state.prev !== null ? (
        <span key={`o${state.n}`} data-out="" aria-hidden="true">
          {state.prev}
        </span>
      ) : null}
      <span key={`i${state.n}`} data-in={state.n ? "" : undefined}>
        {state.cur}
      </span>
    </span>
  );
}
