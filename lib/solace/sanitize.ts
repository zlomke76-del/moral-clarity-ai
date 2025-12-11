// ---------------------------------------------------------
// Solace Sanitizer — Emoji Safe (UTF-8 Preserving)
// FINAL VERSION
// ---------------------------------------------------------

// Allow all normal UTF-8 characters, including emojis.
// Only remove:
//   - control chars (0x00–0x1F except tab, LF, CR)
//   - invalid surrogates
//   - dangerous HTML/script injection sequences
// ---------------------------------------------------------

// Clean text for model input (preserve emojis)
export function sanitizeForModel(input: string): string {
  if (!input) return "";

  let out = input;

  // Remove disallowed ASCII control chars (keep tab, newline, carriage return)
  out = out.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  // Remove invalid UTF-16 surrogate halves
  out = out.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, "");
  out = out.replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");

  // Prevent HTML injection
  out = out.replace(/<script/gi, "<scri​pt");

  // Trim excessive whitespace
  return out.trim();
}

// Clean text for UI rendering
export function sanitizeForClient(input: string): string {
  if (!input) return "";

  let out = input;

  // Same UTF checks as model input
  out = out.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  out = out.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, "");
  out = out.replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");

  // Escape HTML only where necessary
  out = out.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return out;
}

// Deep sanitize any object before sending to model
export function sanitizeObjectDeep(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return sanitizeForModel(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((v) => sanitizeObjectDeep(v));
  }

  if (typeof obj === "object") {
    const out: any = {};
    for (const k of Object.keys(obj)) {
      out[k] = sanitizeObjectDeep(obj[k]);
    }
    return out;
  }

  return obj;
}
