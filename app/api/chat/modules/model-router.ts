//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (HARDENED)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// Allowed + Fallback Models
// --------------------------------------------------------------
const VALID_MODELS = new Set([
  "gpt-5.1",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4o",         // optional
  "gpt-4o-mini",    // optional
]);

const DEFAULT_MODEL = "gpt-4.1-mini";

// --------------------------------------------------------------
// Resolve Model With Safety
// --------------------------------------------------------------
function resolveModel(requested: string): string {
  if (VALID_MODELS.has(requested)) return requested;

  console.error(
    `[MODEL ROUTER] Invalid model requested: "${requested}". Using fallback: "${DEFAULT_MODEL}".`
  );

  return DEFAULT_MODEL;
}

// --------------------------------------------------------------
// callModel(model, prompt)
// --------------------------------------------------------------
export async function callModel(model: string, prompt: string) {
  const cleanPrompt = sanitizeForModel(prompt);
  const safeModel = resolveModel(model);

  try {
    const res = await client.responses.create({
      model: safeModel,
      input: cleanPrompt,
    });

    const out = res.output_text ?? "";
    return typeof out === "string" ? out : String(out);

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
