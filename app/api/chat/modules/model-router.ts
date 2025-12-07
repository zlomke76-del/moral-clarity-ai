// app/api/chat/modules/model-router.ts
// ------------------------------------------------------------
// MODEL ROUTER — MULTI-AGENT PIPELINE SUPPORT
// Optimist | Skeptic | Arbiter | Founder
// OpenAI-only today, extensible for future providers
// ------------------------------------------------------------

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ------------------------------------------------------------
// MODEL MAP
// These keys MUST match orchestrator.ts expectations.
// Later you can plug in Anthropic, Gemini, Groq, etc.
// ------------------------------------------------------------
export const MODELS = {
  OPTIMIST: "gpt-4.1",   // Create mode
  SKEPTIC: "gpt-4.1",    // Red Team
  ARBITER: "gpt-4.1",    // Next Steps integrator
  FOUNDER: "gpt-4.1",    // Founder override
} as const;

// ------------------------------------------------------------
// callModel()
// Routes ALL agent calls to OpenAI Responses API.
// Returns clean `string` text output.
// ------------------------------------------------------------
export async function callModel(model: string, inputBlocks: any[]) {
  try {
    const res = await client.responses.create({
      model,
      input: inputBlocks,
    });

    return extractText(res);
  } catch (err) {
    console.error(`[model-router] Error calling ${model}:`, err);
    return "[model error]";
  }
}

// ------------------------------------------------------------
// extractText()
// Stable extractor for the Responses API output shape.
// ------------------------------------------------------------
function extractText(res: any): string {
  try {
    const block = res?.output?.[0];
    const first = block?.content?.[0];
    const text = first?.text;
    return text || "[no reply]";
  } catch (err) {
    console.error("[model-router] extractText error:", err);
    return "[parse error]";
  }
}

