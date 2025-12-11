//--------------------------------------------------------------
// MODEL ROUTER — RESPONSES API (STRICT STRING MODE)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

//--------------------------------------------------------------
// callModel(model, promptString)
// ALWAYS expects a STRING. No arrays. No objects.
//--------------------------------------------------------------
export async function callModel(model: string, prompt: string) {
  const clean: string = sanitizeForModel(String(prompt || ""));

  try {
    const res = await client.responses.create({
      model,
      input: clean, // STRICT STRING MODE ONLY
    });

    return typeof res.output_text === "string"
      ? res.output_text
      : String(res.output_text ?? "");

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
