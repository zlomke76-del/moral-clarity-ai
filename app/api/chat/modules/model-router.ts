// app/api/chat/modules/model-router.ts

import OpenAI from "openai";
import { DEFAULT_MODEL, FALLBACK_MODEL } from "./constants";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * runModel()
 * - Primary → fallback
 * - No temperature / top_p / max_tokens (not allowed in Responses API)
 * - Extracts output_text cleanly and safely
 */
export async function runModel(inputBlocks: any[]) {
  try {
    // Primary model
    const primary = await client.responses.create({
      model: DEFAULT_MODEL,
      input: inputBlocks,
    });

    const out1 = extract(primary);
    if (out1) return out1;
  } catch (err) {
    console.error("[router] primary model failed:", err);
  }

  // Fallback
  try {
    const fallback = await client.responses.create({
      model: FALLBACK_MODEL,
      input: inputBlocks,
    });

    const out2 = extract(fallback);
    if (out2) return out2;

    return "[no reply]";
  } catch (err2) {
    console.error("[router] fallback model failed:", err2);
    return "[router failure]";
  }
}

/**
 * extract()
 * Correctly extracts output_text from a Responses API result.
 */
function extract(res: any): string | null {
  try {
    if (!res) return null;

    // Canonical extraction for Responses API:
    // res.output is an array of
    //   { content: [ { type:text, text:"..." } ] }
    const block = res.output?.[0];
    if (!block) return null;

    const content = block.content?.[0];
    if (!content) return null;

    return content.text ?? null;
  } catch {
    return null;
  }
}

