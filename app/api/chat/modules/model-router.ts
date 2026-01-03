//--------------------------------------------------------------
// MODEL ROUTER — RESPONSES API (STRICT STRING MODE)
// SERVERLESS-SAFE: HARD TIMEOUT + ABORT
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

// -------------------------------------------------------------
// CONFIG
// -------------------------------------------------------------
const MODEL_TIMEOUT_MS = 25_000; // < Vercel hard wall

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

//--------------------------------------------------------------
// callModel(model, promptString)
// - ALWAYS returns a string
// - NEVER streams
// - NEVER hangs
//--------------------------------------------------------------
export async function callModel(
  model: string,
  prompt: string
): Promise<string> {
  const clean = sanitizeForModel(String(prompt || ""));

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, MODEL_TIMEOUT_MS);

  try {
    const res = await client.responses.create(
      {
        model,
        input: clean, // STRICT STRING MODE
      },
      {
        signal: controller.signal,
      }
    );

    // Responses API guarantees string | null
    if (typeof res.output_text === "string") {
      return res.output_text;
    }

    return "";

  } catch (err: any) {
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
