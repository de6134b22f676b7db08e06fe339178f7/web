"use client";
/**
 * 04 The full kit (M22). One model at every width: rows 07–12 are `button[aria-expanded]` accordions, one open at
 * a time (the first starts open). The panel opens inline (grid rows 0fr → 1fr, 500ms expo): the description under
 * the title and, beside it (below it under 1024), a small working mock-up of that part of the site, filled with
 * labelled sample text. Closed panels are `inert` + visibility:hidden, so screen readers and Tab skip them.
 * Fine pointer: the hovered title glides 600 → 720 and nudges right while the other titles dim; the "+" turns.
 * Nothing floats over the list (W5/W14).
 */
import { useState } from "react";
import { Tag } from "@/components/Tag";
import { KIT } from "./data";

function Demo({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <div className="kd kd-story">
          <span className="mono kd-k">Story · Members</span>
          <b className="kd-h">Why we kept coming back</b>
          <p className="kd-p">Three seasons in, Thursday training is still the best hour of my week. Nobody asked what I could do. They asked if I could stay for the barbecue.</p>
          <span className="kd-foot mono">
            <i className="kd-dot" /> Reviewed by committee · Published
          </span>
        </div>
      );
    case 1:
      return (
        <div className="kd">
          <span className="mono kd-k">Admin · Committee</span>
          <ul className="kd-rows">
            {[
              ["Events", "2 drafts · 1 live"],
              ["Notices", "4 live"],
              ["Players", "86 profiles"],
              ["Documents", "12 files"],
            ].map(([a, b]) => (
              <li key={a}>
                <b>{a}</b>
                <span className="mono">{b}</span>
              </li>
            ))}
          </ul>
          <span className="kd-btn">
            <i className="kd-sync" aria-hidden="true" /> Resync PlayHQ
          </span>
        </div>
      );
    case 2:
      return (
        <div className="kd">
          <span className="mono kd-k">Sponsors · Season 2026</span>
          {[
            ["Gold", ["Harbour Hardware", "Northside Bakery"]],
            ["Silver", ["Coastline Physio", "Ridge Plumbing", "The Corner Café"]],
          ].map(([tier, names]) => (
            <div key={tier as string} className="kd-tier">
              <span className="mono">{tier as string}</span>
              <span className="kd-chips">
                {(names as string[]).map((n) => (
                  <span key={n} className="kd-chip">
                    {n}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      );
    case 3:
      return (
        <div className="kd">
          <span className="mono kd-k">Documents</span>
          <ul className="kd-rows">
            {[
              ["Constitution", "v4 · Mar 2026"],
              ["Code of conduct", "v2 · Feb 2026"],
              ["AGM minutes", "Aug 2025"],
              ["Child safety policy", "v3 · Jan 2026"],
            ].map(([a, b]) => (
              <li key={a}>
                <b>
                  <i className="kd-file" aria-hidden="true" />
                  {a}
                </b>
                <span className="mono">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 4:
      return (
        <div className="kd">
          <span className="mono kd-k">Gallery · Presentation night</span>
          <span className="kd-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, k) => (
              <i key={k} />
            ))}
          </span>
          <span className="mono kd-meta">48 photos · Season 2026</span>
        </div>
      );
    default:
      return (
        <div className="kd">
          <span className="mono kd-k">Committee & contacts</span>
          <ul className="kd-rows">
            {[
              ["Registrations", "Registrar"],
              ["Coaching", "Head coach"],
              ["Canteen", "Canteen manager"],
              ["Lost property", "Club secretary"],
            ].map(([a, b]) => (
              <li key={a}>
                <b>{a}</b>
                <span className="mono">{b} →</span>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}

export function KitIndex() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="kit">
      <ol className="kit-list">
        {KIT.map((r, i) => {
          const ex = open === i;
          return (
            <li key={r.n} className={`kit-i${ex ? " is-open" : ""}`}>
              <h3 className="kit-h">
                <button type="button" className="kit-row" aria-expanded={ex} aria-controls={`kit-p-${i}`} onClick={() => setOpen(ex ? null : i)}>
                  <span className="mono kit-n">{r.n}</span>
                  <span className="kit-t t-kit wglide">{r.t}</span>
                  <span className="kit-x" aria-hidden="true" />
                </button>
              </h3>
              <div className="kit-p" id={`kit-p-${i}`} inert={!ex}>
                <div className="kit-p-in">
                  <div className="kit-p-grid">
                    <p className="kit-d">{r.d}</p>
                    <div className="kit-demo card">
                      <Tag className="kit-tag" />
                      <Demo i={i} />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
