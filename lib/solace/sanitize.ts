// lib/solace/sanitize.ts
// --------------------------------------------------------------
// CENTRAL SANITIZATION ENGINE FOR SOLACE (FINAL VERSION)
// --------------------------------------------------------------

/**
 * sanitizeForModel()
 * ------------------
 * STRICT sanitizer for *model input only*.
 * Converts unsupported Unicode (>255) into "?".
 * Normalizes smart quotes, em-dashes, bullets, ellipses.
 *
 * Never use this for model output.
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

    // Byte-safe for model input only
    return out
      .split("")
      .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
      .join("");
  }

  if (Array.isArray(input)) return input.map((x) => sanitizeForModel(x));

  if (typeof input === "object") {
    const o: any = {};
    for (const k in input) o[k] = sanitizeForModel(input[k]);
    return o;
  }

  return input;
}

/**
 * sanitizeForClient()
 * -------------------
 * Final sanitizer for output → UI
 * ✔ keeps emojis
 * ✔ keeps Unicode
 * ✔ removes *only* invisible control characters
 */
export function sanitizeForClient(text: string): string {
  if (!text) return "";

  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/\uFFFD/g, "�");
}

/**
 * sanitizeForMemory()
 * -------------------
 * Light sanitizer for Supabase storage.
 * ✔ keeps emojis
 * ✔ keeps all Unicode
 * ✔ removes only invalid control chars
 */
export function sanitizeForMemory(text: string): string {
  if (!text) return "";
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

/**
 * sanitizeObjectDeep()
 * -------------------
 * Deep sanitize context objects for UI.
 * ✔ keeps emojis
 * ✔ keeps Unicode
 */
export function sanitizeObjectDeep(input: any): any {
  if (input == null) return input;

  if (typeof input === "string") return sanitizeForClient(input);
  if (Array.isArray(input)) return input.map((x) => sanitizeObjectDeep(x));

  if (typeof input === "object") {
    const out: any = {};
    for (const k in input) out[k] = sanitizeObjectDeep(input[k]);
    return out;
  }

  return input;
}
