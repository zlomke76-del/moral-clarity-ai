// lib/chat/attachments.ts

import pdfParse from 'pdf-parse';

export type Attachment = { name: string; url: string; type?: string };

async function fetchAttachmentAsText(att: Attachment): Promise<string> {
  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const ct = (res.headers.get('content-type') || att.type || '').toLowerCase();

  // PDFs
  if (ct.includes('pdf') || /\.pdf(?:$|\?)/i.test(att.url)) {
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await pdfParse(buf);
    return out.text || '';
  }

  // Plain-ish text formats
  if (
    ct.includes('text/') ||
    ct.includes('json') ||
    ct.includes('csv') ||
    /\.(?:txt|md|csv|json)$/i.test(att.name)
  ) {
    return await res.text();
  }

  // Fallback
  return `[Unsupported file type: ${att.name} (${ct || 'unknown'})]`;
}

function clampText(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n) + '\n[...truncated...]';
}

/**
 * Core implementation used by the orchestrator.
 *
 * Called as:
 *   const attachmentSection = attachments?.length
 *     ? await processAttachments(attachments)
 *     : "";
 */
export async function processAttachments(
  attachments: Attachment[],
  opts?: { maxPerFile?: number; maxTotal?: number }
): Promise<string> {
  if (!attachments || !attachments.length) return '';

  const MAX_PER_FILE = opts?.maxPerFile ?? 200_000;
  const MAX_TOTAL = opts?.maxTotal ?? 350_000;

  const parts: string[] = [];
  let total = 0;

  for (const att of attachments) {
    try {
      const raw = await fetchAttachmentAsText(att);
      const clipped = clampText(raw, MAX_PER_FILE);

      const block =
        `\n--- Attachment: ${att.name}\n` +
        `(source: ${att.url})\n` +
        '```\n' +
        clipped +
        '\n```\n';

      if (total + block.length > MAX_TOTAL) {
        parts.push('\n--- [Skipping remaining attachments: token cap reached]');
        break;
      }

      parts.push(block);
      total += block.length;
    } catch (e: any) {
      parts.push(
        `\n--- Attachment: ${att.name}\n[Error reading file: ${e?.message || String(e)}]`
      );
    }
  }

  return (
    `\n\nATTACHMENT DIGEST\n` +
    `The user provided ${attachments.length} attachment(s). Use the content below in your analysis.\n` +
    parts.join('')
  );
}

/**
 * Backwards-compatible alias for the old API used in app/api/chat/route.ts.
 * Keeps legacy imports working while everything migrates to processAttachments.
 */
export async function buildAttachmentSection(
  attachments: Attachment[]
): Promise<string> {
  return processAttachments(attachments);
}
