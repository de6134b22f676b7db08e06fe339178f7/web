"use client";
/**
 * Contact form (DESIGN.md §3.5 fields). Label above, hairline fields, plain-voice errors under the field
 * (aria-describedby + aria-invalid), focus moves to the first invalid field on submit, and a summary line by the
 * button says how many fields need attention.
 *
 * Delivery: the site is a static export, so there is no server route. When NEXT_PUBLIC_CONTACT_ENDPOINT is set
 * (a form service that accepts a JSON POST), the message is posted there and, on a 2xx, the form is replaced in place
 * by "Message sent." with focus moved to it. Without an endpoint (or if the POST fails), the message is handed to the
 * visitor's email app as a pre-filled mailto, and the status says so honestly.
 * Before hydration (JS is deferred until after first paint) the form falls back to a native mailto POST, so a quick
 * submit never puts the visitor's details in a GET query string.
 */
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button, ArrowLink } from "./Button";

type Field = "name" | "email" | "org" | "code" | "need";
type Errors = Partial<Record<Field, string>>;

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
const ORDER: Field[] = ["name", "email", "need"];

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Add your name.";
  if (!v.email.trim()) e.email = "Add an email so we can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "That email doesn’t look right.";
  if (!v.need.trim()) e.need = "Tell us a little about what you need.";
  return e;
}

export function ContactForm({ email, codes }: { email: string; codes: readonly string[] }) {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailto">("idle");
  const done = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

  function values(): Record<Field, string> {
    const d = new FormData(form.current!);
    const g = (k: Field) => String(d.get(k) ?? "");
    return { name: g("name"), email: g("email"), org: g("org"), code: g("code"), need: g("need") };
  }

  function finish(next: "sent" | "mailto") {
    setState(next);
    requestAnimationFrame(() => done.current?.focus());
  }

  /** Clears a field's error as soon as it is edited, so the form never nags about something already fixed. */
  function clear(k: Field) {
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state === "sending") return;
    const v = values();
    const e = validate(v);
    setErrors(e);
    const first = ORDER.find((k) => e[k]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (ENDPOINT) {
      setState("sending");
      try {
        const r = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(v),
        });
        if (r.ok) return finish("sent");
      } catch {
        /* fall through to the email app */
      }
    }
    const head = [`Name: ${v.name}`, `Email: ${v.email}`];
    if (v.org) head.push(`Club or organisation: ${v.org}`);
    if (v.code) head.push(`Code: ${v.code}`);
    const body = `${head.join("\n")}\n\n${v.need}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`New project${v.org ? `: ${v.org}` : ""}`)}&body=${encodeURIComponent(body)}`;
    finish("mailto");
  }

  if (state === "sent" || state === "mailto") {
    return (
      <div ref={done} tabIndex={-1} role="status" className="form-done">
        <p className="kicker">
          <b>{state === "sent" ? "Sent" : "Almost there"}</b>
        </p>
        <p className="h3">{state === "sent" ? "Message sent. We’ll reply by email." : "Your email app should have opened with the message ready to send."}</p>
        {state === "mailto" ? (
          <p className="meta-2">
            If it didn&rsquo;t, write to <a href={`mailto:${email}`}>{email}</a>.
          </p>
        ) : null}
        <div className="actions">
          <ArrowLink href="/work">See the work</ArrowLink>
          <ArrowLink href="/">Back to home</ArrowLink>
        </div>
      </div>
    );
  }

  const field = (k: Field, label: string, input: ReactNode) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      {input}
      {errors[k] ? (
        <p id={`f-${k}-err`} className="field-err">
          {errors[k]}
        </p>
      ) : null}
    </div>
  );
  const a11y = (k: Field) => ({
    "aria-required": ORDER.includes(k) || undefined,
    id: `f-${k}`,
    name: k,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `f-${k}-err` : undefined,
    onInput: () => clear(k),
  });
  const missing = ORDER.filter((k) => errors[k]).length;

  return (
    <form ref={form} className="form" method="post" action={`mailto:${email}`} encType="text/plain" noValidate onSubmit={onSubmit}>
      {field("name", "Name", <input {...a11y("name")} type="text" autoComplete="name" className="input" />)}
      {field("email", "Email", <input {...a11y("email")} type="email" autoComplete="email" inputMode="email" className="input" />)}
      {field("org", "Club or organisation (optional)", <input {...a11y("org")} type="text" autoComplete="organization" className="input" />)}
      {field(
        "code",
        "Code (optional)",
        <select {...a11y("code")} className="input" defaultValue="">
          <option value="">Choose one</option>
          {codes.map((c) => (
            <option key={c}>{c}</option>
          ))}
          <option>Something else</option>
        </select>,
      )}
      {field(
        "need",
        "What do you need?",
        <textarea {...a11y("need")} rows={6} className="input" />,
      )}
      <div className="form-foot">
        <Button type="submit" disabled={state === "sending"} aria-busy={state === "sending" || undefined}>
          {state === "sending" ? "Sending" : "Send message"}
        </Button>
        {missing ? (
          <p className="form-err" role="alert">
            {missing === 1 ? "One field needs a look." : `${missing} fields need a look.`}
          </p>
        ) : ENDPOINT ? null : (
          <p className="meta">Opens in your email app with the message filled in.</p>
        )}
      </div>
    </form>
  );
}
