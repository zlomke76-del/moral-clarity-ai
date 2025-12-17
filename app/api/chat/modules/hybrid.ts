//--------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (FACT-AWARE)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
// Attachments visible to Arbiter ONLY
// + PHASE C — EXPLICIT MEMORY COMMIT (RESTORED)
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
// EXPLICIT IDENTITY DETECTOR (WORKS WITH REAL INPUT)
// --------------------------------------------------------------
function detectExplicitIdentity(message: string): string | null {
  if (!message) return null;

  const match = message.match(/my name is\s+([a-zA-Z0-9 .'-]{2,100})/i);
  if (!match) return null;

  return `User's name is ${match[1].trim()}`;
}

// --------------------------------------------------------------
// PIPELINE
// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  userKey: string; // ← THIS IS THE FIX
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
}) {
  const {
    userMessage,
    context,
    userKey,
    ministryMode,
    founderMode,
    modeHint,
  } = args;

  // ----------------------------------------------------------
  // Optimist
  // ----------------------------------------------------------
  const optimist = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${OPTIMIST_SYSTEM}\nUser: ${userMessage}`)
  );

  // ----------------------------------------------------------
  // Skeptic
  // ----------------------------------------------------------
  const skeptic = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${SKEPTIC_SYSTEM}\nUser: ${userMessage}`)
  );

  // ----------------------------------------------------------
  // Arbiter
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
`
  );

  const arbiterPrompt = sanitizeASCII(`
${system}

${formatPersistentFacts(context)}

${formatAttachments(context)}

INTERNAL REASONING CONTEXT (DO NOT EXPOSE):
${optimist}

${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  // ==========================================================
  // PHASE C — MEMORY COMMIT (ACTUALLY WORKS)
  // ==========================================================
  try {
    const identityFact = detectExplicitIdentity(userMessage);

    console.log("[MEMORY-CHECK]", {
      identityFact,
      userKey,
    });

    if (identityFact && userKey) {
      console.log("[MEMORY-COMMIT] identity_explicit", {
        userKey,
        content: identityFact,
      });

      await writeMemory(
        {
          userId: userKey,
          email: "",
          workspaceId: context?.workspaceId ?? null,
          memoryType: "fact",
          source: "explicit",
          content: identityFact,
        },
        ""
      );
    }
  } catch (err: any) {
    console.warn("[MEMORY-COMMIT] skipped", {
      error: err?.message ?? "unknown",
    });
  }

  // ----------------------------------------------------------
  // Return
  // ----------------------------------------------------------
  return {
    finalAnswer,
  };
}
