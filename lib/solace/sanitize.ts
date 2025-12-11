//--------------------------------------------------------------
// GLOBAL SANITIZERS — MODEL SAFE + CLIENT SAFE
//--------------------------------------------------------------

const BAD_ASCII = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

// --------------------------------------------------------------
// Preserve emojis. Remove ONLY invalid ASCII control chars.
// --------------------------------------------------------------
export function sanitizeForModel(input: string): string {
  if (!input) return "";
  return input.replace(BAD_ASCII, "");
}

// --------------------------------------------------------------
// Client-facing: preserve emojis, punctuation, icons.
// Just strip invisible junk.
// --------------------------------------------------------------
export function sanitizeForClient(input: string): string {
  if (!input) return "";
  return input.replace(BAD_ASCII, "");
}

// --------------------------------------------------------------
// Deep object sanitizer (recursively sanitize strings).
// --------------------------------------------------------------
export function sanitizeObjectDeep(obj: any): any {
  if (obj == null) return obj;

  if (typeof obj === "string") return sanitizeForClient(obj);

  if (Array.isArray(obj)) return obj.map((v) => sanitizeObjectDeep(v));

  if (typeof obj === "object") {
    const out: any = {};
    for (const k of Object.keys(obj)) {
      out[k] = sanitizeObjectDeep(obj[k]);
    }
    return out;
  }

  return obj;
}
