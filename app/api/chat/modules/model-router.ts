// --------------------------------------------------------------
// MODEL ROUTER — CLEAN, STABLE, TEXT-ONLY
// OpenAI Responses API (2024+ compliant)
// --------------------------------------------------------------

import OpenAI from "openai";

// Create client once
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// --------------------------------------------------------------
// ASCII sanitizer — prevents ByteString >255 errors
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const rep: Record<string, string> = {
    "—": "-", "–": "-", "•": "*",
    "“": "\"", "”": "\"",
    "‘": "'", "’": "'",
    "…": "..."
  };

  let out = input;
  for (const k in rep) out = out.split(k).join(rep[k]);

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// --------------------------------------------------------------
// Unified callModel (TEXT ONLY)
// model: "gpt-4.1", "gpt-4.1-mini", etc.
// prompt: raw text
// --------------------------------------------------------------
export async function callModel(
  model: string,
  prompt: string
): Promise<string> {
  try {
    const safe = sanitizeASCII(prompt);

    const response = await client.responses.create({
      model,
      input: safe,                     // <-- TEXT ONLY
      reasoning: { effort: "medium" }  // allowed
    });

    // NEW RESPONSE API:
    // Prefer output_text; fallback if needed
    const text =
      response.output_text ??
      response.output?.[0]?.content?.[0]?.text ??
      "[empty response]";

    return sanitizeASCII(String(text));
  } catch (err) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[model router error]";
  }
}
