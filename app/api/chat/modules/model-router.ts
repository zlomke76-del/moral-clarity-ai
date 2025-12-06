// modules/model-router.ts

import OpenAI from "openai";
import {
  DEFAULT_MODEL,
  FALLBACK_MODEL,
  TEMPERATURE,
  MAX_TOKENS,
} from "./constants";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Runs the OpenAI Responses API and returns plain text.
 */
export async function runModel(inputBlocks: any[]) {
  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: inputBlocks,
      max_output_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    // Response API returns text inside outputs[0].content[0].text
    const out = response.output_text || "";
    return out.trim();

  } catch (err) {
    console.error("[router] Primary model failed:", err);

    // ---- fallback model
    const fallback = await client.responses.create({
      model: FALLBACK_MODEL,
      input: inputBlocks,
      max_output_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    return fallback.output_text || "";
  }
}

