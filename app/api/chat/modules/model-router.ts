// --------------------------------------------------------------
// MODEL ROUTER — FINAL, FULLY COMPATIBLE WITH OPENAI RESPONSES API
// TEXT-ONLY PIPELINE — NO images, NO tools, NO deprecated fields
// ASCII-SAFE
// --------------------------------------------------------------

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// ASCII SANITIZER
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";
  return input
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// --------------------------------------------------------------
// callModel(model, prompt)
// - NEW Responses API FORMAT
// - NO reasoning.effort (REMOVED — unsupported)
// - ONLY uses response.output_text
// --------------------------------------------------------------
export async function callModel(model: string, prompt: string) {
  try {
    const response = await client.responses.create({
      model,
      input: prompt,   // TEXT ONLY
      // ❌ DO NOT ADD reasoning.effort — not supported by 4.1 or 4.1-mini
    });

    // Always use the official text return value
    const text =
      response.output_text ??
      "[empty response]";

    return sanitizeASCII(String(text));

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[router-error]";
  }
}
