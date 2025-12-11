//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter
// Uses proper Responses API message format
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// SYSTEM TEXT FOR OPTIMIST + SKEPTIC (STRING MODE ONLY)
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Your job is to produce the strongest constructive interpretation
of the user's message. Grounded, realistic, opportunity-focused.
No emojis. No icons. No formatting.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, and failure modes.
Factual, sharp, no negativity for its own sake.
No emojis. No icons.
Short, clear, precise.
`;

const ARBITER_RULES = `
You are the ARBITER.
You integrate the Optimist and the Skeptic into ONE unified answer.

Rules:
- Weigh opportunity vs risk objectively.
- Never reveal personas or internal steps.
- Only use emojis/icons if the user asked.
- Speak as ONE Solace voice.
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
  // 1. OPTIMIST (STRING INPUT)
  // ============================================================
  const optPrompt = build(OPTIMIST_SYSTEM, userMessage);

  const optStart = performance.now();
  let optimist = await callModel("gpt-4.1-mini", optPrompt);
  const optEnd = performance.now();

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: optPrompt,
    output: optimist,
    started: optStart,
    finished: optEnd,
  });

  if (!optimist || optimist.includes("[Model error]"))
    optimist = "Optimist failed.";

  // ============================================================
  // 2. SKEPTIC (STRING INPUT)
  // ============================================================
  const skpPrompt = build(SKEPTIC_SYSTEM, userMessage);

  const skpStart = performance.now();
  let skeptic = await callModel("gpt-4.1-mini", skpPrompt);
  const skpEnd = performance.now();

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: skpPrompt,
    output: skeptic,
    started: skpStart,
    finished: skpEnd,
  });

  if (!skeptic || skeptic.includes("[Model error]"))
    skeptic = "Skeptic failed.";

  // ============================================================
  // 3. ARBITER — STRUCTURED RESPONSES API FORMAT (CRITICAL FIX)
  // ============================================================

  // Build Solace persona + memory pack
  const personaSystem = buildSolaceSystemPrompt("core", `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

Facts: ${JSON.stringify(context.memoryPack?.facts || [])}
Episodic: ${JSON.stringify(context.memoryPack?.episodic || [])}
Autobiography: ${JSON.stringify(context.memoryPack?.autobiography || [])}
Research: ${JSON.stringify(context.researchContext || [])}
NewsDigest: ${JSON.stringify(context.newsDigest || [])}
`);

  // Responses API requires: { role, content: [{ type: "input_text", text: "" }] }
  const arbMessages = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: personaSystem,
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "input_text",
          text: `OPTIMIST VIEW:\n${optimist}`,
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "input_text",
          text: `SKEPTIC VIEW:\n${skeptic}`,
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "input_text",
          text: ARBITER_RULES,
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: userMessage,
        },
      ],
    },
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
