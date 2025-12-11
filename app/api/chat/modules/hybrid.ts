// app/api/chat/modules/hybrid.ts
//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter (Option A)
// MULTI-MESSAGE PIPELINE (system + assistant + user)
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// LENS SYSTEM TEXT (no persona)
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
You integrate the Optimist and the Skeptic into ONE unified answer.

Rules:
- Weigh opportunity vs. risk objectively.
- NEVER reveal personas, lenses, or internal steps.
- ONLY use emojis/icons if explicitly requested by the user.
- Speak as ONE Solace voice: decisive, balanced, grounded.
`;

// --------------------------------------------------------------
export async function runHybridPipeline(args: any) {
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
  // 1. OPTIMIST (simple call)
  // ============================================================
  const optStart = performance.now();
  const optimist = await callModel("gpt-4.1-mini", [
    { role: "system", content: OPTIMIST_SYSTEM },
    { role: "user", content: userMessage },
  ]);
  const optEnd = performance.now();

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: OPTIMIST_SYSTEM + userMessage,
    output: optimist,
    started: optStart,
    finished: optEnd,
  });

  // ============================================================
  // 2. SKEPTIC (simple call)
  // ============================================================
  const skpStart = performance.now();
  const skeptic = await callModel("gpt-4.1-mini", [
    { role: "system", content: SKEPTIC_SYSTEM },
    { role: "user", content: userMessage },
  ]);
  const skpEnd = performance.now();

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: SKEPTIC_SYSTEM + userMessage,
    output: skeptic,
    started: skpStart,
    finished: skpEnd,
  });

  // ============================================================
  // 3. ARBITER — with Solace Persona + Memory + Governor
  // ============================================================
  const personaSystem = buildSolaceSystemPrompt(
    "core",
    `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

Memory Facts: ${JSON.stringify(context.memoryPack.facts || [])}
Memory Episodic: ${JSON.stringify(context.memoryPack.episodic || [])}
Autobiography: ${JSON.stringify(context.memoryPack.autobiography || [])}

Research: ${JSON.stringify(context.researchContext || [])}
News: ${JSON.stringify(context.newsDigest || [])}
`
  );

  const arbMessages = [
    // 1. Persona + rules
    { role: "system", content: personaSystem },
    { role: "system", content: ARBITER_RULES },

    // 2. Inject lens outputs as assistant messages
    { role: "assistant", content: `OPTIMIST VIEW:\n${optimist}` },
    { role: "assistant", content: `SKEPTIC VIEW:\n${skeptic}` },

    // 3. User message
    { role: "user", content: userMessage }
  ];

  const arbStart = performance.now();
  const arbiter = await callModel("gpt-4.1", arbMessages);
  const arbEnd = performance.now();

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: JSON.stringify(arbMessages).slice(0, 5000),
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
