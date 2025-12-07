// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// Multi-model router for Solace Hybrid Pipeline
// Supports OpenAI models today + placeholders for future LLMs
// --------------------------------------------------------------

import OpenAI from "openai";

// ALL models are OpenAI today — placeholders allow future expansion
export const MODELS = {
  OPTIMIST: "gpt-4.1",
  SKEPTIC: "gpt-4.1",
  ARBITER: "gpt-4.1",
  FOUNDER: "gpt-4.1"
} as const;

// FIXED: A model is simply a string (OpenAI model name)
export type SolaceModel = string;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

/**
 * callModel()
 * Unified wrapper for OpenAI Responses API
 * Accepts:
 *   - model: string (e.g., "gpt-4.1")
 *   - prompt: inputBlocks array
 */
export async function callModel(model: SolaceModel, inputBlocks: any[]) {
  try {
    const response = await client.responses.create({
      model,
      input: inputBlocks
    });

    return extract(response);
  } catch (err) {
    console.error("[callModel] primary model failed:", err);
    return "[Model failure]";
  }
}

/**
 * extract()
 * Safely extracts output_text from OpenAI Responses API
 */
function extract(res: any): string | null {
  try {
    if (!res) return null;

    // Responses API shape:
    // res.output: [ { content: [ { type: "text", text: "..." } ] } ]
    const block = res.output?.[0];
    if (!block) return null;

    const content = block.content?.[0];
    if (!content) return null;

    return content.text ?? null;
  } catch {
    return null;
  }
}


