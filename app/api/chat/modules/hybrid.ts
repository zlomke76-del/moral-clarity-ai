// --------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (SESSION-AWARE)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
// FACTS SUPERSEDE ALL
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
// FORMATTERS
// --------------------------------------------------------------
function formatWorkingMemory(context: any): string {
  const wm = context?.workingMemory?.items ?? [];

  if (!Array.isArray(wm) || wm.length === 0) {
    return `
WORKING MEMORY:
None.
`;
  }

  const lines = wm.map(
    (m: { role: string; content: string }) =>
      `- (${m.role}) ${m.content}`
  );

  return `
WORKING MEMORY (SESSION-SCOPED, NON-DURABLE):
${lines.join("\n")}

RULES:
- Working memory MAY influence reasoning.
- Working memory MUST NOT override factual memory.
- Working memory MUST NOT be stated as fact.
`;
}

function formatFactualMemory(context: any): string {
  const facts = context?.memoryPack?.facts ?? [];

  if (!Array.isArray(facts) || facts.length === 0) {
    return `
FACTUAL MEMORY:
None recorded.
`;
  }

  const lines = facts.map((f: any) =>
    typeof f === "string" ? `- ${f}` : `- ${JSON.stringify(f)}`
  );

  return `
FACTUAL MEMORY (AUTHORITATIVE, DURABLE):
${lines.join("\n")}

ABSOLUTE RULE:
- Factual memory OVERRIDES all other context.
- Identity facts (name, role, relationships) MUST be used unless a newer FACT contradicts them.
`;
}

function formatSessionState(context: any): string {
  const state = context?.memoryPack?.sessionState;

  if (!state) {
    return `
SESSION STATE:
None established.
`;
  }

  const constraintsText = Array.isArray(state.constraints)
    ? state.constraints.map((c: string) => `- ${c}`).join("\n")
    : "None";

  return `
SESSION STATE:
Domain: ${state.domain ?? "unspecified"}
Intent: ${state.intent ?? "unspecified"}
Constraints:
${constraintsText}
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
  // HARD DIAGNOSTIC — PROVES MEMORY VISIBILITY
  // ----------------------------------------------------------
  console.log("[DIAG-HYBRID-MEMORY]", {
    facts: context?.memoryPack?.facts?.length ?? 0,
    wm: context?.workingMemory?.items?.length ?? 0,
  });

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
  // Arbiter — authoritative
  // ----------------------------------------------------------
  const system = buildSolaceSystemPrompt(
    "core",
    `
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

ABSOLUTE RULES (NON-NEGOTIABLE):
- Speak with one unified voice.
- Do NOT reference internal systems.
- Do NOT fabricate memory.
- FACTUAL MEMORY IS AUTHORITATIVE.

MEMORY HIERARCHY (STRICT):
1. FACTUAL MEMORY (supersedes all)
2. SESSION STATE
3. WORKING MEMORY
4. USER MESSAGE
`
  );

  const arbiterPrompt = sanitizeASCII(`
${system}

${formatFactualMemory(context)}

${formatSessionState(context)}

${formatWorkingMemory(context)}

INTERNAL REASONING CONTEXT (DO NOT EXPOSE):
${optimist}
${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  return { finalAnswer };
}
