//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (HYBRID MODE)
// Accepts either:
//   1) string prompt
//   2) array of { role, text } messages
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Normalize input to OpenAI Responses API format
function buildInput(input: string | any[]) {
  if (typeof input === "string") {
    return sanitizeForModel(input);
  }

  // structured message array
  if (Array.isArray(input)) {
    return input.map((m) => ({
      role: m.role,
      content: [{ type: "input_text", text: sanitizeForModel(m.text) }],
    }));
  }

  return "Unsupported input";
}

// --------------------------------------------------------------
// callModel(model, promptOrMessages)
// --------------------------------------------------------------
export async function callModel(model: string, prompt: any) {
  try {
    const formatted = buildInput(prompt);

    const res = await client.responses.create({
      model,
      input: formatted,
    });

    const out = res.output_text ?? "";
    return typeof out === "string" ? out : String(out);

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
