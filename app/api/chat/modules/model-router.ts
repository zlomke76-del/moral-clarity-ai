//--------------------------------------------------------------
// MODEL ROUTER — RESPONSES API (STRICT STRING MODE)
// SERVERLESS-SAFE: HARD TIMEOUT + ABORT
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

// -------------------------------------------------------------
// CONFIG
// -------------------------------------------------------------
const MODEL_TIMEOUT_MS = 25_000; // MUST be < Vercel 30s soft wall

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// -------------------------------------------------------------
// callModel(model, promptString)
// - ALWAYS returns a string
// - NEVER hangs
// - NEVER streams
// - ABORTS on timeout
// -------------------------------------------------------------
export async function callModel(
  model: string,
  prompt: string
): Promise<string> {
  const clean = sanitizeForModel(String(prompt || ""));

  // -----------------------------------------------------------
  // AbortController for hard timeout
  // -----------------------------------------------------------
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, MODEL_TIMEOUT_MS);

  try {
    const res = await client.responses.create(
      {
        model,
        input: clean, // STRICT STRING MODE ONLY
      },
      {
        signal: controller.signal,
      }
    );

    // ---------------------------------------------------------
    // Normalize output
    // ---------------------------------------------------------
    if (typeof res.output_text === "string") {
      return res.output_text;
    }

    if (Array.isArray(res.output_text)) {
      return res.output_text.join("\n");
    }

    return String(res.output_text ?? "");

  } catch (err: any) {
    // ---------------------------------------------------------
    // Timeout / abort handling
    // ---------------------------------------------------------
    if (err?.name === "AbortError") {
      console.error("[MODEL ROUTER] Model call timed out");
      return "[Model timeout]";
    }

    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";

  } finally {
    clearTimeout(timeout);
  }
}
