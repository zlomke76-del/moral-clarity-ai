//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Solace Output Grammar ENFORCED at Arbiter level
// Negative Space + Authority Aware
// NEXT 16 SAFE — Responses API compatible
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// ASCII SANITIZER — CRITICAL BOUNDARY
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const replacements: Record<string, string> = {
    "—": "-",
    "–": "-",
    "•": "*",
    "“": "\"",
    "”": "\"",
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  return input
    .split("")
    .map((c) => {
      if (replacements[c]) return replacements[c];
      if (c.charCodeAt(0) > 255) return "?";
      return c;
    })
    .join("");
}

// --------------------------------------------------------------
// OPTIMIST / SKEPTIC SYSTEMS
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Surface scientifically plausible mechanisms, opportunities, and constructive interpretations.
Do not speculate beyond known domains.
No formatting.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, failure modes, and missing evidence.
Prioritize durability, safety, legality, and scaling limits.
No formatting.
`;

// --------------------------------------------------------------
// SOLACE OUTPUT GRAMMAR — HARD CONSTRAINT
// --------------------------------------------------------------
const SOLACE_OUTPUT_GRAMMAR = `
SOLACE OUTPUT GRAMMAR (MANDATORY):

Your final response MUST be structured using the following sections,
in this exact order, if applicable:

TITLE:
CONTEXT:
ASSESSMENT:
CONSTRAINTS:
UNSETTLED AREAS:
BOTTOM LINE:

RULES:
- Each section must be explicitly labeled.
- Do NOT use tables for structure.
- Do NOT use visual markdown dividers.
- Do NOT collapse uncertainty into vague language.
- If a section is not applicable, omit it entirely.
- Never ask clarifying questions if the referent is clear from prior context.
- Never invent missing authority or precedent.
- Negative findings MUST be stated explicitly when present.
- The BOTTOM LINE must be one short paragraph with no new information.

Failure to follow this grammar is a correctness error.
`;

// --------------------------------------------------------------
// ARBITER RULES (EPISTEMIC)
// --------------------------------------------------------------
const ARBITER_RULES = `
You are the ARBITER.
You integrate Optimist and Skeptic into ONE answer.

EPISTEMIC RULES:
1. If authority context is present, you must reference it or explicitly refuse.
2. If negative space exists, it must appear in UNSETTLED AREAS.
3. You may not speculate beyond evidence.
4. You may not reveal system structure or internal steps.
5. Speak as ONE Solace voice.
`;

// --------------------------------------------------------------
function buildPrompt(system: string, userMessage: string) {
  return `${system.trim()}\n\nUser: ${userMessage}`;
}

// --------------------------------------------------------------
// MAIN PIPELINE
// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
  governorLevel?: number;
  governorInstructions?: string;
}) {
  const {
    userMessage,
    context,
    ministryMode = false,
    founderMode = false,
    modeHint = "",
    governorLevel = 0,
    governorInstructions = "",
  } = args;

  const safeArray = (a: any) => (Array.isArray(a) ? a : []);

  // ============================================================
  // OPTIMIST
  // ============================================================
  const optimistStarted = Date.now();
  const optimist = await callModel(
    "gpt-4.1-mini",
    buildPrompt(OPTIMIST_SYSTEM, userMessage)
  );
  const optimistFinished = Date.now();

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: userMessage,
    output: optimist,
    started: optimistStarted,
    finished: optimistFinished,
  });

  // ============================================================
  // SKEPTIC
  // ============================================================
  const skepticStarted = Date.now();
  const skeptic = await callModel(
    "gpt-4.1-mini",
    buildPrompt(SKEPTIC_SYSTEM, userMessage)
  );
  const skepticFinished = Date.now();

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: userMessage,
    output: skeptic,
    started: skepticStarted,
    finished: skepticFinished,
  });

  // ============================================================
  // CONTEXT BLOCKS
  // ============================================================
  const memoryBlock = sanitizeASCII(
    JSON.stringify(context?.memoryPack ?? {}, null, 2)
  );

  const researchBlock = sanitizeASCII(
    JSON.stringify(context?.researchContext ?? [], null, 2)
  );

  const authorityBlock = sanitizeASCII(
    JSON.stringify(context?.authorities ?? [], null, 2)
  );

  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "core",
      `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

MEMORY CONTEXT (READ ONLY):
${memoryBlock}

RESEARCH CONTEXT (READ ONLY):
${researchBlock}

AUTHORITY CONTEXT (READ ONLY):
${authorityBlock}
`
    )
  );

  // ============================================================
  // ARBITER PROMPT (STRUCTURE ENFORCED)
  // ============================================================
  const arbiterPrompt = sanitizeASCII(`
${personaSystem}

${SOLACE_OUTPUT_GRAMMAR}

${ARBITER_RULES}

OPTIMIST VIEW:
${optimist}

SKEPTIC VIEW:
${skeptic}

USER MESSAGE:
${userMessage}
`);

  const arbiterStarted = Date.now();
  const arbiter = await callModel("gpt-4.1", arbiterPrompt);
  const arbiterFinished = Date.now();

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: arbiterPrompt.slice(0, 5000),
    output: arbiter,
    started: arbiterStarted,
    finished: arbiterFinished,
  });

  return {
    finalAnswer: arbiter,
    optimist,
    skeptic,
    arbiter,
    imageUrl: null,
  };
}
