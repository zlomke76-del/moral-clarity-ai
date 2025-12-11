//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Clean, deterministic, model-specific
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";

// ------------------------------
// SYSTEM PROMPTS
// ------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Your job: generate the strongest constructive interpretation of the user’s message.
Grounded, realistic, positive, opportunity-focused.
No emojis. No icons. No persona names. No formatting.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Your job: identify risks, constraints, failure modes.
Not negative for its own sake. Not emotional. No emojis.
Short, sharp, factual.
`;

const ARBITER_SYSTEM = `
You are the ARBITER.
Your job: synthesize the Optimist + Skeptic into ONE unified answer shown to the user.

Rules:
- You weigh opportunity vs. risk objectively.
- You NEVER reveal personas or internal steps.
- You ONLY use emojis/icons if the user explicitly asked.
- You speak as ONE Solace voice: balanced, clear, directed.
`;

// Prompt builder
function build(system: string, userMsg: string): string {
  return `${system}\nUser: ${userMsg}`;
}

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
  const { userMessage } = args;

  // ------------------------------
  // OPTIMIST (always gpt-4.1-mini)
  ------------------------------
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

  // ------------------------------
  // SKEPTIC (always gpt-4.1-mini)
  ------------------------------
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

  if (!optimist || optimist.includes("[Model error]"))
    optimist = "Optimist failed.";
  if (!skeptic || skeptic.includes("[Model error]"))
    skeptic = "Skeptic failed.";

  // ------------------------------
  // ARBITER (always gpt-4.1)
  ------------------------------
  const arbPrompt = `
${ARBITER_SYSTEM}

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
