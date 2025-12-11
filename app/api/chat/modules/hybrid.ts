//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter (string mode)
// Responses API compatible
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// SYSTEM BLOCKS FOR OPTIMIST & SKEPTIC (simple text prompts)
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Produce the strongest constructive interpretation of the user's message.
Grounded, realistic, opportunity-focused.
No emojis. No icons. No formatting.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, and failure modes.
Factual, precise, sharp.
No emojis. No icons.
Short, clear, analytical.
`;

const ARBITER_RULES = `
You are the ARBITER.
You integrate the Optimist and the Skeptic into ONE unified answer.

Rules:
- Weigh opportunity vs risk objectively.
- Never reveal personas or internal steps.
- Emojis/icons ONLY if the user explicitly asked.
- You speak as ONE Solace voice.
`;

// --------------------------------------------------------------
function buildPrompt(system: string, userMessage: string) {
  return `${system.trim()}\n\nUser: ${userMessage}`;
}

// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  founderMode: boolean;
  modeHint: string;
  canonicalUserKey: string;
  governorLevel: number;
  governorInstructions: string;
}) {

  const {
    userMessage,
    context,
    ministryMode,
    founderMode,
    modeHint,
    governorLevel,
    governorInstructions,
  } = args;

  // ============================================================
  // 1. OPTIMIST (STRING MODE)
  // ============================================================
  const optStart = performance.now();
  let optimist = await callModel(
    "gpt-4.1-mini",
    buildPrompt(OPTIMIST_SYSTEM, userMessage)
  );
  const optEnd = performance.now();

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: buildPrompt(OPTIMIST_SYSTEM, userMessage),
    output: optimist,
    started: optStart,
    finished: optEnd,
  });

  if (!optimist || optimist.includes("[Model error]")) {
    optimist = "Optimist failed.";
  }

  // ============================================================
  // 2. SKEPTIC (STRING MODE)
  // ============================================================
  const skpStart = performance.now();
  let skeptic = await callModel(
    "gpt-4.1-mini",
    buildPrompt(SKEPTIC_SYSTEM, userMessage)
  );
  const skpEnd = performance.now();

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: buildPrompt(SKEPTIC_SYSTEM, userMessage),
    output: skeptic,
    started: skpStart,
    finished: skpEnd,
  });

  if (!skeptic || skeptic.includes("[Model error]")) {
    skeptic = "Skeptic failed.";
  }

  // ============================================================
  // 3. ARBITER (STRING MODE — FULL PERSONA + MEMORY)
  // ============================================================

  const personaSystem = buildSolaceSystemPrompt("core", `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

[FACTS]
${JSON.stringify(context.memoryPack?.facts || [], null, 2)}

[EPISODIC]
${JSON.stringify(context.memoryPack?.episodic || [], null, 2)}

[AUTOBIOGRAPHY]
${JSON.stringify(context.memoryPack?.autobiography || [], null, 2)}

[RESEARCH]
${JSON.stringify(context.researchContext || [], null, 2)}

[NEWS DIGEST]
${JSON.stringify(context.newsDigest || [], null, 2)}
  `);

  // HUMAN-READABLE, SINGLE STRING PROMPT
  const arbPrompt = `
${personaSystem}

------------------------------------------------------------
ARBITER OPERATING RULES
------------------------------------------------------------
${ARBITER_RULES.trim()}

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
  `.trim();

  // Deep Arbiter diagnostics
  console.info("[ARB-PROMPT-PREVIEW]", arbPrompt.slice(0, 2000));
  console.info("[ARB-PROMPT-LENGTH]", arbPrompt.length);

  const arbStart = performance.now();
  const arbiter = await callModel("gpt-4.1", arbPrompt);
  const arbEnd = performance.now();

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: arbPrompt.slice(0, 5000),
    output: arbiter,
    started: arbStart,
    finished: arbEnd,
  });

  return {
    finalAnswer: arbiter,
    optimist,
    skeptic,
    arbiter,
    imageUrl: null,
  };
}
