// app/api/chat/modules/model-router.ts
//--------------------------------------------------------------
// MODEL ROUTER — CLEAN STRING ONLY (NO ARRAYS, NO BLOCKS)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function callModel(model: string, prompt: string) {
  // Ensure we ALWAYS send a plain string
  const cleanInput: string = sanitizeForModel(
    typeof prompt === "string" ? prompt : String(prompt)
  );

  try {
    const res = await client.responses.create({
      model,
      input: cleanInput,   // MUST be a string
    });

    return typeof res.output_text === "string"
      ? res.output_text
      : String(res.output_text ?? "");

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
