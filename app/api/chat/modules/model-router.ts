// --------------------------------------------------------------
// MODEL ROUTER — FINAL, WORKING WITH NEW OPENAI RESPONSES API
// TEXT-ONLY PIPELINE (no images, no tool calls)
// ASCII-SAFE
// --------------------------------------------------------------

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// -----------------------------
// ASCII sanitize
// -----------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";
  return input
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// -----------------------------
// callModel(model, prompt)
// -----------------------------
export async function callModel(model: string, prompt: string) {
  try {
    const response = await client.responses.create({
      model,
      input: prompt, // TEXT ONLY
      reasoning: { effort: "medium" },
    });

    // ---------------------------------------
    // NEW OpenAI API returns:
    //   response.output_text (string | null)
    // Use only this. Do NOT inspect response.output[].
    // ---------------------------------------
    const text =
      response.output_text ??
      "[empty response]";

    return sanitizeASCII(String(text));

  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[router-error]";
  }
}
