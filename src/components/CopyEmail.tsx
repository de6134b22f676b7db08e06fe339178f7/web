"use client";
/**
 * Email address (mailto) + a Copy control + polite status (DESIGN.md §5). Clipboard blocked -> execCommand("copy")
 * -> else the address is selected and the status says "Press Ctrl+C to copy" (Cmd+C on Apple).
 * `variant`: "text" (default, the footer) is a mono "Copy" word; "icon" (/contact) is a 44x44 button holding a 16px
 * copy glyph on the same line as the address, with a mono "Copied" replacing the glyph for 1.5s.
 * `email` comes from the server parent (SITE.email) so the island does not ship the site config.
 */
import { useEffect, useRef, useState } from "react";

export type CopyEmailProps = {
  email: string;
  /** mailto query; defaults to "?subject=New%20project". Pass "" for none. */
  query?: string;
  className?: string;
  variant?: "text" | "icon";
};

function CopyGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
    </svg>
  );
}

export function CopyEmail({ email, query = "?subject=New%20project", className = "", variant = "text" }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const addr = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function done() {
    setCopied(true);
    setStatus("Email address copied");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        setCopied(false);
        setStatus("");
      },
      variant === "icon" ? 1500 : 2200,
    );
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
      const range = document.createRange();
      range.selectNodeContents(addr.current);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setStatus(/Mac|iPhone|iPad/.test(navigator.platform) ? "Press Cmd+C to copy" : "Press Ctrl+C to copy");
  }

  const icon = variant === "icon";
  return (
    <div className={`copy ${icon ? "copy-icon" : ""} ${className}`.replace(/\s+/g, " ").trim()}>
      <a ref={addr} href={`mailto:${email}${query}`} className="copy-addr">
        {email}
      </a>
      <button
        type="button"
        className="copy-btn"
        onClick={copy}
        data-copied={copied ? "1" : undefined}
        aria-label={copied ? `Copied email address ${email}` : `Copy email address ${email}`}
      >
        {icon ? copied ? "Copied" : <CopyGlyph /> : copied ? "Copied" : "Copy"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  );
}
