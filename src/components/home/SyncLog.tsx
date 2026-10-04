"use client";
/**
 * Sync log (M25) on the Ink stage. The sample sync runs once by itself when the log is 50% in view (like the
 * logos plate), streaming sample log lines, 380ms per line (fx-in 500ms expo); the last line is in the on-ink
 * red. "Run again" replays it. The button is busy ("Syncing…", aria-busy) while streaming.
 * The log is a polite live region. Reduced motion: all lines at once. Sample run.
 */
import { useEffect, useRef, useState } from "react";
import { Tag } from "@/components/Tag";
import { Button } from "@/components/Button";
import { SYNC_LOG, SYNC_STEP_S } from "./data";
import { prefersReduced } from "./useSkin";

export function SyncLog() {
  const [lines, setLines] = useState<{ t: string; at: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [ran, setRan] = useState(false);
  const timers = useRef<number[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setRan(true);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLines([]);
    setBusy(true);
    const rm = prefersReduced();
    const stamp = (i: number) => `00:00:${(i * SYNC_STEP_S).toFixed(1).padStart(4, "0")}`;
    SYNC_LOG.forEach((t, i) => {
      timers.current.push(window.setTimeout(() => setLines((ls) => [...ls, { t, at: stamp(i) }]), rm ? 0 : 200 + i * 380));
    });
    timers.current.push(
      window.setTimeout(() => {
        busyRef.current = false;
        setBusy(false);
      }, rm ? 0 : 200 + SYNC_LOG.length * 380),
    );
  };

  // Auto-run once at 50% visibility.
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        runRef.current();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="slog is-ink">
      <div className="slog-hd">
        <span className="mono">Sync log</span>
        <Tag>Sample run</Tag>
      </div>
      <ol className="slog-list" aria-live="polite" aria-label="Sync log">
        {lines.length === 0 ? (
          <li className="slog-idle">Waiting for PlayHQ…</li>
        ) : (
          lines.map((l, i) => (
            <li key={i} className={i === SYNC_LOG.length - 1 ? "is-done" : undefined}>
              <time aria-hidden="true">{l.at}</time>
              <span>{l.t}</span>
              {i < SYNC_LOG.length - 1 ? (
                <span className="slog-ok" aria-hidden="true">
                  ok
                </span>
              ) : null}
            </li>
          ))
        )}
      </ol>
      <div className="slog-act">
        <Button variant="flag" size="sm" onClick={run} aria-busy={busy}>
          {busy ? "Syncing…" : ran ? "Run again" : "Run a sync"}
        </Button>
      </div>
    </div>
  );
}
