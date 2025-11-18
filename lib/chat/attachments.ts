// lib/chat/attachments.ts

import pdfParse from 'pdf-parse';

export type Attachment = {
  name: string;
  url: string;
  type?: string;
};

export type ChatMessage = {
  role: string;
  content: string;
};

/* ========= Low-level helpers ========= */

async function fetchAttachmentAsText(att: Attachment): Promise<string> {
  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const ct = (res.headers.get('content-type') || att.type || '').toLowerCase();

  // PDF → text via pdf-parse
  if (ct.includes('pdf') || /\.pdf(?:$|\?)/i.test(att.url)) {
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await pdfParse(buf);
    return out.text || '';
  }

  // Text-ish types
  if (
    ct.includes('text/') ||
    ct.includes('json') ||
    ct.includes('csv') ||
    /\.(?:txt|md|csv|json)$/i.test(att.name)
  ) {
    return await res.text();
  }

  return `[Unsupported file type: ${att.name} (${ct || 'unknown'})]`;
}

function clampText(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n) + '\n[...truncated...]';
}

/* ========= Main builders ========= */

/**
 * Build the ATTACHMENT DIGEST section as a single string.
 *
 * This mirrors the behavior we previously had inline in app/api/chat/route.ts:
 * - Truncates each file to MAX_PER_FILE chars
 * - Caps the total across all attachments at MAX_TOTAL
 * - Emits a nicely labeled markdown block Solace can read.
 */
export async function buildAttachmentSection(attachments: Attachment[]): Promise<string> {
  if (!attachments || !attachments.length) return '';

  const MAX_PER_FILE = 200_000;
  const MAX_TOTAL = 350_000;

  const parts: string[] = [];
  let total = 0;

  for (const att of attachments) {
    try {
      const raw = await fetchAttachmentAsText(att);
      const clipped = clampText(raw, MAX_PER_FILE);
      const block = `\n--- Attachment: ${att.name}\n(source: ${att.url})\n\`\`\`\n${clipped}\n\`\`\`\n`;

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

  const header =
    `\n\nATTACHMENT DIGEST\n` +
    `The user provided ${attachments.length} attachment(s). Use the content below in your analysis.\n`;

  return header + parts.join('');
}

/**
 * Orchestrator-facing helper.
 *
 * - Reads attachments from body.attachments (if any)
 * - Builds the ATTACHMENT DIGEST
 * - Appends it as a synthetic user message
 *
 * Used by lib/chat/orchestrator.ts.
 */
export async function processAttachments(
  body: any,
  rolled: ChatMessage[]
): Promise<{
  rolledWithAttachments: ChatMessage[];
  attachmentSection: string;
}> {
  const atts = (Array.isArray(body?.attachments) ? body.attachments : []) as Attachment[];

  if (!atts.length) {
    return {
      rolledWithAttachments: rolled,
      attachmentSection: '',
    };
  }

  const attachmentSection = await buildAttachmentSection(atts);

  const rolledWithAttachments = attachmentSection
    ? [...rolled, { role: 'user', content: attachmentSection }]
    : rolled;

  return {
    rolledWithAttachments,
    attachmentSection,
  };
}
