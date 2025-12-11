//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
//--------------------------------------------------------------

import { callModel } from "./model-router";

// persona system prompts
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Your job: generate the strongest constructive interpretation of the user’s message.
Grounded, realistic, opportunity-focused.
NO emojis, NO icons, NO persona names.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Your job: identify risks, constraints, and failure modes.
Not negative for its own sake.
No emojis. Short, sharp, factual.
`;

const ARBITER_SYSTEM = `
You are the ARBITER.
Your job: synthesize the Optimist + Skeptic into ONE unified answer shown to the user.

Rules:
- NEVER reveal personas or internal steps.
- Use emojis/icons ONLY if the user explicitly asked.
- Speak as the unified Solace voice: balanced, clear, directed.
`;

// build prompt
function buildPrompt(system: string, userMsg: string): string {
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

  // 1) OPTIMIST
  const optimist = await callModel(
    "gpt-4.1-mini",
    buildPrompt(OPTIMIST_SYSTEM, userMessage)
  );

  // 2) SKEPTIC
  const skeptic = await callModel(
    "gpt-4.1-mini",
    buildPrompt(SKEPTIC_SYSTEM, userMessage)
  );

  // 3) ARBITER
  const arbPrompt = `
${ARBITER_SYSTEM}

OPTIMIST VIEW:
${optimist}

SKEPTIC VIEW:
${skeptic}

USER MESSAGE:
${userMessage}
`;

  const arbiter = await callModel("gpt-4.1", arbPrompt);

  return {
    finalAnswer: arbiter,
    optimist,
    skeptic,
    arbiter,
    imageUrl: null,
  };
}
