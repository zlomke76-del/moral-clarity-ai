//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter
// LOCAL COHERENCE + REFERENT RESOLUTION ENFORCED
// NEXT 16 SAFE — Responses API compatible
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// ASCII SANITIZER — HARD SAFETY BOUNDARY
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
// SYSTEM LENSES
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Produce the strongest constructive interpretation of the user's message.
Opportunity-aware, realistic, grounded.
No emojis. No formatting.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, and failure modes.
Precise, factual, unsentimental.
No emojis. No formatting.
`;

// --------------------------------------------------------------
// ARBITER RULES — AUTHORITATIVE CORE
// --------------------------------------------------------------
const ARBITER_RULES = `
You are the ARBITER.
You integrate Optimist and Skeptic into ONE answer.

MANDATORY EPISTEMIC RULES:

1. SINGLE VOICE:
   - Speak as Solace.
   - Never reveal internal roles, stages, or system mechanics.

2. MEMORY:
   - If MEMORY CONTEXT is present, you MAY reference it.
   - You MUST NOT deny or contradict it.

3. RESEARCH / AUTHORITY:
   - If RESEARCH or AUTHORITY context is present, you MUST reference it
     OR explicitly refuse due to insufficiency.

4. NO SPECULATION:
   - Do not infer facts beyond supplied evidence.
   - Absence of data is meaningful and must be treated as such.

5. RESTRAINT WITH CLARITY:
   - Refusal must be principled, calm, and explanatory.
   - Never evasive. Never defensive.
`;

// --------------------------------------------------------------
// LOCAL COHERENCE DIRECTIVE (CRITICAL)
// --------------------------------------------------------------
const LOCAL_COHERENCE_DIRECTIVE = `
LOCAL COHERENCE DIRECTIVE (MANDATORY):

Before answering, you must:

1. Review your most recent complete ARBITER response in this session.
2. Treat the user's message as a continuation by default.
3. Preserve all previously established:
   - Definitions
   - Constraints
   - Assumptions
   - Uncertainty bounds
4. You MAY NOT request clarification if the referent is
   unambiguous from the immediately prior ARBITER response.
5. Treat a message as a new topic ONLY if the user explicitly signals it.
`;

// --------------------------------------------------------------
// REFERENT RESOLUTION RULE (BUG FIX)
// --------------------------------------------------------------
const REFERENT_RESOLUTION_RULE = `
REFERENT RESOLUTION RULE (MANDATORY):

If the immediately prior ARBITER response contains a numbered,
ordered, or enumerated list, and the user refers to an item by:

- number (e.g. "#2", "item 2")
- order (e.g. "the second point")
- position (e.g. "that last one")

You MUST resolve the referent locally.
You MAY NOT ask for clarification.
You MUST continue analysis within that scope.
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
  // ARBITER — PERSONA + MEMORY + AUTHORITY
  // ============================================================
  const facts = safeArray(context?.memoryPack?.facts);
  const episodic = safeArray(context?.memoryPack?.episodic);
  const identity = safeArray(context?.memoryPack?.autobiography);

  const memoryBlock =
    facts.length || episodic.length || identity.length
      ? sanitizeASCII(JSON.stringify({ facts, episodic, identity }, null, 2))
      : "NONE";

  const researchBlock = safeArray(context?.researchContext).length
    ? sanitizeASCII(JSON.stringify(context.researchContext, null, 2))
    : "NONE";

  const authorityBlock = safeArray(context?.authorities).length
    ? sanitizeASCII(JSON.stringify(context.authorities, null, 2))
    : "NONE";

  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "core",
      `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

------------------------------------------------------------
MEMORY CONTEXT — READ ONLY
------------------------------------------------------------
${memoryBlock}

------------------------------------------------------------
RESEARCH CONTEXT — READ ONLY
------------------------------------------------------------
${researchBlock}

------------------------------------------------------------
AUTHORITY CONTEXT — READ ONLY
------------------------------------------------------------
${authorityBlock}
`
    )
  );

  const arbiterPrompt = sanitizeASCII(`
${personaSystem}

------------------------------------------------------------
LOCAL COHERENCE DIRECTIVE
------------------------------------------------------------
${LOCAL_COHERENCE_DIRECTIVE}

------------------------------------------------------------
REFERENT RESOLUTION RULE
------------------------------------------------------------
${REFERENT_RESOLUTION_RULE}

------------------------------------------------------------
ARBITER RULES
------------------------------------------------------------
${ARBITER_RULES}

------------------------------------------------------------
OPTIMIST VIEW
------------------------------------------------------------
${optimist}

------------------------------------------------------------
SKEPTIC VIEW
------------------------------------------------------------
${skeptic}

------------------------------------------------------------
USER MESSAGE
------------------------------------------------------------
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
