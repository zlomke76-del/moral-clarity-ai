// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// MODEL ROUTER — FINAL, OPENAI RESPONSES API
// --------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel, sanitizeForClient } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// -----------------------------
// callModel(model, prompt)
// -----------------------------
export async function callModel(model: string, prompt: string) {
  // STRICT sanitizer only for outbound request → LLM
  const cleanPrompt = sanitizeForModel(prompt);

  try {
    const response = await client.responses.create({
      model,
      input: cleanPrompt,
      // reasoning.effort removed
    });

    // unified field in Responses API
    let text = response.output_text ?? "";

    // IMPORTANT:
    // Convert model output into fully safe UI text
    text = sanitizeForClient(text);

    return typeof text === "string" ? text : String(text);

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
