// lib/chat/attachments.ts

import pdfParse from 'pdf-parse';

export type Attachment = {
  name: string;
  url: string;
  type?: string;
};

const MAX_PER_FILE = 200_000;
const MAX_TOTAL = 350_000;

function clampText(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n) + '\n[...truncated...]';
}

async function fetchAttachmentAsText(att: Attachment): Promise<string> {
  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = (res.headers.get('content-type') || att.type || '').toLowerCase();

  // PDF support
  if (ct.includes('pdf') || /\.pdf(?:$|\?)/i.test(att.url)) {
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await pdfParse(buf);
    return out.text || '';
  }

  // Plain text / JSON / CSV
  if (
    ct.includes('text/') ||
    ct.includes('json') ||
    ct.includes('csv') ||
    /\.(?:txt|md|csv|json)$/i.test(att.name)
  ) {
    return await res.text();
  }

  // Fallback for unsupported types
  return `[Unsupported file type: ${att.name} (${ct || 'unknown'})]`;
}

/**
 * Build an attachment digest section to append to the user message stream.
 *
 * This mirrors the legacy inline behavior from app/api/chat/route.ts:
 * - Reads each attachment as text (PDFs via pdf-parse).
 * - Clamps per-file and total size.
 * - Emits a markdown-ish block per attachment.
 *
 * Returns an empty string when there are no attachments or everything fails.
 */
export async function buildAttachmentSection(atts: Attachment[]): Promise<string> {
  if (!atts || !atts.length) return '';

  const parts: string[] = [];
  let total = 0;

  for (const att of atts) {
    try {
      const raw = await fetchAttachmentAsText(att);
      const clipped = clampText(raw, MAX_PER_FILE);
      const block =
        `\n--- Attachment: ${att.name}\n(source: ${att.url})\n` +
        '```\n' +
        clipped +
        '\n```\n';

      if (total + block.length > MAX_TOTAL) {
        parts.push(`\n--- [Skipping remaining attachments: token cap reached]`);
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

  if (!parts.length) return '';

  return (
    `\n\nATTACHMENT DIGEST\n` +
    `The user provided ${atts.length} attachment(s). Use the content below in your analysis.\n` +
    parts.join('')
  );
}
