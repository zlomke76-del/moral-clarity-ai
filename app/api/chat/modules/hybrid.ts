//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
//--------------------------------------------------------------

import { callModel } from "./model-router";

// persona system prompts
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

// build prompt helper
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
