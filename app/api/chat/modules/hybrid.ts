//--------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (SESSION-AWARE)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
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
    (m: any) => `- (${m.role}) ${m.content}`
  );

  return `
WORKING MEMORY (SESSION-SCOPED, NON-DURABLE):
${lines.join("\n")}

RULES:
- Working memory MUST be read before responding.
- Working memory MAY influence reasoning silently.
- Working memory MUST NOT be stated as fact.
- Working memory MUST NOT be persisted.
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

  return `
SESSION STATE (AUTHORITATIVE):
Domain: ${state.domain ?? "unspecified"}
Intent: ${state.intent ?? "unspecified"}
Constraints:
${Array.isArray(state.constraints) ? state.constraints.map(c => `- ${c}`).join("\n") : "None"}
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
  // HARD DIAGNOSTIC — PROVES WM VISIBILITY
  // ----------------------------------------------------------
  console.log("[DIAG-HYBRID-WM]", {
    active: context?.workingMemory?.active ?? false,
    count: context?.workingMemory?.items?.length ?? 0,
    sample: context?.workingMemory?.items?.slice(0, 2)?.map((m: any) => ({
      role: m.role,
      content: m.content.slice(0, 60),
    })),
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

ABSOLUTE RULES:
- Speak with one unified voice.
- Do NOT reference internal systems.
- Do NOT fabricate memory.

MEMORY HIERARCHY:
1. SESSION STATE
2. WORKING MEMORY
3. USER MESSAGE
`
  );

  const arbiterPrompt = sanitizeASCII(`
${system}

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
