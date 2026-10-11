// Serves the static Astro build and handles the contact form and Ask AI
// endpoints. Everything except those routes is answered by the assets
// binding before this Worker runs (see `run_worker_first` in wrangler.jsonc).

import { type AskEnv, handleAsk } from "./ask";
import {
  CONTACT_INQUIRY_TYPES,
  CONTACT_NETWORK_SIZES,
  CONTACT_LIMITS,
  type ContactPayload,
} from "../src/lib/contact";

interface Env extends AskEnv {
  ASSETS: Fetcher;
  EMAIL: SendEmail;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_FROM: string;
  CONTACT_TO: string;
}

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    if (url.pathname === "/api/ask") return handleAsk(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405, {
      Allow: "POST",
    });
  }

  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: "Cross-origin request rejected." }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const parsed = parsePayload(body);
  if (!parsed.ok) return json(parsed, 400);
  const { data, token } = parsed;

  const verified = await verifyTurnstile(
    token,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get("CF-Connecting-IP"),
  );
  if (!verified) {
    return json(
      { ok: false, error: "We couldn't verify you're human. Please retry." },
      403,
    );
  }

  const inquiry = CONTACT_INQUIRY_TYPES.find((t) => t.value === data.inquiry)!;
  const subject = `[${inquiry.label}] ${data.name}${
    data.organization ? ` — ${data.organization}` : ""
  }`;
  const rows: Array<[string, string]> = [
    ["Inquiry", inquiry.label],
    ["Name", data.name],
    ["Email", data.email],
    ["Organization", data.organization || "—"],
    ["Network size", data.networkSize || "—"],
  ];

  try {
    await env.EMAIL.send({
      from: { email: env.CONTACT_FROM, name: "Elivate Wallet website" },
      to: env.CONTACT_TO,
      replyTo: { email: data.email, name: data.name },
      subject,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.message}\n`,
      html: renderHtml(rows, data.message),
    });
  } catch (error) {
    console.error("contact: send failed", error);
    return json(
      {
        ok: false,
        error: `Something went wrong sending your message. Please email ${env.CONTACT_TO} directly.`,
      },
      502,
    );
  }

  return json({ ok: true }, 200);
}

type ParseResult =
  | { ok: true; data: ContactPayload; token: string }
  | { ok: false; error: string };

function parsePayload(body: unknown): ParseResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }
  const raw = body as Record<string, unknown>;
  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  // Single-line fields end up in the subject header; collapse any line breaks.
  const line = (key: string) => str(key).replace(/[\r\n\t]+/g, " ");

  const data: ContactPayload = {
    inquiry: line("inquiry") as ContactPayload["inquiry"],
    name: line("name"),
    email: line("email"),
    organization: line("organization"),
    networkSize: line("networkSize"),
    message: str("message"),
  };
  const token = str("turnstileToken");

  if (!CONTACT_INQUIRY_TYPES.some((t) => t.value === data.inquiry)) {
    return { ok: false, error: "Choose what you're contacting us about." };
  }
  if (!data.name || data.name.length > CONTACT_LIMITS.name) {
    return { ok: false, error: "Enter your name." };
  }
  if (
    !EMAIL_PATTERN.test(data.email) ||
    data.email.length > CONTACT_LIMITS.email
  ) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (data.organization.length > CONTACT_LIMITS.organization) {
    return { ok: false, error: "Organization name is too long." };
  }
  if (
    data.networkSize &&
    !(CONTACT_NETWORK_SIZES as readonly string[]).includes(data.networkSize)
  ) {
    return { ok: false, error: "Choose a network size from the list." };
  }
  if (!data.message || data.message.length > CONTACT_LIMITS.message) {
    return {
      ok: false,
      error: `Enter a message under ${CONTACT_LIMITS.message} characters.`,
    };
  }
  if (!token) {
    return { ok: false, error: "Complete the verification check." };
  }
  return { ok: true, data, token };
}

async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string | null,
): Promise<boolean> {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: form,
    });
    const outcome = (await res.json()) as { success: boolean };
    return outcome.success === true;
  } catch (error) {
    console.error("contact: turnstile verification failed", error);
    return false;
  }
}

function renderHtml(rows: Array<[string, string]>, message: string): string {
  const cells = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  return `<table style="font:14px/1.5 sans-serif;border-collapse:collapse">${cells}</table><p style="font:14px/1.6 sans-serif;white-space:pre-wrap">${escapeHtml(message)}</p>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function json(
  payload: unknown,
  status: number,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}
