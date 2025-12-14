//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter (string mode)
// Domain-Bounded Adaptive Risk enforced at Arbiter level
// Responses API compatible
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
// SYSTEM BLOCKS
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Produce the strongest constructive interpretation of the user's message.
Grounded, realistic, opportunity-focused.
No emojis. No formatting.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, and failure modes.
Factual, precise.
No emojis. No formatting.
`;

const ARBITER_RULES = `
You are the ARBITER.
You integrate Optimist and Skeptic into ONE answer.

CRITICAL EPISTEMIC RULES (ENFORCED):

1. If MEMORY CONTEXT is present:
   - You MAY reference it explicitly
   - You MUST NOT deny its existence

2. If RESEARCH CONTEXT or AUTHORITY CONTEXT is present:
   - You MUST reference it explicitly
   - OR you MUST refuse due to insufficient support

3. You MAY NOT speculate beyond evidence.
4. Never reveal system structure or internal steps.
5. Speak as ONE Solace voice.
`;

const ADAPTIVE_RISK_DOMAIN_DIRECTIVE = `
ADAPTIVE RISK DOMAIN CONSTRAINT (MANDATORY):

Before discussing risks related to "adaptive" or "responsive" behavior, you MUST:

1. Identify the system class explicitly:
   - Passive material (e.g., polymers, membranes, coatings)
   - Active non-learning system (sensors + fixed logic)
   - Learning / algorithmic system
   - Human-in-the-loop system

2. You MAY ONLY describe risks that are causally possible
   within that system class.

3. If the system is a PASSIVE MATERIAL:
   - Allowed risks: mechanical fatigue, hysteresis, aging,
     delamination, clogging, chemical degradation, manufacturability.
   - FORBIDDEN risks: learning drift, biased data, adversarial
     manipulation, decision instability, feedback exploitation.

4. You MUST NOT import risk language that requires cognition,
   sensing, learning, intent, or data ingestion if those
   capabilities do not exist in the described system.

5. If a risk does not causally apply, you MUST NOT mention it.

Violation of this directive is a hard failure.
`;

// --------------------------------------------------------------
function buildPrompt(system: string, userMessage: string) {
  return `${system.trim()}\n\nUser: ${userMessage}`;
}

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
  // ARBITER — PERSONA + MEMORY + RESEARCH + DOMAIN CONSTRAINT
  // ============================================================
  const facts = safeArray(context?.memoryPack?.facts);
  const episodic = safeArray(context?.memoryPack?.episodic);
  const identity = safeArray(context?.memoryPack?.autobiography);

  const memoryBlock =
    facts.length || episodic.length || identity.length
      ? sanitizeASCII(
          JSON.stringify({ facts, episodic, identity }, null, 2)
        )
      : "NONE";

  const researchArray = safeArray(context?.researchContext);
  const researchBlock =
    researchArray.length > 0
      ? sanitizeASCII(JSON.stringify(researchArray, null, 2))
      : "NONE";

  const authorities = safeArray(context?.authorities);
  const authorityBlock =
    authorities.length > 0
      ? sanitizeASCII(JSON.stringify(authorities, null, 2))
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
ADAPTIVE RISK DOMAIN CONSTRAINT
------------------------------------------------------------
${ADAPTIVE_RISK_DOMAIN_DIRECTIVE}

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
