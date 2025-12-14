//--------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY
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

const ARBITER_SYSTEM = `
Integrate perspectives into a single, coherent response.
Do not reference internal roles or stages.
Speak only as Solace.
`;

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
  const { userMessage, ministryMode, founderMode, modeHint } = args;

  // Optimist (internal)
  const optimist = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${OPTIMIST_SYSTEM}\nUser: ${userMessage}`)
  );

  // Skeptic (internal)
  const skeptic = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${SKEPTIC_SYSTEM}\nUser: ${userMessage}`)
  );

  // Arbiter (single voice)
  const system = buildSolaceSystemPrompt("core", `
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}
`);

  const arbiterPrompt = sanitizeASCII(`
${system}

INTERNAL CONTEXT:
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
