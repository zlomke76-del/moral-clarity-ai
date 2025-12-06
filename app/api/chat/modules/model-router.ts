// modules/model-router.ts

import { OpenAI } from "openai";
import {
  DEFAULT_MODEL,
  FALLBACK_MODEL,
  TEMPERATURE,
  MAX_TOKENS,
} from "./constants";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// GPT-4.1 supports temperature, GPT-5 currently may not.
function supportsTemperature(model: string) {
  return model.startsWith("gpt-4") || model.includes("4.1");
}

export async function runModel(input: any[], signal?: AbortSignal) {
  const primaryModel = DEFAULT_MODEL;
  const fallbackModel = FALLBACK_MODEL;

  try {
    const params: any = {
      model: primaryModel,
      input,
      max_output_tokens: MAX_TOKENS,
    };

    if (supportsTemperature(primaryModel)) {
      params.temperature = TEMPERATURE;
    }

    // *** IMPORTANT: use .stream() NOT .create()
    return await client.responses.stream(params, { signal });

  } catch (err) {
    console.error("[router] Primary model failed:", err);

    const backup: any = {
      model: fallbackModel,
      input,
      max_output_tokens: MAX_TOKENS,
    };

    if (supportsTemperature(fallbackModel)) {
      backup.temperature = TEMPERATURE;
    }

    return await client.responses.stream(backup, { signal });
  }
}

