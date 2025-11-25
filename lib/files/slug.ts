// lib/files/slug.ts
export function slugFromText(text: string, ext: string) {
  if (!text) return `solace_export.${ext}`;

  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join("_");

  return `${cleaned || "solace_export"}.${ext}`;
}
