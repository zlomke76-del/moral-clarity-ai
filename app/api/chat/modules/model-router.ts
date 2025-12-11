// --------------------------------------------------------------
// MODEL ROUTER — FINAL, OPENAI RESPONSES API, ASCII-SAFE INPUT
// --------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// callModel(model, prompt)
// Clean ASCII input → OpenAI Responses API → output_text
// --------------------------------------------------------------
export async function callModel(model: string, prompt: string) {
  // Always sanitize before sending to LLM
  const cleanPrompt = sanitizeForModel(prompt);

  try {
    const response = await client.responses.create({
      model,
      input: cleanPrompt,
      // IMPORTANT:
      // The new Responses API DOES NOT SUPPORT:
      //   reasoning: { effort: "medium" }
      //   response_format: "json"
      //   temperature/top_p on some models
      //
      // We keep the call minimal & valid.
    });

    // Unified field for output text
    const text = response.output_text ?? "";

    return typeof text === "string" ? text : String(text);
  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
