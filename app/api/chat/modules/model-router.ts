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
    return await client.chat.completions.create(
      {
        model: DEFAULT_MODEL,
        messages,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        stream: true,
      },
      { signal }
    );
  } catch (err) {
    console.error("[router] Primary model failed:", err);

    return await client.chat.completions.create(
      {
        model: FALLBACK_MODEL,
        messages,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        stream: true,
      },
      { signal }
    );
  }
}
