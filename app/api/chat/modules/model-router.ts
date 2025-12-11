//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (FINAL, STRICTLY VALID)
// Accepts:
//   1) a string
//   2) an array of strings
//   3) an array of { role, text } → converted to strings
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// normalize input for Responses API
// --------------------------------------------------------------
function normalizeInput(input: any): string | string[] {
  // case 1: simple string
  if (typeof input === "string") {
    return sanitizeForModel(input);
  }

  // case 2: array of strings
  if (Array.isArray(input) && typeof input[0] === "string") {
    return input.map((s) => sanitizeForModel(s));
  }

  // case 3: array of { role, text }
  if (Array.isArray(input) && typeof input[0] === "object") {
    return input.map((msg) =>
      sanitizeForModel(`[${msg.role.toUpperCase()}]\n${msg.text}`)
    );
  }

  // fallback
  return sanitizeForModel(String(input));
}

// --------------------------------------------------------------
// callModel(model, promptOrMessages)
// --------------------------------------------------------------
export async function callModel(model: string, prompt: any) {
  try {
    const cleanInput = normalizeInput(prompt);

    const res = await client.responses.create({
      model,
      input: cleanInput,     // ← ALWAYS valid for Responses API
    });

    return typeof res.output_text === "string"
      ? res.output_text
      : String(res.output_text ?? "");

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
