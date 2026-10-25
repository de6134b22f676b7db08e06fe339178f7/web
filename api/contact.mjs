/**
 * Contact form endpoint. Deployed as a Vercel Function (POST /api/contact) next to the static export; the site's
 * contact form posts here. Sends each enquiry to the studio inboxes through Postmark's transactional stream, one
 * message per recipient (/email/batch), so one rejected recipient never blocks the other.
 *
 * Env: POSTMARK_SERVER_TOKEN (required), CONTACT_TO (comma separated, optional), CONTACT_FROM (optional).
 * CONTACT_FROM must be a confirmed Postmark sender signature (nilesh@sherlabs.com is).
 */

const PROJECT_TYPES = ["Club website", "Club app", "Design or brand", "Something else"];
const MIN_FILL_MS = 2500;
const LIMITS = { name: 120, email: 254, message: 5000 };
const DEFAULT_TO = "Sales@websport.com.au,nilesh@sherlabs.com";

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const clean = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function POST(request) {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) return json(500, { error: "Email is not configured." });

  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  // Bots: filled the hidden field or submitted implausibly fast. Pretend success.
  const startedAt = typeof data.startedAt === "number" ? data.startedAt : 0;
  if (clean(data.website, 200) || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return json(200, { ok: true });
  }

  const name = clean(data.name, LIMITS.name).replace(/[\r\n]+/g, " ");
  const email = clean(data.email, LIMITS.email);
  const message = clean(data.message, LIMITS.message);
  const type = PROJECT_TYPES.find((t) => t === data.type) ?? "Not specified";

  const errors = {};
  if (!name) errors.name = "Add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter a valid email address.";
  if (message.length < 10) errors.message = "Tell us a little more about what you need.";
  if (Object.keys(errors).length) return json(422, { error: "Check the highlighted fields.", fields: errors });

  const recipients = (process.env.CONTACT_TO || DEFAULT_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM || "nilesh@sherlabs.com";

  const textBody = `New enquiry from websport.com.au\n\nName: ${name}\nEmail: ${email}\nProject: ${type}\n\n${message}\n`;
  const htmlBody = `<div style="font-family:-apple-system,Segoe UI,sans-serif;color:#00204e;line-height:1.55;max-width:560px">
<p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#556079;margin:0 0 16px">New enquiry · websport.com.au</p>
<table style="border-collapse:collapse;font-size:14px;margin-bottom:20px">
<tr><td style="padding:4px 16px 4px 0;color:#556079">Name</td><td>${escapeHtml(name)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#556079">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#0050d4">${escapeHtml(email)}</a></td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#556079">Project</td><td>${escapeHtml(type)}</td></tr>
</table>
<div style="border-top:1px solid #e5e5e5;padding-top:16px;font-size:15px;white-space:pre-wrap">${escapeHtml(message)}</div>
</div>`;

  const res = await fetch("https://api.postmarkapp.com/email/batch", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", "X-Postmark-Server-Token": token },
    body: JSON.stringify(
      recipients.map((to) => ({
        From: `Websport Website <${from}>`,
        To: to,
        ReplyTo: `${name} <${email}>`,
        Subject: `New enquiry: ${type} — ${name}`,
        TextBody: textBody,
        HtmlBody: htmlBody,
        MessageStream: "outbound",
        Tag: "websport-contact",
      })),
    ),
  });

  const results = await res.json().catch(() => null);
  const sent = Array.isArray(results) ? results.filter((r) => r.ErrorCode === 0).length : 0;
  if (!res.ok || sent === 0) {
    console.error("[contact] Postmark error", res.status, results);
    return json(502, { error: "We couldn’t send that just now. Please email us directly." });
  }
  if (sent < recipients.length) console.error("[contact] some recipients failed", results);

  return json(200, { ok: true });
}
