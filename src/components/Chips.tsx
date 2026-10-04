"use client";
/**
 * Chips (C8): aria-pressed toggles in a labelled group. 36px visual, 44px hit area.
 * mode "single" (one pressed, e.g. grade filters) or "multi" (meal choices; `check` prefixes "✓ ").
 */
export type ChipOption<T extends string> = { value: T; label: string };
export type ChipsProps<T extends string> = {
  options: readonly ChipOption<T>[];
  value: readonly T[];
  onChange: (next: T[]) => void;
  label: string;
  mode?: "single" | "multi";
  check?: boolean;
  className?: string;
};

export function Chips<T extends string>({ options, value, onChange, label, mode = "single", check = false, className = "" }: ChipsProps<T>) {
  const toggle = (v: T) => {
    if (mode === "single") return onChange([v]);
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };
  return (
    <div className={`chips${check ? " chips-check" : ""} ${className}`.trim()} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={value.includes(o.value)} onClick={() => toggle(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
