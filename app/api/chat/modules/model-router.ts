// modules/model-router.ts

import { OpenAI } from "openai";
import {
  DEFAULT_MODEL,
  FALLBACK_MODEL,
  TEMPERATURE,
  MAX_TOKENS,
} from "./constants";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function runModel(messages: any[], signal?: AbortSignal) {
  try {
    // Responses API does NOT support:
    // - temperature
    // - max_tokens
    // - max_completion_tokens (unless using generation)
    // - top_p
    // - frequency_penalty
    // - presence_penalty
    //
    // Instead, you provide:
    //   model
    //   input: messages[]
    //   stream: true

    return await client.responses.create(
      {
        model: DEFAULT_MODEL,
        input: messages,
        stream: true,
      },
      { signal }
    );
  } catch (err) {
    console.error("[router] Primary model failed:", err);

    return await client.responses.create(
      {
        model: FALLBACK_MODEL,
        input: messages,
        stream: true,
      },
      { signal }
    );
  }
}

