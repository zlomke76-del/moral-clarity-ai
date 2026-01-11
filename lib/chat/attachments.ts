// lib/chat/attachments.ts

import pdfParse from "pdf-parse";

export type Attachment = { name: string; url: string; type?: string };

/**
 * Returns extracted text for ingestible formats only.
 * Returns empty string for unsupported or unreadable files.
 * NEVER returns prose describing errors or formats.
 */
async function fetchAttachmentAsText(att: Attachment): Promise<string> {
  let res: Response;

  try {
    res = await fetch(att.url);
  } catch {
    return "";
  }

  if (!res.ok) return "";

  const ct = (res.headers.get("content-type") || att.type || "").toLowerCase();
  const name = att.name.toLowerCase();

  // --------------------------------------------------
  // PDFs (allowed)
  // --------------------------------------------------
  if (ct.includes("pdf") || name.endsWith(".pdf")) {
    try {
      const buf = Buffer.from(await res.arrayBuffer());
      const out = await pdfParse(buf);
      return out.text || "";
    } catch {
      return "";
    }
  }

  // --------------------------------------------------
  // Plain text formats (allowed)
  // --------------------------------------------------
  if (
    ct.startsWith("text/") ||
    ct.includes("json") ||
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    name.endsWith(".json")
  ) {
    try {
      return await res.text();
    } catch {
      return "";
    }
  }

  // --------------------------------------------------
  // Everything else (csv, docx, xlsx, etc.)
  // --------------------------------------------------
  return "";
}

function clampText(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n) + "\n[...truncated...]";
}

/**
 * Builds an attachment digest consisting ONLY of valid extracted text.
 * Unsupported or failed files are silently ignored.
 */
export async function processAttachments(
  attachments: Attachment[],
  opts?: { maxPerFile?: number; maxTotal?: number }
): Promise<string> {
  if (!attachments || attachments.length === 0) return "";

  const MAX_PER_FILE = opts?.maxPerFile ?? 200_000;
  const MAX_TOTAL = opts?.maxTotal ?? 350_000;

  const parts: string[] = [];
  let total = 0;
  let ingestedCount = 0;

  for (const att of attachments) {
    const raw = await fetchAttachmentAsText(att);
    if (!raw || raw.trim().length === 0) continue;

    const clipped = clampText(raw, MAX_PER_FILE);

    const block =
      `\n--- Attachment: ${att.name}\n` +
      `(source: ${att.url})\n` +
      "```\n" +
      clipped +
      "\n```\n";

    if (total + block.length > MAX_TOTAL) break;

    parts.push(block);
    total += block.length;
    ingestedCount++;
  }

  if (parts.length === 0) return "";

  return (
    `\n\nATTACHMENT DIGEST\n` +
    `The user provided ${ingestedCount} attachment(s). Use the content below in your analysis.\n` +
    parts.join("")
  );
}

/**
 * Backwards-compatible alias.
 */
export async function buildAttachmentSection(
  attachments: Attachment[]
): Promise<string> {
  return processAttachments(attachments);
}
