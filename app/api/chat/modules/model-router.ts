// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// MODEL ROUTER — Single unified interface for OpenAI model calls
// Used by hybrid.ts (Optimist → Skeptic → Arbiter)
// ASCII-safe, deterministic, production stable.
// --------------------------------------------------------------

import OpenAI from "openai";

// Primary client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// ASCII sanitizer — protect against byte >255 crashes
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
// callModel(model: string, messages: any[]): Promise<string>
// The ONLY model-calling function allowed in Solace pipeline.
// --------------------------------------------------------------
export async function callModel(
  model: string,
  messages: Array<{ role: string; content: any }>
): Promise<string> {
  try {
    // Responses API call — unified pipeline
    const response = await client.responses.create({
      model,
      input: messages,
      reasoning: { effort: "medium" },
    });

    // Extract text safely
    const text =
      response.output_text ??
      response.output?.[0]?.content?.[0]?.text ??
      "[empty response]";

    return sanitizeASCII(String(text));
  } catch (err: any) {
    console.error("[MODEL ROUTER ERROR]", err?.message || err);

    return (
      "[model-router error] " +
      sanitizeASCII(String(err?.message ?? "unknown"))
    );
  }
}
