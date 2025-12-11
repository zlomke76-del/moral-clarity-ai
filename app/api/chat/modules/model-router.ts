// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// MODEL ROUTER — FINAL, OPENAI RESPONSES API
// --------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// -----------------------------
// callModel(model, prompt)
// -----------------------------
export async function callModel(model: string, prompt: string) {
  const cleanPrompt = sanitizeForModel(prompt);

  try {
    const response = await client.responses.create({
      model,
      input: cleanPrompt,
      // removed: reasoning.effort (not supported)
    });

    const text = response.output_text ?? "";
    return typeof text === "string" ? text : String(text);

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
