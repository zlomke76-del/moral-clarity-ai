// app/api/chat/modules/model-router.ts
// -------------------------------------------------------------
// MODEL ROUTER — Solace Multi-Agent Pipeline
// (All OpenAI today; plug-in ready for other LLMs)
// -------------------------------------------------------------

import OpenAI from "openai";

// -------------------------------------------------------------
// OPENAI CLIENT (Edge compatible)
// -------------------------------------------------------------
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// -------------------------------------------------------------
// MODEL MAP (swap these later per domain if needed)
// -------------------------------------------------------------
export const MODELS = {
  OPTIMIST: "gpt-4.1",
  SKEPTIC: "gpt-4.1",
  ARBITER: "gpt-4.1",
  FOUNDER: "gpt-4.1", // can later use o3-mini-highconf or a custom LLM
} as const;

export type SolaceModelKey = keyof typeof MODELS;

// -------------------------------------------------------------
// RESPONSE EXTRACTOR — consistent for all LLM calls
// -------------------------------------------------------------
export function extractText(res: any): string {
  try {
    const block = res?.output?.[0];
    const content = block?.content?.[0];
    return content?.text || "";
  } catch {
    return "";
  }
}

// -------------------------------------------------------------
// callModel() — unified wrapper
// Handles:
// • Responses API calls
// • Error logging
// • Clean extraction
// -------------------------------------------------------------
export async function callModel(
  modelKey: SolaceModelKey,
  promptBlocks: any[]
): Promise<string> {
  const model = MODELS[modelKey];

  try {
    const response = await openai.responses.create({
      model,
      input: promptBlocks,
    });

    return extractText(response) || "[empty reply]";
  } catch (err: any) {
    console.error(`[Solace ModelRouter] ${modelKey} failed:`, err);
    return `[${modelKey} error]`;
  }
}

// -------------------------------------------------------------
// FUTURE: LLM OVERRIDES (Anthropic / Gemini / Custom models)
// (Not active today — documented placeholders)
// -------------------------------------------------------------
export function canUseExternalLLM(): boolean {
  // you’ll enable this once we add provider-level switches
  return false;
}

export async function callExternalLLM(): Promise<string> {
  // stub — no-op today
  return "[external LLM not enabled]";
}


