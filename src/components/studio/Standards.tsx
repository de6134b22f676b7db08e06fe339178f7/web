/**
 * Standards (§6.4 ST3): four cells, each led by a specimen stage (the top of the cell, white, hairline) whose
 * aria-hidden specimen, drawn in code and set large, acts the
 * standard out on hover/focus-within (pure CSS, studio.css): a focus ring settling around "Aa", a load
 * waterfall racing in, a dot travelling the site's own expo curve, and an admin switch flipping on.
 * Reduced motion and touch: the specimens rest in their end state.
 */
export type Standard = { title: string; text: string };

const FIGS = [
  // 01 Accessible by default: "Aa" tile, the 2px Ink ring at a 2px offset, the Flag focus notch.
  <svg key="a11y" viewBox="0 0 96 64" className="sd-fig sd-a11y">
    <rect className="sd-ring" x="25" y="9" width="46" height="46" rx="5" />
    <rect className="sd-tile" x="29" y="13" width="38" height="38" rx="3" />
    <text className="sd-aa" x="48" y="39" textAnchor="middle">Aa</text>
    <polygon className="sd-notch" points="63,7 73,7 73,17" />
  </svg>,
  // 02 Fast on real phones: a request waterfall that lands early.
  <svg key="fast" viewBox="0 0 96 64" className="sd-fig sd-fast">
    <line className="sd-axis" x1="8" y1="56" x2="88" y2="56" />
    <rect className="sd-bar" style={{ "--b": 0 } as React.CSSProperties} x="8" y="12" width="34" height="7" rx="1" />
    <rect className="sd-bar" style={{ "--b": 1 } as React.CSSProperties} x="20" y="24" width="22" height="7" rx="1" />
    <rect className="sd-bar" style={{ "--b": 2 } as React.CSSProperties} x="26" y="36" width="16" height="7" rx="1" />
    <line className="sd-done" x1="44" y1="6" x2="44" y2="56" />
  </svg>,
  // 03 Motion with a reason: the house curve, cubic-bezier(.16,1,.3,1), with a dot riding it.
  <svg key="motion" viewBox="0 0 96 64" className="sd-fig sd-motion">
    <path className="sd-grid" d="M12 56H84M12 8V56" />
    <path className="sd-curve" d="M12 56 C23.5 8 33.6 8 84 8" pathLength={1} />
    <circle className="sd-dot" r="3.4" />
  </svg>,
  // 04 Run by you: an admin toggle that switches on.
  <svg key="run" viewBox="0 0 96 64" className="sd-fig sd-run">
    <rect className="sd-track" x="26" y="20" width="44" height="24" rx="12" />
    <circle className="sd-knob" cx="38" cy="32" r="8" />
  </svg>,
];

export function Standards({ items }: { items: readonly Standard[] }) {
  return (
    <ol className="sd">
      {items.map((s, i) => (
        <li key={s.title} className="sd-cell">
          <div className="sd-stage">
            <span className="mono sd-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="sd-figwrap" aria-hidden="true">
              {FIGS[i]}
            </span>
          </div>
          <h3 className="t-h3 sd-t">{s.title}</h3>
          <p className="sd-x">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
