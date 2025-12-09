// app/api/chat/modules/model-router.ts
// --------------------------------------------------------------
// Multi-model router for Solace Hybrid Pipeline (ASCII-SAFE)
// --------------------------------------------------------------

import OpenAI from "openai";
import { DEFAULT_MODEL, FALLBACK_MODEL } from "./constants";

// --------------------------------------------------------------
// ASCII SANITIZER
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const replacements: Record<string, string> = {
    "—": "-",
    "–": "-",
    "•": "*",
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  let out = input;
  for (const bad in replacements) {
    out = out.split(bad).join(replacements[bad]);
  }

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// --------------------------------------------------------------
// BLOCK SANITIZER
// --------------------------------------------------------------
function sanitizeBlock(block: any) {
  if (!block) return block;

  if (Array.isArray(block.content)) {
    block.content = block.content.map((piece: any) => {
      if (typeof piece === "string") return sanitizeASCII(piece);
      if (piece?.text) piece.text = sanitizeASCII(piece.text);
      if (piece?.input_text) piece.input_text = sanitizeASCII(piece.input_text);
      return piece;
    });
  }

  if (typeof block.text === "string") {
    block.text = sanitizeASCII(block.text);
  }

  return block;
}

// --------------------------------------------------------------
// MODEL REGISTRY
// --------------------------------------------------------------
export const MODELS = {
  OPTIMIST: DEFAULT_MODEL,
  SKEPTIC: DEFAULT_MODEL,
  ARBITER: DEFAULT_MODEL,
  FOUNDER: DEFAULT_MODEL,
} as const;

export type SolaceModel = string;

// --------------------------------------------------------------
// OPENAI CLIENT
// --------------------------------------------------------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --------------------------------------------------------------
// callModel() — Primary + Fallback with ASCII safety
// --------------------------------------------------------------
export async function callModel(model: SolaceModel, inputBlocks: any[]) {
  const safeBlocks = inputBlocks.map((b) =>
    sanitizeBlock(JSON.parse(JSON.stringify(b)))
  );

  try {
    // ----------------------
    // PRIMARY MODEL CALL
    // ----------------------
    const response = await client.responses.create({
      model,
      input: safeBlocks,
    });

    return sanitizeASCII(extract(response) ?? "");

  } catch (err) {
    console.error("[callModel] Primary model failed:", err);

    try {
      // ----------------------
      // FALLBACK MODEL CALL
      // ----------------------
      const fallbackResponse = await client.responses.create({
        model: FALLBACK_MODEL,
        input: safeBlocks,
      });

      return sanitizeASCII(extract(fallbackResponse) ?? "");

    } catch (err2) {
      console.error("[callModel] Fallback model also failed:", err2);
      return "[Model failure]";
    }
  }
}

// --------------------------------------------------------------
// extract() — Safe wrapper for Response API output
// --------------------------------------------------------------
function extract(res: any): string | null {
  try {
    if (!res) return null;

    const block = res.output?.[0];
    if (!block) return null;

    const content = block.content?.[0];
    if (!content) return null;

    const text = content.text ?? null;
    return text ? sanitizeASCII(text) : null;

  } catch {
    return null;
  }
}

