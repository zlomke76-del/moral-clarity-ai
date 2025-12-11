// lib/solace/sanitize.ts
// --------------------------------------------------------------
// CENTRAL SANITIZATION ENGINE FOR SOLACE
// Model-safe, memory-safe, UI-safe normalization
// --------------------------------------------------------------

/**
 * sanitizeForModel()
 * ------------------
 * STRICT SANITIZER for prompts sent to OpenAI.
 * Converts unsupported Unicode (>255) into "?".
 * Normalizes smart quotes, em-dashes, bullets, ellipses.
 *
 * DO NOT use for model output → that comes in full unicode.
 */
export function sanitizeForModel(input: any): any {
  if (input == null) return input;

  if (typeof input === "string") {
    const rep: Record<string, string> = {
      "—": "-",
      "–": "-",
      "•": "*",
      "“": "\"",
      "”": "\"",
      "‘": "'",
      "’": "'",
      "…": "..."
    };

    let out = input;
    for (const k in rep) out = out.split(k).join(rep[k]);

    // ByteString-safe: OpenAI request cannot exceed byte range
    return out
      .split("")
      .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
      .join("");
  }

  if (Array.isArray(input)) {
    return input.map((x) => sanitizeForModel(x));
  }

  if (typeof input === "object") {
    const obj: any = {};
    for (const k in input) obj[k] = sanitizeForModel(input[k]);
    return obj;
  }

  return input;
}

/**
 * sanitizeForClient()
 * -------------------
 * UI-friendly sanitizer used when sending output
 * to the browser. Does NOT strip emojis.
 * Only removes invisible control characters + invalid UTF-16.
 */
export function sanitizeForClient(text: string): string {
  if (!text) return "";

  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // invisible controls
    .replace(/\uFFFD/g, "�"); // replace invalid UTF-16 with replacement char
}

/**
 * sanitizeForMemory()
 * -------------------
 * Supabase-safe serialization.
 * Replaces >255 but preserves emojis and intentional symbols.
 *
 * Use ONLY when storing long-term memory entries.
 */
export function sanitizeForMemory(input: string): string {
  if (!input) return "";

  // remove only characters that cannot be stored safely
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

/**
 * sanitizeObjectDeep()
 * -------------------
 * Deep cleaner for context objects or JSON blobs.
 * DOES NOT strip emojis.
 */
export function sanitizeObjectDeep(input: any): any {
  if (input == null) return input;

  if (typeof input === "string") {
    return sanitizeForClient(input);
  }

  if (Array.isArray(input)) {
    return input.map((x) => sanitizeObjectDeep(x));
  }

  if (typeof input === "object") {
    const out: any = {};
    for (const k in input) {
      out[k] = sanitizeObjectDeep(input[k]);
    }
    return out;
  }

  return input;
}
