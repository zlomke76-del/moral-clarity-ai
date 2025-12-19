//--------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (FACT-AWARE, SESSION-BOUND)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
// Attachments visible to Arbiter ONLY
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

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
// SESSION STATE FORMATTER (HARD CONSTRAINT)
// --------------------------------------------------------------
function formatSessionState(context: any): string {
  const state = context?.memoryPack?.sessionState;

  if (!state) {
    return `
SESSION STATE:
None established.

RULES:
- If no session domain exists, remain within the user's explicit topic.
- Do NOT introduce new domains unprompted.
`;
  }

  const constraints =
    Array.isArray(state.constraints) && state.constraints.length > 0
      ? state.constraints.map((c: string) => `- ${c}`).join("\n")
      : "None specified.";

  return `
SESSION STATE (AUTHORITATIVE — DO NOT VIOLATE):
Domain: ${state.domain ?? "unspecified"}
Intent: ${state.intent ?? "unspecified"}

SESSION CONSTRAINTS:
${constraints}

RULES:
- You MUST remain within this domain unless the user explicitly changes it.
- You MUST honor the session intent.
- You MUST NOT introduce unrelated projects, products, or domains.
- If the user appears to shift domains, ASK for confirmation.
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
  // Optimist — memory blind, session blind
  // ----------------------------------------------------------
  const optimist = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${OPTIMIST_SYSTEM}\nUser: ${userMessage}`)
  );

  // ----------------------------------------------------------
  // Skeptic — memory blind, session blind
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

DOMAIN RULES:
- You are bound to the SESSION STATE.
- You may NOT introduce new domains, ventures, or projects.
- You may NOT cross-pollinate contexts.

MEMORY RULES:
- Only persisted facts may be stated as facts.
- If no persisted facts exist, say so explicitly.
- Session state is authoritative for this conversation.
- Attachments are NOT facts and are session-only.
`
  );

  // ----------------------------------------------------------
  // PERSONA DIAGNOSTIC (LOG-PROVEN)
  // ----------------------------------------------------------
  console.log("[DIAG-PERSONA]", {
    personaVersion: "2025-12-19_session_bound_v6",
    domain: context?.memoryPack?.sessionState?.domain ?? "unset",
    intent: context?.memoryPack?.sessionState?.intent ?? "unset",
    founderMode,
    ministryMode,
    hasSystemPrompt:
      typeof system === "string" && system.length > 1000,
  });

  const arbiterPrompt = sanitizeASCII(`
${system}

${formatSessionState(context)}

${formatPersistentFacts(context)}

${formatAttachments(context)}

INTERNAL REASONING CONTEXT (DO NOT EXPOSE):
${optimist}

${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  // ----------------------------------------------------------
  // Return (pure, constrained)
  // ----------------------------------------------------------
  return {
    finalAnswer,
  };
}
