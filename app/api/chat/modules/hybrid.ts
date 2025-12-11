// app/api/chat/modules/hybrid.ts
//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter (Option A)
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// SYSTEM TEXT FOR OPTIMIST + SKEPTIC (PURE, NO PERSONA)
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Your job: generate the strongest constructive interpretation of the user's message.
Grounded, realistic, positive, opportunity-focused.
No emojis. No icons. No persona names. No formatting.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Your job: identify risks, constraints, and failure modes.
Not negative for its own sake. Not emotional. No emojis.
Short, sharp, factual.
`;

const ARBITER_RULES = `
You are the ARBITER.
Your job: integrate the Optimist and the Skeptic into ONE unified answer.

Rules:
- You weigh opportunity vs. risk objectively.
- You NEVER reveal personas or internal steps.
- You ONLY use emojis/icons if the user explicitly asked.
- You speak as ONE Solace voice: balanced, clear, directed.
`;

// --------------------------------------------------------------
function build(system: string, userMsg: string): string {
  return `${system}\nUser: ${userMsg}`;
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
  // 1. OPTIMIST
  // ============================================================
  const optStart = performance.now();
  let optimist = await callModel(
    "gpt-4.1-mini",
    build(OPTIMIST_SYSTEM, userMessage)
  );
  const optEnd = performance.now();

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: build(OPTIMIST_SYSTEM, userMessage),
    output: optimist,
    started: optStart,
    finished: optEnd,
  });

  if (!optimist || optimist.includes("[Model error]")) {
    optimist = "Optimist failed.";
  }

  // ============================================================
  // 2. SKEPTIC
  // ============================================================
  const skpStart = performance.now();
  let skeptic = await callModel(
    "gpt-4.1-mini",
    build(SKEPTIC_SYSTEM, userMessage)
  );
  const skpEnd = performance.now();

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: build(SKEPTIC_SYSTEM, userMessage),
    output: skeptic,
    started: skpStart,
    finished: skpEnd,
  });

  if (!skeptic || skeptic.includes("[Model error]")) {
    skeptic = "Skeptic failed.";
  }

  // ============================================================
  // 3. ARBITER — full persona + memory injected
  // ============================================================
  const personaText = buildSolaceSystemPrompt("core", `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}
Memory Facts: ${JSON.stringify(context.memoryPack?.facts || [])}
Memory Episodic: ${JSON.stringify(context.memoryPack?.episodic || [])}
Autobiography: ${JSON.stringify(context.memoryPack?.autobiography || [])}
Research: ${JSON.stringify(context.researchContext || [])}
News: ${JSON.stringify(context.newsDigest || [])}
`);

  const arbPrompt = `
${personaText}

${ARBITER_RULES}

OPTIMIST VIEW:
${optimist}

SKEPTIC VIEW:
${skeptic}

USER MESSAGE:
${userMessage}
`;

  const arbStart = performance.now();
  const arbiter = await callModel("gpt-4.1", arbPrompt);
  const arbEnd = performance.now();

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: arbPrompt,
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
