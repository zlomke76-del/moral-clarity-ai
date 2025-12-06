// modules/model-router.ts

import OpenAI from "openai";
import { DEFAULT_MODEL, FALLBACK_MODEL } from "./constants";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Routes to primary model, then falls back if needed.
 * Fully compatible with the Responses API.
 */
export async function runModel(inputBlocks: any[]) {
  try {
    // --- Primary model call ------------------------------------
    const primary = await client.responses.create({
      model: DEFAULT_MODEL,  // "gpt-5" or whatever you set
      input: inputBlocks,
    });

    return primary.output_text?.[0] ?? "[no reply]";
  } catch (err) {
    console.error("[router] Primary model failed:", err);

    // --- Fallback to mini-model -------------------------------
    try {
      const fallback = await client.responses.create({
        model: FALLBACK_MODEL, // "gpt-4.1-mini"
        input: inputBlocks,
      });

      return fallback.output_text?.[0] ?? "[no reply]";
    } catch (err2) {
      console.error("[router] Fallback model also failed:", err2);
      return "[router failure]";
    }
  }
}

