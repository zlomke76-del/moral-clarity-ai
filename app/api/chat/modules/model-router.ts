// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// MODEL ROUTER — Responses API (final, stable, build-safe)
// Produces deterministic text output via output_text only.
// --------------------------------------------------------------

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// ASCII Sanitize
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const rep: Record<string, string> = {
    "—": "-", "–": "-", "•": "*",
    "“": "\"", "”": "\"",
    "‘": "'", "’": "'", "…": "..."
  };

  let out = input;
  for (const k in rep) out = out.split(k).join(rep[k]);

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// --------------------------------------------------------------
// Correct model invocation for Responses API
// --------------------------------------------------------------
export async function callModel(
  model: string,
  messages: Array<{ role: string; content: any }>
): Promise<string> {
  try {
    // Extract actual prompt string from the messages array
    const prompt =
      messages?.[0]?.content?.[0]?.text ??
      messages?.[0]?.content?.text ??
      messages?.[0]?.content ??
      "[empty prompt]";

    const promptStr = String(prompt);

    const response = await client.responses.create({
      model,
      input: promptStr, // <-- THIS IS THE ONLY VALID INPUT FORMAT
      reasoning: { effort: "medium" }
    });

    // ------------------------------------------------------
    // SAFE TEXT EXTRACTION (Responses API standard)
    // ------------------------------------------------------
    const text =
      response.output_text ??
      "[no output_text returned]";

    return sanitizeASCII(String(text));
  } catch (err: any) {
    console.error("[MODEL ROUTER ERROR]", err);
    return "[model-router error] " + sanitizeASCII(String(err?.message ?? "unknown"));
  }
}
