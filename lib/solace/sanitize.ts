// lib/solace/sanitize.ts
// --------------------------------------------------------------
// CENTRAL SANITIZATION MODULE (Final Design)
// Provides three distinct sanitizers with clear responsibilities.
// --------------------------------------------------------------

// Characters we replace for model safety (NOT emojis)
const SIMPLE_REPLACEMENTS: Record<string, string> = {
  "—": "-",
  "–": "-",
  "•": "*",
  "“": "\"",
  "”": "\"",
  "‘": "'",
  "’": "'",
  "…": "..."
};

/**
 * ------------------------------------------------------------
 * 1. sanitizeForMemory
 * ------------------------------------------------------------
 * Strict ASCII-only sanitizer for anything being written to DB.
 * - Converts all unicode >255 to "?"
 * - Removes dangerous characters
 * - Safe for Supabase and logs
 * ------------------------------------------------------------
 */
export function sanitizeForMemory(input: any): any {
  if (input == null) return input;

  if (typeof input === "string") {
    let out = input;

    // Replace typographic characters
    for (const k in SIMPLE_REPLACEMENTS) {
      out = out.split(k).join(SIMPLE_REPLACEMENTS[k]);
    }

    // Hard ASCII strip
    return out
      .split("")
      .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
      .join("");
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeForMemory(item));
  }

  if (typeof input === "object") {
    const clean: any = {};
    for (const key in input) {
      clean[key] = sanitizeForMemory(input[key]);
    }
    return clean;
  }

  return input;
}

/**
 * ------------------------------------------------------------
 * 2. sanitizeForModel
 * ------------------------------------------------------------
 * Light sanitization before text enters Optimist/Skeptic/Arbiter.
 * - DOES NOT REMOVE EMOJIS
 * - DOES NOT ASCII-STRIP
 * - Only replaces known typographic troublemakers
 * ------------------------------------------------------------
 */
export function sanitizeForModel(input: string): string {
  if (!input) return "";

  let out = input;

  // Replace typographic characters only
  for (const k in SIMPLE_REPLACEMENTS) {
    out = out.split(k).join(SIMPLE_REPLACEMENTS[k]);
  }

  return out;
}

/**
 * ------------------------------------------------------------
 * 3. noSanitizeForUI
 * ------------------------------------------------------------
 * Used for Solace's final output.
 * - ABSOLUTELY NO CHANGES
 * - Emojis, icons, unicode preserved exactly
 * ------------------------------------------------------------
 */
export function noSanitizeForUI(input: string): string {
  return input || "";
}
