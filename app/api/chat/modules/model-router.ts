// --------------------------------------------------------------
// MODEL ROUTER — FINAL, OPENAI RESPONSES API, ASCII-SAFE INPUT
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
  // ALWAYS sanitize before sending to LLM
  const cleanPrompt = sanitizeForModel(prompt);

  try {
    const response = await client.responses.create({
      model,
      input: cleanPrompt,
      reasoning: { effort: "medium" },
    });

    // OpenAI Responses API → unified field
    const text = response.output_text ?? "";

    return typeof text === "string" ? text : String(text);
  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
