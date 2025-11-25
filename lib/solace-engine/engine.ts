// lib/solace-engine/engine.ts
import OpenAI from "openai";

/* ============================================================
   ENVIRONMENT
   ============================================================ */
const SOLACE_URL = process.env.SOLACE_API_URL || "";
const SOLACE_KEY = process.env.SOLACE_API_KEY || "";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

if (!OPENAI_KEY) {
  console.warn("[solace-engine] OPENAI_API_KEY missing");
}

/* ============================================================
   CLIENTS
   ============================================================ */
const openai = OPENAI_KEY
  ? new OpenAI({ apiKey: OPENAI_KEY })
  : null;

/* ============================================================
   HELPERS
   ============================================================ */
export function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Request timed out")), ms);
    p.then(v => { clearTimeout(id); resolve(v); })
     .catch(err => { clearTimeout(id); reject(err); });
  });
}

/* ============================================================
   SOLACE ENGINE (Primary)
   ============================================================ */
export async function solaceNonStream(payload: any): Promise<string> {
  if (!SOLACE_URL || !SOLACE_KEY) {
    throw new Error("Solace backend not configured");
  }

  const r = await fetch(SOLACE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SOLACE_KEY}`,
    },
    body: JSON.stringify({ ...payload, stream: false }),
  });

  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Solace ${r.status}: ${text}`);
  }

  const ct = r.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await r.json().catch(() => ({}));
    return (
      String(j.text ?? j.output ?? j.data ?? "") ||
      ""
    );
  } else {
    return await r.text();
  }
}

export async function solaceStream(payload: any): Promise<ReadableStream<Uint8Array>> {
  if (!SOLACE_URL || !SOLACE_KEY) {
    throw new Error("Solace backend not configured");
  }

  const r = await fetch(SOLACE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SOLACE_KEY}`,
    },
    body: JSON.stringify({ ...payload, stream: true }),
  });

  if (!r.ok || !r.body) {
    const text = await r.text().catch(() => "");
    throw new Error(`Solace ${r.status}: ${text}`);
  }

  return r.body as ReadableStream<Uint8Array>;
}

/* ============================================================
   OPENAI FALLBACK ENGINE
   ============================================================ */
export async function openaiNonStream({
  system,
  messages,
  max_output_tokens,
  temperature = 0.2,
  model = DEFAULT_MODEL,
}: {
  system: string;
  messages: Array<{ role: string; content: string }>;
  max_output_tokens: number;
  temperature?: number;
  model?: string;
}): Promise<string> {
  if (!openai) throw new Error("OpenAI client not available");

  const resp = await openai.responses.create({
    model,
    temperature,
    max_output_tokens,
    input:
      system +
      "\n\n" +
      messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
  });

  return (resp as any).output_text?.trim() || "[No reply from model]";
}

export async function openaiStream({
  system,
  messages,
  temperature = 0.2,
  model = DEFAULT_MODEL,
}: {
  system: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  model?: string;
}): Promise<Response> {
  if (!OPENAI_KEY) throw new Error("Missing OPENAI_API_KEY");

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      stream: true,
      temperature,
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ],
    }),
  });

  if (!r.ok || !r.body) {
    const t = await r.text().catch(() => "");
    throw new Error(`OpenAI SSE error: ${r.status} ${t}`);
  }

  return r;
}

/* ============================================================
   AUTONOMOUS ROUTER
   ============================================================ */
export async function generateWithSolaceOrOpenAI({
  payload,
  stream = false,
  isFounder = false,
  fallback = true,
  max_output_tokens = 1000,
  timeoutMs = 20000,
}: {
  payload: any;
  stream?: boolean;
  isFounder?: boolean;
  fallback?: boolean;
  max_output_tokens?: number;
  timeoutMs?: number;
}) {
  const useSolace = Boolean(SOLACE_URL && SOLACE_KEY) && !isFounder;

  // STREAM MODE
  if (stream) {
    if (useSolace) {
      try {
        return await withTimeout(solaceStream(payload), timeoutMs);
      } catch (err) {
        if (!fallback) throw err;
      }
    }

    return await withTimeout(openaiStream(payload), timeoutMs);
  }

  // NON-STREAM MODE
  if (useSolace) {
    try {
      return await withTimeout(solaceNonStream(payload), timeoutMs);
    } catch (err) {
      if (!fallback) throw err;
    }
  }

  return await withTimeout(
    openaiNonStream({
      system: payload.system,
      messages: payload.messages,
      temperature: payload.temperature ?? 0.2,
      max_output_tokens,
    }),
    timeoutMs
  );
}

/* ============================================================
   EXPORT API
   ============================================================ */
export const SolaceEngine = {
  solaceNonStream,
  solaceStream,
  openaiNonStream,
  openaiStream,
  generate: generateWithSolaceOrOpenAI,
};
