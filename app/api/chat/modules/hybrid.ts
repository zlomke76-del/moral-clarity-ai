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
// PERSISTENT FACTS FORMATTER (LONG-TERM, AUTHORITATIVE)
// --------------------------------------------------------------
function formatPersistentFacts(context: any): string {
  const facts = context?.memoryPack?.facts ?? [];

  if (!Array.isArray(facts) || facts.length === 0) {
    return `
PERSISTENT FACTS:
None.

FACT RULES:
- No long-term facts are established.
- Do NOT infer traits, preferences, or history.
`;
  }

  const lines = facts.map((f: any) => `- ${f.content}`);

  return `
PERSISTENT FACTS (LONG-TERM, USER-APPROVED):
${lines.join("\n")}

FACT RULES:
- These facts persist across sessions.
- These facts may be referenced explicitly when relevant.
- If facts conflict with the user, ask for correction.
`;
}

// --------------------------------------------------------------
// WORKING MEMORY FORMATTER (SESSION-SCOPED, NON-AUTHORITATIVE)
// --------------------------------------------------------------
function formatWorkingMemory(context: any): string {
  const working = context?.memoryPack?.workingMemory ?? [];

  if (!Array.isArray(working) || working.length === 0) {
    return `
WORKING MEMORY:
None.

WORKING MEMORY RULES:
- No transient context is established.
`;
  }

  const lines = working.map((w: any) => `- ${w.content}`);

  return `
WORKING MEMORY (SESSION-SCOPED — NOT FACTS):
${lines.join("\n")}

WORKING MEMORY RULES:
- Working memory reflects recent conversational context.
- Working memory MAY be used silently to maintain continuity and coherence.
- Working memory MUST NOT be stated as fact.
- Working memory MUST NOT persist across sessions.
- Working memory MUST yield to persistent facts and session state.
- If working memory appears incorrect, ask for clarification.
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
- Remain within the user's explicit topic.
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
- You MUST NOT cross domains or projects.
- If the user shifts scope, ASK for confirmation.
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
${attachments}

ATTACHMENT RULES:
- Attachments may inform reasoning.
- Attachments MUST NOT modify memory.
- Attachments MUST NOT be treated as facts.
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
  // Optimist — memory blind
  // ----------------------------------------------------------
  const optimist = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${OPTIMIST_SYSTEM}\nUser: ${userMessage}`)
  );

  // ----------------------------------------------------------
  // Skeptic — memory blind
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
- Speak with one unified voice.
- Do NOT reference internal systems or stages.
- Do NOT fabricate memory.

MEMORY HIERARCHY (STRICT):
1. SESSION STATE (highest authority)
2. PERSISTENT FACTS
3. WORKING MEMORY
4. ATTACHMENTS (lowest authority)

WORKING MEMORY UTILIZATION:
- Working memory MAY silently shape reasoning and continuity.
- Working memory MUST NOT be asserted as fact.
- Working memory MUST NOT outlive this session.

DOMAIN RULES:
- You are bound to the SESSION STATE.
- Do NOT introduce new domains or ventures.
`
  );

  // ----------------------------------------------------------
  // PERSONA DIAGNOSTIC
  // ----------------------------------------------------------
  console.log("[DIAG-PERSONA]", {
    personaVersion: "2025-12-19_session_bound_v6",
    domain: context?.memoryPack?.sessionState?.domain ?? "unset",
    intent: context?.memoryPack?.sessionState?.intent ?? "unset",
    founderMode,
    ministryMode,
    hasSystemPrompt: typeof system === "string" && system.length > 1000,
  });

  const arbiterPrompt = sanitizeASCII(`
${system}

${formatSessionState(context)}

${formatPersistentFacts(context)}

${formatWorkingMemory(context)}

${formatAttachments(context)}

INTERNAL REASONING CONTEXT (DO NOT EXPOSE):
${optimist}

${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  // ----------------------------------------------------------
  // Return
  // ----------------------------------------------------------
  return {
    finalAnswer,
  };
}
