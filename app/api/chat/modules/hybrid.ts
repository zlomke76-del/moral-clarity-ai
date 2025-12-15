//--------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (FACT-AWARE)
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
No labels. No meta commentary.
`;

const SKEPTIC_SYSTEM = `
Identify risks and constraints.
No labels. No meta commentary.
`;

// --------------------------------------------------------------
// MEMORY FORMATTER (AUTHORITATIVE)
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

  // Optimist (internal, memory-blind by design)
  const optimist = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${OPTIMIST_SYSTEM}\nUser: ${userMessage}`)
  );

  // Skeptic (internal, memory-blind by design)
  const skeptic = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${SKEPTIC_SYSTEM}\nUser: ${userMessage}`)
  );

  // Arbiter (single voice, fact-aware)
  const system = buildSolaceSystemPrompt(
    "core",
    `
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

When asked about memory or recall:
- List only persisted facts.
- If none exist, say so explicitly.
- Never infer personality, intent, or preferences.
`
  );

  const memoryBlock = formatPersistentFacts(context);

  const arbiterPrompt = sanitizeASCII(`
${system}

${memoryBlock}

INTERNAL REASONING CONTEXT:
${optimist}

${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  return {
    finalAnswer,
  };
}
