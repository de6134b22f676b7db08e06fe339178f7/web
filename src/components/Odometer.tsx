/**
 * Odometer (M17/M19/M21): each digit is a 0–9 column translated to the digit (800ms expo, 40ms per digit).
 * Server-safe and SSR-correct (the columns sit at their values in the HTML, so no-JS is right). When `value`
 * changes, CSS transitions roll the columns; a change in length re-keys the columns (they appear in place).
 * Screen readers get the visually-hidden value. `animate={false}` disables the roll.
 */
export function Odometer({ value, className = "", animate = true }: { value: string | number; className?: string; animate?: boolean }) {
  const str = String(value);
  let k = 0;
  return (
    <span className={`odo${animate ? "" : " is-static"} ${className}`.trim()}>
      <span className="sr">{str}</span>
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {Array.from(str).map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={`${str.length}-${i}`} className="odo-d">
              <span className="odo-col" style={{ "--n": +ch, "--k": k++ } as React.CSSProperties}>
                {DIGITS}
              </span>
            </span>
          ) : (
            <span key={`${str.length}-${i}`}>{ch}</span>
          ),
        )}
      </span>
    </span>
  );
}

const DIGITS = Array.from({ length: 10 }, (_, d) => <span key={d}>{d}</span>);
