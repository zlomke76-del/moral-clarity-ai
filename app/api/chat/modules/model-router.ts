// app/api/chat/modules/model-router.ts
//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (CLEAN + FINAL)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// callModel(model, prompt)
// --------------------------------------------------------------
export async function callModel(model: string, prompt: string) {
  const clean = sanitizeForModel(prompt);

  try {
    const res = await client.responses.create({
      model,
      input: clean,
    });

    const out = res.output_text ?? "";
    return typeof out === "string" ? out : String(out);

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
