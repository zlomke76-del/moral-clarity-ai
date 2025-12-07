// app/api/chat/modules/model-router.ts

import OpenAI from "openai";

/**
 * MODEL REGISTRY
 *
 * All three agents (Optimist, Skeptic, Arbiter) currently use OpenAI models.
 * These keys allow future swap-outs (Anthropic, Mistral, local inference, etc.)
 * WITHOUT touching orchestrator.ts.
 */
export const MODELS = {
  OPTIMIST: "gpt-4.1",
  SKEPTIC: "gpt-4.1",
  ARBITER: "gpt-4.1",
  FOUNDER: "gpt-4.1",   // <-- add this
};

/**
 * OpenAI Client
 * (Responses API – required for structured multimodal input blocks)
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * callModel(modelId, inputBlocks)
 *
 * Runs a model via the Responses API with automatic output extraction.
 * No temp/top_p/max_tokens allowed — Responses API controls these internally.
 */
export async function callModel(
  modelId: string,
  inputBlocks: any[]
): Promise<string> {
  try {
    const res = await client.responses.create({
      model: modelId,
      input: inputBlocks,
    });

    return extract(res) ?? "[no output]";
  } catch (err) {
    console.error(`[callModel] failure for ${modelId}:`, err);
    return `[model ${modelId} failed]`;
  }
}

/**
 * extract()
 * Standardized extraction for Responses API return shape.
 */
function extract(res: any): string | null {
  try {
    const block = res.output?.[0];
    if (!block) return null;

    const content = block.content?.[0];
    if (!content) return null;

    return content.text ?? null;
  } catch {
    return null;
  }
}
