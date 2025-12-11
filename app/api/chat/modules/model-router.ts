//--------------------------------------------------------------
// MODEL ROUTER — OPENAI RESPONSES API (FINAL SINGLE-STRING VERSION)
//--------------------------------------------------------------

import OpenAI from "openai";
import { sanitizeForModel } from "@/lib/solace/sanitize";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// Force ANY prompt into a single string (required by Responses API)
// --------------------------------------------------------------
function toSingleString(input: any): string {
  if (typeof input === "string") {
    return sanitizeForModel(input);
  }

  try {
    // Flatten arrays into newline-joined text
    if (Array.isArray(input)) {
      return sanitizeForModel(input.map((x) => String(x)).join("\n"));
    }

    // For objects, stringify cleanly
    return sanitizeForModel(JSON.stringify(input, null, 2));
  } catch {
    return sanitizeForModel(String(input));
  }
}

// --------------------------------------------------------------
// callModel(model, prompt)
// --------------------------------------------------------------
export async function callModel(model: string, prompt: any) {
  try {
    const textInput = toSingleString(prompt);

    const res = await client.responses.create({
      model,
      input: textInput, // MUST be ONLY a string
    });

    return typeof res.output_text === "string"
      ? res.output_text
      : String(res.output_text ?? "");

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[Model error]";
  }
}
