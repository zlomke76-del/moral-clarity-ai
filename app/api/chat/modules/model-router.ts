// --------------------------------------------------------------
// MODEL ROUTER — ASCII-SAFE RESPONSE API WRAPPER
// Used by hybrid.ts for all model calls.
// Fully sanitized, fallback-safe, deterministic.
// --------------------------------------------------------------

import OpenAI from "openai";

// Primary + fallback models
import { DEFAULT_MODEL, FALLBACK_MODEL } from "./constants";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

// --------------------------------------------------------------
// ASCII Sanitizer — applied BEFORE request and AFTER response
// --------------------------------------------------------------
function sanitizeASCII(input: any): any {
  if (!input) return input;

  if (typeof input === "string") {
    const replacements: Record<string, string> = {
      "—": "-", "–": "-", "•": "*",
      "“": "\"", "”": "\"",
      "‘": "'", "’": "'",
      "…": "..."
    };

    let out = input;
    for (const key in replacements) {
      out = out.split(key).join(replacements[key]);
    }

    // Replace >255 chars with '?'
    return out
      .split("")
      .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
      .join("");
  }

  if (Array.isArray(input)) {
    return input.map((v) => sanitizeASCII(v));
  }

  if (typeof input === "object") {
    const clean: any = {};
    for (const k in input) clean[k] = sanitizeASCII(input[k]);
    return clean;
  }

  return input;
}

// --------------------------------------------------------------
// sanitizeBlock — sanitize an OpenAI request block
// --------------------------------------------------------------
function sanitizeBlock(block: any) {
  if (!block) return block;
  const cloned = JSON.parse(JSON.stringify(block));

  if (cloned.content && Array.isArray(cloned.content)) {
    cloned.content = cloned.content.map((piece: any) => {
      if (typeof piece === "string") return sanitizeASCII(piece);
      if (piece.text) piece.text = sanitizeASCII(piece.text);
      if (piece.input_text) piece.input_text = sanitizeASCII(piece.input_text);
      return piece;
    });
  }

  return cloned;
}

// --------------------------------------------------------------
// extractText — safe extraction from the new Responses API
// --------------------------------------------------------------
function extractText(res: any): string | null {
  try {
    const block = res.output?.[0];
    if (!block) return null;

    const content = block.content?.[0];
    if (!content) return null;

    const text = content.text;
    return text ? sanitizeASCII(text) : null;
  } catch {
    return null;
  }
}

// --------------------------------------------------------------
// callModel — primary + fallback with full sanitization
// --------------------------------------------------------------
export async function callModel(
  model: string,
  inputBlocks: any[]
): Promise<string> {
  const safeBlocks = inputBlocks.map((b) =>
    sanitizeBlock(JSON.parse(JSON.stringify(b)))
  );

  // -----------------------------
  // Primary attempt
  // -----------------------------
  try {
    const response = await client.responses.create({
      model,
      input: safeBlocks
    });

    return extractText(response) ?? "";
  } catch (err) {
    console.error("[callModel] Primary model failed:", err);
  }

  // -----------------------------
  // Fallback attempt
  // -----------------------------
  try {
    const fallbackResponse = await client.responses.create({
      model: FALLBACK_MODEL,
      input: safeBlocks
    });

    return extractText(fallbackResponse) ?? "";
  } catch (err) {
    console.error("[callModel] Fallback model failed:", err);
    return "[Model failure]";
  }
}
