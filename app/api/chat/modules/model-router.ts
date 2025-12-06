// modules/model-router.ts

import { OpenAI } from "openai";
import {
  DEFAULT_MODEL,
  FALLBACK_MODEL,
  TEMPERATURE,
  MAX_TOKENS,
} from "./constants";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Runs a model using the new Responses API (streaming).
 * Ensures correct types and full compatibility with Edge runtime.
 */
export async function runModel(messages: any[], signal?: AbortSignal) {
  try {
    return await client.responses.stream(
      {
        model: DEFAULT_MODEL,
        input: messages,                // NEW REQUIRED FIELD
        temperature: TEMPERATURE,
        max_output_tokens: MAX_TOKENS,  // NEW FIELD (REPLACES max_tokens)
      },
      { signal }
    );
  } catch (err) {
    console.error("[router] Primary model failed:", err);

    return await client.responses.stream(
      {
        model: FALLBACK_MODEL,
        input: messages,
        temperature: TEMPERATURE,
        max_output_tokens: MAX_TOKENS,
      },
      { signal }
    );
  }
}
