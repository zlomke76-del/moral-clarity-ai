// lib/solace/sanitize.ts
//--------------------------------------------------------------
// GLOBAL SANITIZERS — MODEL SAFE + CLIENT SAFE
//--------------------------------------------------------------

// ----------------------------------------------
// Remove embedded base64 images from user text
// ----------------------------------------------
function stripBase64(input: string): string {
  return input.replace(
    /data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g,
    "[image removed]"
  );
}

// ----------------------------------------------
// ASCII clean: convert >255 codepoints → "?"
// ----------------------------------------------
function asciiClean(str: string): string {
  return str
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// ----------------------------------------------
// MODEL SANITIZER — strict
// ----------------------------------------------
export function sanitizeForModel(input: any): string {
  if (typeof input !== "string") return "";

  let out = stripBase64(input);

  // Replace smart punctuation
  const rep: Record<string, string> = {
    "—": "-",
    "–": "-",
    "•": "*",
    "“": "\"",
    "”": "\"",
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  for (const k in rep) out = out.split(k).join(rep[k]);

  return asciiClean(out);
}

// ----------------------------------------------
// CLIENT SANITIZER — safe for display
// ----------------------------------------------
export function sanitizeForClient(input: any): string {
  if (typeof input !== "string") return "";

  // DO NOT strip emojis here — UI can display them
  const rep: Record<string, string> = {
    "�": "",
  };

  let out = input;
  for (const k in rep) out = out.split(k).join(rep[k]);

  return out;
}

// ----------------------------------------------
// Deep sanitizer for context objects
// ----------------------------------------------
export function sanitizeObjectDeep(val: any): any {
  if (typeof val === "string") return sanitizeForClient(val);
  if (Array.isArray(val)) return val.map((v) => sanitizeObjectDeep(v));

  if (val && typeof val === "object") {
    const out: any = {};
    for (const k in val) out[k] = sanitizeObjectDeep(val[k]);
    return out;
  }

  return val;
}
