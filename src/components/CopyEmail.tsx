"use client";
/**
 * Email address link (mailto, char-roll) + "Copy email" Flag button (Ink label) + polite status (M29).
 * Copied: the label lifts out and "Copied ✓" rolls in (450ms expo), reverting after 2.2s; status "Email address
 * copied". Clipboard blocked -> execCommand("copy") -> else the address is selected and status says
 * "Press Ctrl+C to copy" (Cmd+C on Apple platforms).
 * `email` comes from the server parent (SITE.email) so the island does not ship the site config.
 */
import { useEffect, useRef, useState } from "react";
import { Roll } from "./Roll";

export type CopyEmailProps = {
  email: string;
  /** "mail": --t-mail display address (contact bands); "ui": 17px. */
  size?: "mail" | "ui";
  /** Button label (default "Copy email"). */
  label?: string;
  /** mailto query; defaults to "?subject=New%20project" (every CTA uses the same subject). Pass "" for none. */
  query?: string;
  className?: string;
};

export function CopyEmail({ email, size = "ui", query = "?subject=New%20project", label = "Copy email", className = "" }: CopyEmailProps) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const [status, setStatus] = useState("");
  const addr = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const [user, domain] = email.split("@");

  function done() {
    setState("copied");
    setStatus("Email address copied");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setState("idle");
      setStatus("");
    }, 2200);
  }

  function legacy(): boolean {
    const ta = document.createElement("textarea");
    ta.value = email;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      return done();
    } catch {
      if (legacy()) return done();
    }
    const sel = window.getSelection();
    if (sel && addr.current) {
      const r = document.createRange();
      r.selectNodeContents(addr.current);
      sel.removeAllRanges();
      sel.addRange(r);
    }
    setStatus(/Mac|iPhone|iPad/.test(navigator.platform) ? "Press Cmd+C to copy" : "Press Ctrl+C to copy");
  }

  return (
    <div className={`copy ${className}`}>
      <a ref={addr} href={`mailto:${email}${query}`} className={`copy-addr ${size === "mail" ? "t-mail" : "is-ui"}`} data-cursor="Copy">
        <Roll text={`${user}@${domain}`} />
      </a>
      <button type="button" className="btn btn-flag copy-btn" data-state={state} onClick={copy} aria-label={`${label}: ${email}`}>
        <span className="copy-lbl" aria-hidden="true">
          <span data-k="idle">{label}</span>
          <span data-k="copied">Copied ✓</span>
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr">
        {status}
      </span>
    </div>
  );
}
