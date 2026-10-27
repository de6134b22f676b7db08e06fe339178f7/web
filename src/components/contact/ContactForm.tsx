"use client";
/**
 * Contact form. Label above, hairline fields, plain-voice errors under the field (aria-describedby + aria-invalid),
 * focus to the first invalid field on submit. Posts JSON to /api/contact (Postmark, see api/contact.mjs).
 * If the request fails the form says so and points at the email address; nothing is lost (the fields stay filled).
 * Hidden honeypot field `website` and `startedAt` (time on form) are bot checks the endpoint enforces.
 */
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/Button";

const TYPES = ["Club website", "Club app", "Local business website", "Design or brand", "Something else"] as const;
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
const ORDER: Field[] = ["name", "email", "message"];

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Add your name.";
  if (!v.email.trim()) e.email = "Add an email so we can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "That email doesn’t look right.";
  if (v.message.trim().length < 10) e.message = "Tell us a little more about what you need.";
  return e;
}

export function ContactForm({ email }: { email: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [startedAt] = useState(() => Date.now());
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);

  const clear = (k: Field) => {
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state === "sending") return;
    const d = new FormData(form.current!);
    const g = (k: string) => String(d.get(k) ?? "");
    const values = { name: g("name"), email: g("email"), message: g("message") };
    const e = validate(values);
    setErrors(e);
    const first = ORDER.find((k) => e[k]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setState("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, type: g("type"), website: g("website"), startedAt }),
      });
      if (r.ok) {
        setState("sent");
        requestAnimationFrame(() => done.current?.focus());
        return;
      }
      if (r.status === 422) {
        const body = (await r.json().catch(() => null)) as { fields?: Errors } | null;
        if (body?.fields) setErrors(body.fields);
      }
    } catch {
      /* network error: fall through to the failed state */
    }
    setState("failed");
  }

  if (state === "sent") {
    return (
      <div ref={done} tabIndex={-1} role="status" className="cf-done">
        <p className="mono cf-done-k">Sent</p>
        <p className="cf-done-h">Message sent. We’ll reply by email.</p>
      </div>
    );
  }

  const field = (k: Field, label: string, input: ReactNode) => (
    <div className="cf-field">
      <label htmlFor={`cf-${k}`}>{label}</label>
      {input}
      {errors[k] ? (
        <p id={`cf-${k}-err`} className="cf-err">
          {errors[k]}
        </p>
      ) : null}
    </div>
  );
  const a11y = (k: Field) => ({
    id: `cf-${k}`,
    name: k,
    "aria-required": true as const,
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `cf-${k}-err` : undefined,
    onInput: () => clear(k),
  });
  const missing = ORDER.filter((k) => errors[k]).length;

  return (
    <form ref={form} className="cf" noValidate onSubmit={onSubmit}>
      {field("name", "Name", <input {...a11y("name")} type="text" autoComplete="name" className="cf-input" />)}
      {field("email", "Email", <input {...a11y("email")} type="email" autoComplete="email" inputMode="email" className="cf-input" />)}
      <div className="cf-field">
        <label htmlFor="cf-type">What do you need?</label>
        <select id="cf-type" name="type" className="cf-input" defaultValue="">
          <option value="">Choose one</option>
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      {field("message", "Tell us more", <textarea {...a11y("message")} rows={6} className="cf-input" />)}
      <div className="cf-hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="cf-foot">
        <Button type="submit" arrow="↗" disabled={state === "sending"} aria-busy={state === "sending" || undefined}>
          {state === "sending" ? "Sending" : "Send message"}
        </Button>
        <p className="cf-status" role="status" aria-live="polite">
          {missing ? `${missing} ${missing === 1 ? "field needs" : "fields need"} attention.` : null}
          {state === "failed" ? (
            <>
              {" "}
              That didn’t send. Please write to <a href={`mailto:${email}`}>{email}</a>.
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
