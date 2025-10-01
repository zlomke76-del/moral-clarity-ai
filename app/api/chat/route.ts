// app/api/chat/route.ts
import OpenAI from "openai";
import { z } from "zod";

/** ──────────────────────────────────────────────────────────────────────────
 *  ENV & CLIENT
 *  ────────────────────────────────────────────────────────────────────────── */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // will throw in dev if missing
});

// Primary model (fast & cheap); allow override via env
const PRIMARY_MODEL =
  (process.env.OPENAI_MODEL && process.env.OPENAI_MODEL.trim()) || "gpt-5-nano";

// Fallback if provider returns "does not exist" or similar
const FALLBACK_MODEL = "gpt-5-mini";

// Allow a single origin or a comma-separated list via env
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ??
  "https://www.moralclarityai.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** Build CORS headers for a particular request origin. */
function corsFor(origin: string | null) {
  // If request origin matches one of our allowed origins, reflect it.
  // Otherwise, don’t set ACAO (browser will block).
  const allowed =
    origin && ALLOWED_ORIGINS.some((o) => o.toLowerCase() === origin.toLowerCase());
  const base: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
  if (allowed) base["Access-Control-Allow-Origin"] = origin!;
  return base;
}

/** ──────────────────────────────────────────────────────────────────────────
 *  REQUEST SCHEMA
 *  ────────────────────────────────────────────────────────────────────────── */
const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      })
    )
    .min(1, "messages must include at least one item"),
  mode: z.enum(["guidance", "redteam", "news"]).default("guidance"),
});

/** ──────────────────────────────────────────────────────────────────────────
 *  SYSTEM POLICY (no Ask Abe, neutral tone, etc.)
 *  ────────────────────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `
You are MoralClarityAI — neutral, precise, and transparent.
• Provide clear, sourced guidance when relevant.
• Avoid ideological drift and avoid introducing “Ask Abe” or any branding that was removed.
• Where claims may be contested, present multiple perspectives and note uncertainty.
• Be concise; cite or quote only when needed. No hallucinations.
`;

/** ──────────────────────────────────────────────────────────────────────────
 *  UTIL: call OpenAI with fallback when model id is invalid/unavailable
 *  ────────────────────────────────────────────────────────────────────────── */
async function callOpenAI(input: any) {
  try {
    return await client.responses.create({
      model: PRIMARY_MODEL,
      input,
    });
  } catch (err: any) {
    const msg = (err?.message || "").toLowerCase();
    const isBadModel =
      err?.status === 400 &&
      (msg.includes("does not exist") ||
        msg.includes("unknown model") ||
        msg.includes("invalid") ||
        msg.includes("unsupported"));

    if (isBadModel) {
      // Retry once with fallback
      return await client.responses.create({
        model: FALLBACK_MODEL,
        input,
      });
    }
    throw err;
  }
}

/** Extract plain text from Responses API result. */
function extractText(resp: any): string {
  if (resp?.output_text) return String(resp.output_text);
  // Some SDK versions return a structured "output"
  if (Array.isArray(resp?.output)) {
    try {
      return resp.output
        .map((p: any) =>
          Array.isArray(p?.content)
            ? p.content.map((c: any) => c?.text?.value ?? "").join("")
            : ""
        )
        .join("\n")
        .trim();
    } catch {}
  }
  return "";
}

/** ──────────────────────────────────────────────────────────────────────────
 *  OPTIONS (CORS preflight)
 *  ────────────────────────────────────────────────────────────────────────── */
export function OPTIONS(req: Request) {
  const origin = req.headers.get("Origin");
  return new Response(null, {
    headers: corsFor(origin),
  });
}

/** ──────────────────────────────────────────────────────────────────────────
 *  POST /api/chat
 *  ────────────────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  const origin = req.headers.get("Origin");

  try {
    const json = await req.json();
    const { messages, mode } = Body.parse(json);

    const modeLine =
      mode === "redteam"
        ? "Mode: Red-team — surface risks, incentives, and failure modes neutrally."
        : mode === "news"
        ? "Mode: News clarity — summarize neutrally with dates and sources when appropriate."
        : "Mode: Guidance — offer principled, neutral answers.";

    const response = await callOpenAI([
      { role: "system", content: `${SYSTEM_PROMPT}\n${modeLine}` },
      ...messages,
    ]);

    const text = extractText(response) || "Sorry, I couldn’t find an answer.";

    return new Response(JSON.stringify({ text, model: response?.model }), {
      headers: {
        "Content-Type": "application/json",
        ...corsFor(origin),
      },
      status: 200,
    });
  } catch (err: any) {
    const status =
      typeof err?.status === "number"
        ? err.status
        : err?.name === "ZodError"
        ? 400
        : 500;

    const message =
      err?.name === "ZodError"
        ? "Invalid request body. Expected { messages: [{role, content}], mode? }"
        : err?.message || "Internal error";

    return new Response(
      JSON.stringify({
        error: String(message),
        status,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsFor(origin),
        },
        status,
      }
    );
  }
}
