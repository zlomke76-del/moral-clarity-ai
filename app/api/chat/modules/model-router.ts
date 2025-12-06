// app/api/chat/modules/model-router.ts

import { OpenAI } from "openai";
import { DEFAULT_MODEL, FALLBACK_MODEL, MAX_TOKENS } from "./constants";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function runModel(input: any[], signal?: AbortSignal) {
  try {
    return client.responses.stream(
      {
        model: DEFAULT_MODEL,
        input,
        max_output_tokens: MAX_TOKENS,
      },
      { signal }
    );
  } catch (err) {
    console.error("[router] Primary model failed:", err);

    return client.responses.stream(
      {
        model: FALLBACK_MODEL,
        input,
        max_output_tokens: MAX_TOKENS,
      },
      { signal }
    );
  }
}
