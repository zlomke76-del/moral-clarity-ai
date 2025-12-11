// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// MODEL ROUTER — Final corrected version
// Uses OpenAI Responses API correctly (string input only)
// ASCII-safe, deterministic, production stable.
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
// callModel(model: string, messages: any[]): Promise<string>
// Corrected for Responses API: accepts ONLY a string
// --------------------------------------------------------------
export async function callModel(
  model: string,
  messages: Array<{ role: string; content: any }>
): Promise<string> {
  try {
    // Extract the prompt text from messages
    // Pipeline always sends exactly 1 user message with a text block
    const extracted =
      messages?.[0]?.content?.[0]?.text ??
      messages?.[0]?.content?.text ??
      messages?.[0]?.content ??
      "[empty prompt]";

    const prompt = String(extracted);

    const response = await client.responses.create({
      model,
      input: prompt, // <-- FIXED, now a string not an array
      reasoning: { effort: "medium" }
    });

    const text =
      response.output_text ??
      response.output?.[0]?.content?.[0]?.text ??
      "[empty response]";

    return sanitizeASCII(String(text));
  } catch (err: any) {
    console.error("[MODEL ROUTER ERROR]", err);
    return (
      "[model-router error] " +
      sanitizeASCII(String(err?.message ?? "unknown"))
    );
  }
}
