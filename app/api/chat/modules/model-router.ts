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
 * Unified model runner using the new Responses API.
 * Always returns a proper async stream compatible with route.ts
 */
export async function runModel(messages: any[], signal?: AbortSignal) {
  try {
    return client.responses.create(
      {
        model: DEFAULT_MODEL,
        temperature: TEMPERATURE,
        max_completion_tokens: MAX_TOKENS,
        messages,
        stream: true,
      },
      { signal }
    );
  } catch (err) {
    console.error("[router] Primary model failed:", err);

    return client.responses.create(
      {
        model: FALLBACK_MODEL,
        temperature: TEMPERATURE,
        max_completion_tokens: MAX_TOKENS,
        messages,
        stream: true,
      },
      { signal }
    );
  }
}
