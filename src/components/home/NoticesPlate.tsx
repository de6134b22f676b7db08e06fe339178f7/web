"use client";
/**
 * P5 Announcements (M20). Ink pinned banner, four notices, "Post a notice" (cycles five samples: the new item
 * drops in from the top, 700ms expo, while the others FLIP down, 650ms hand). Pin swaps the notice into the banner
 * (250ms crossfade; the pin icon turns 45°) and the old pinned notice takes its place. Dismiss (button, or on
 * touch a swipe left past 96px; below that it springs back) with a 4s Undo toast. Overflow goes to the archive
 * line. Live region announces new, pinned and dismissed notices. Sample data.
 */
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPE } from "react";
import { Plate } from "@/components/Plate";
import { Button } from "@/components/Button";
import { measure, play, type Rects } from "@/lib/flip";
import { ARCHIVE_BASE, NOTICES, NOTICE_QUEUE, PINNED, type Notice } from "./data";
import { useKit } from "./SportContext";
import { useSkin } from "./useSkin";

const PinIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M9.5 1.5l5 5-2 .5-3 3 .5 3.5-1.5 1.5-3-3-3.5 3.5-.5-.5L5 11.5l-3-3L3.5 7 7 7.5l3-3z" fill="currentColor" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function NoticesPlate() {
  const { bump } = useKit();
  const cell = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const before = useRef<Rects | null>(null);
  useSkin(cell, bump, 4);
  const [items, setItems] = useState<Notice[]>(NOTICES);
  const [pinned, setPinned] = useState({ text: PINNED, n: 0 });
  const [archive, setArchive] = useState(ARCHIVE_BASE);
  const [q, setQ] = useState(0);
  const [ver, setVer] = useState(0);
  const [live, setLive] = useState("");
  const [undo, setUndo] = useState<{ item: Notice; index: number } | null>(null);
  const undoT = useRef(0);
  const swipeT = useRef(0);
  useEffect(() => {
    const u = undoT;
    const sw = swipeT;
    return () => {
      window.clearTimeout(u.current);
      window.clearTimeout(sw.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!before.current || !list.current) return;
    play(list.current, "[data-flip]", before.current, { duration: 650 });
    before.current = null;
  }, [ver]);
  const snap = () => {
    if (list.current) before.current = measure(list.current, "[data-flip]");
  };

  const post = () => {
    snap();
    const src = NOTICE_QUEUE[q % NOTICE_QUEUE.length];
    const item: Notice = { ...src, id: `p${q}`, time: "Just now", fresh: true };
    const next = [item, ...items.map((i) => ({ ...i, fresh: false }))];
    if (next.length > 4) setArchive((a) => a + next.length - 4);
    setItems(next.slice(0, 4));
    setQ(q + 1);
    setVer((v) => v + 1);
    setLive(`New notice: ${src.text}`);
  };

  const pin = (it: Notice) => {
    const old = pinned.text;
    setPinned((p) => ({ text: it.text, n: p.n + 1 }));
    setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, id: `${x.id}-s`, text: old, tag: "Club", fresh: false } : x)));
    setLive(`Pinned: ${it.text}`);
  };

  const dismiss = (it: Notice) => {
    snap();
    const index = items.findIndex((x) => x.id === it.id);
    setItems((xs) => xs.filter((x) => x.id !== it.id));
    setVer((v) => v + 1);
    setUndo({ item: it, index });
    setLive(`Notice dismissed. Undo available.`);
    window.clearTimeout(undoT.current);
    undoT.current = window.setTimeout(() => setUndo(null), 4000);
  };
  const restore = () => {
    if (!undo) return;
    snap();
    setItems((xs) => {
      const n = [...xs];
      n.splice(undo.index, 0, { ...undo.item, fresh: false });
      return n.slice(0, 4);
    });
    setVer((v) => v + 1);
    setUndo(null);
    setLive("Notice restored.");
  };

  // Touch swipe-to-dismiss (2.5.7: the Dismiss button is the single-pointer alternative).
  const drag = useRef<{ id: string; x0: number; dx: number; el: HTMLElement } | null>(null);
  const down = (e: RPE<HTMLLIElement>, it: Notice) => {
    if (e.pointerType !== "touch" || (e.target as Element).closest("button")) return;
    drag.current = { id: it.id, x0: e.clientX, dx: 0, el: e.currentTarget };
  };
  const move = (e: RPE<HTMLLIElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dx = Math.min(0, e.clientX - d.x0);
    d.el.style.transform = `translateX(${d.dx}px)`;
    d.el.style.transition = "none";
  };
  const up = (it: Notice) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    d.el.style.transition = "transform .5s cubic-bezier(.16,1,.3,1)";
    if (d.dx < -96) {
      d.el.style.transform = "translateX(-110%)";
      window.clearTimeout(swipeT.current);
      swipeT.current = window.setTimeout(() => {
        d.el.style.transform = "";
        d.el.style.transition = "";
        dismiss(it);
      }, 220);
    } else d.el.style.transform = "";
  };

  return (
    <div ref={cell} className="pl-cell pl-ann">
      <Plate n={5} id="p-ann" title="Announcements" cursor="Post" decision="Post once. It shows up everywhere it should, from the home page banner to the archive.">
        <div className="ann-banner is-ink">
          <span className="ann-pin-k mono">Pinned</span>
          <p key={pinned.n} className="ann-pinned">
            {pinned.text}
          </p>
        </div>
        <div className="card ann">
          <ul ref={list} className="ann-list">
            {items.map((it) => (
              <li
                key={it.id}
                data-flip={it.id}
                className={`an${it.fresh ? " fresh" : ""}`}
                onPointerDown={(e) => down(e, it)}
                onPointerMove={move}
                onPointerUp={() => up(it)}
                onPointerCancel={() => up(it)}
              >
                <span className="an-tag mono">{it.tag}</span>
                <span className="an-t">{it.text}</span>
                <span className="an-r">
                  <time className="mono">{it.time}</time>
                  <button type="button" className="an-b an-pin" aria-label={`Pin notice: ${it.text}`} onClick={() => pin(it)}>
                    <PinIcon />
                  </button>
                  <button type="button" className="an-b" aria-label={`Dismiss notice: ${it.text}`} onClick={() => dismiss(it)}>
                    <XIcon />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p className="ann-arch mono muted">Archive: {archive} notices</p>
        </div>
        <div className="plate-act ann-act">
          <Button variant="ink" size="sm" onClick={post} arrow="↓">
            Post a notice
          </Button>
          <div className={`ann-undo${undo ? " is-on" : ""}`} aria-hidden={!undo}>
            <span className="mono">Notice dismissed</span>
            <button type="button" className="ann-undo-b" onClick={restore} tabIndex={undo ? 0 : -1}>
              Undo
            </button>
          </div>
        </div>
        <p className="sr" aria-live="polite">
          {live}
        </p>
      </Plate>
    </div>
  );
}
