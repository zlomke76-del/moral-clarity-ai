// lib/chat/attachments.ts

export type ChatMessage = {
  role: string;
  content: string;
};

export type Attachment = {
  name: string;
  url: string;
  type?: string;
};

/**
 * Stub attachment processor for the chat orchestrator.
 *
 * Right now, the real attachment handling (PDF/text extraction, etc.)
 * still lives inside app/api/chat/route.ts.
 *
 * This helper simply:
 * - keeps the existing message list unchanged
 * - returns an empty attachmentSection
 *
 * It exists so that lib/chat/orchestrator.ts can compile cleanly.
 * When we’re ready to centralize attachment handling, we can move the
 * parsing logic here and have the route call into it.
 */
export async function processAttachments(
  body: any,
  rolled: ChatMessage[]
): Promise<{
  rolledWithAttachments: ChatMessage[];
  attachmentSection: string;
}> {
  // In the future we can read attachments from body.attachments here
  // and append a digest message like in app/api/chat/route.ts.
  void body; // avoid unused param lint

  return {
    rolledWithAttachments: rolled,
    attachmentSection: '',
  };
}
