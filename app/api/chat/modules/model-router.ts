//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (FINAL VALID VERSION)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// normalizeInput(prompt): ALWAYS produce valid ResponseInput
// --------------------------------------------------------------
function normalizeInput(prompt: any) {
  // CASE 1: simple string
  if (typeof prompt === "string") {
    return sanitizeForModel(prompt);
  }

  // CASE 2: array of strings
  if (Array.isArray(prompt) && prompt.every((p) => typeof p === "string")) {
    return prompt.map((p) => sanitizeForModel(p));
  }

  // CASE 3: array of objects with { role, content }
  if (
    Array.isArray(prompt) &&
    prompt.every((p) => typeof p === "object" && p.role && p.content)
  ) {
    return prompt.map((msg) => ({
      role: msg.role,
      content: sanitizeForModel(
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content)
      ),
    }));
  }

  // FALLBACK: stringify anything else
  return sanitizeForModel(String(prompt));
}

// --------------------------------------------------------------
// callModel(model, prompt)
// --------------------------------------------------------------
export async function callModel(model: string, prompt: any) {
  try {
    const cleanInput = normalizeInput(prompt);

    const res = await client.responses.create({
      model,
      input: cleanInput, // MUST be string or valid message block
    });

    return typeof res.output_text === "string"
      ? res.output_text
      : String(res.output_text ?? "");

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
