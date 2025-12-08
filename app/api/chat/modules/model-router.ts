// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// Multi-model router for Solace Hybrid Pipeline
// Supports OpenAI models today + placeholder-ready architecture
// --------------------------------------------------------------

import OpenAI from "openai";
import { DEFAULT_MODEL, FALLBACK_MODEL } from "../../constants";

// ALL active models are OpenAI today — clean and unified
export const MODELS = {
  OPTIMIST: DEFAULT_MODEL,
  SKEPTIC: DEFAULT_MODEL,
  ARBITER: DEFAULT_MODEL,
  FOUNDER: DEFAULT_MODEL,
} as const;

export type SolaceModel = string;

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * callModel()
 * Unified wrapper for OpenAI Responses API
 * - model: string (e.g. "gpt-4.1")
 * - inputBlocks: array of structured blocks
 */
export async function callModel(model: SolaceModel, inputBlocks: any[]) {
  try {
    // Primary model call
    const response = await client.responses.create({
      model,
      input: inputBlocks,
    });

    return extract(response);

  } catch (err) {
    console.error("[callModel] Primary model failed:", err);

    // Fallback model call
    try {
      const fallbackResponse = await client.responses.create({
        model: FALLBACK_MODEL,
        input: inputBlocks,
      });

      return extract(fallbackResponse);
    } catch (err2) {
      console.error("[callModel] Fallback model also failed:", err2);
      return "[Model failure]";
    }
  }
}

/**
 * extract()
 * Safely extracts text output from OpenAI Responses API
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


