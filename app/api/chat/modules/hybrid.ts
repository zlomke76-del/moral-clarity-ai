//--------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (FACT-AWARE)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
// Attachments visible to Arbiter ONLY
// + PHASE C — EXPLICIT MEMORY COMMIT (ADDITIVE)
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";
import { writeMemory } from "./memory-writer";

// --------------------------------------------------------------
// ASCII SANITIZER
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";
  return input.replace(/[^\x00-\xFF]/g, "?");
}

// --------------------------------------------------------------
// INTERNAL SYSTEMS (NOT USER VISIBLE)
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
Generate constructive possibilities.
No labels.
No meta commentary.
`;

const SKEPTIC_SYSTEM = `
Identify risks and constraints.
No labels.
No meta commentary.
`;

// --------------------------------------------------------------
// MEMORY FORMATTER (AUTHORITATIVE — READ ONLY)
// --------------------------------------------------------------
function formatPersistentFacts(context: any): string {
  const facts = context?.memoryPack?.facts ?? [];

  if (!Array.isArray(facts) || facts.length === 0) {
    return `
PERSISTENT FACTS:
None.

MEMORY RULES:
- No personal facts have been saved.
- Do not infer traits, preferences, or history.
`;
  }

  const lines = facts.map((f: any) => `- ${f.content}`);

  return `
PERSISTENT FACTS (USER-APPROVED):
${lines.join("\n")}

MEMORY RULES:
- Only the above facts persist across sessions.
- Do not infer additional traits or history.
- If facts conflict with the user, ask for correction.
`;
}

// --------------------------------------------------------------
// ATTACHMENT FORMATTER (SESSION-ONLY, NON-AUTHORITATIVE)
// --------------------------------------------------------------
function formatAttachments(context: any): string {
  const attachments = context?.attachments;

  if (!attachments || typeof attachments !== "string") {
    return `
ATTACHMENTS:
None.
`;
  }

  return `
ATTACHMENTS (SESSION-ONLY — NOT FACTS):
The following materials were provided for reference in THIS SESSION ONLY.
They are NOT verified facts and MUST NOT be remembered or inferred from.

${attachments}

RULES:
- Attachments may inform reasoning.
- Attachments may NOT create or modify memory.
- Attachments may NOT be treated as facts.
`;
}

// --------------------------------------------------------------
// PHASE C — EXPLICIT MEMORY DETECTION (IDENTITY ONLY)
// --------------------------------------------------------------
function detectExplicitIdentity(message: string): string | null {
  if (!message) return null;

  const normalized = message.trim();

  // Explicit identity statements only (punctuation-safe)
  const patterns = [
    /(?:^|\b)my name is\s+(.+?)(?:[.!]?$)/i,
    /(?:^|\b)remember.*my name is\s+(.+?)(?:[.!]?$)/i,
    /(?:^|\b)i am called\s+(.+?)(?:[.!]?$)/i,
    /(?:^|\b)i’m called\s+(.+?)(?:[.!]?$)/i,
  ];

  for (const p of patterns) {
    const match = normalized.match(p);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length >= 2 && name.length <= 100) {
        return `User's name is ${name}`;
      }
    }
  }

  return null;
}

// --------------------------------------------------------------
// PIPELINE
// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
}) {
  const { userMessage, context, ministryMode, founderMode, modeHint } = args;

  // ----------------------------------------------------------
  // Optimist — memory blind, attachment blind
  // ----------------------------------------------------------
  const optimist = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${OPTIMIST_SYSTEM}\nUser: ${userMessage}`)
  );

  // ----------------------------------------------------------
  // Skeptic — memory blind, attachment blind
  // ----------------------------------------------------------
  const skeptic = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${SKEPTIC_SYSTEM}\nUser: ${userMessage}`)
  );

  // ----------------------------------------------------------
  // Arbiter — single authoritative voice
  // ----------------------------------------------------------
  const system = buildSolaceSystemPrompt(
    "core",
    `
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

ABSOLUTE RULES:
- Speak with a single unified voice.
- Do NOT reference internal roles or stages.
- Do NOT infer memory, preferences, or identity.

MEMORY RULES:
- Only persisted facts may be stated as facts.
- If no persisted facts exist, say so explicitly.
- Attachments are NOT facts and are session-only.
`
  );

  const memoryBlock = formatPersistentFacts(context);
  const attachmentBlock = formatAttachments(context);

  const arbiterPrompt = sanitizeASCII(`
${system}

${memoryBlock}

${attachmentBlock}

INTERNAL REASONING CONTEXT (DO NOT EXPOSE):
${optimist}

${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  // ==========================================================
  // PHASE C — MEMORY COMMIT (SIDE-EFFECT ONLY)
  // ==========================================================
  try {
    const identityFact = detectExplicitIdentity(userMessage);

    console.log("[MEMORY-CHECK]", {
      identityFact,
      hasAuthUserId: !!context?.authUserId,
      hasCookieHeader: !!context?.cookieHeader,
    });

    if (
      identityFact &&
      context?.authUserId &&
      context?.cookieHeader
    ) {
      console.log("[MEMORY-COMMIT] identity_explicit", {
        userId: context.authUserId,
        content: identityFact,
      });

      await writeMemory(
        {
          userId: context.authUserId,
          email: context.email ?? null,
          workspaceId: context.workspaceId ?? null,
          memoryType: "fact",
          source: "explicit_identity",
          content: identityFact,
        },
        context.cookieHeader
      );
    }
  } catch (err: any) {
    console.warn("[MEMORY-COMMIT] skipped", {
      error: err?.message ?? "unknown",
    });
  }

  // ----------------------------------------------------------
  // Return (unchanged)
  // ----------------------------------------------------------
  return {
    finalAnswer,
  };
}
