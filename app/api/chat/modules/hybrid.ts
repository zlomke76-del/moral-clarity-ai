// app/api/chat/modules/hybrid.ts
//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
//--------------------------------------------------------------

import { callModel } from "./model-router";

const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Constructive, opportunity-focused, grounded, realistic.
No emojis. No icons. No persona labels. No formatting.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, failure modes.
Not negative for its own sake.
No emojis. No icons. No persona labels.
Short, sharp, factual.
`;

const ARBITER_SYSTEM = `
You are the ARBITER.
You synthesize Optimist + Skeptic into ONE unified answer.

Rules:
- You NEVER reveal personas or internal steps.
- You may use light emojis even without explicit user request.
- Emojis must be subtle, selective, stylistically aligned with Solace.
- The output must feel balanced, wise, decisive.
- Only ONE final answer is returned to the user.
`;

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

  // ---------------------------
  // 1) OPTIMIST
  // ---------------------------
  const optimist = await callModel(
    "gpt-4.1-mini",
    buildPrompt(OPTIMIST_SYSTEM, userMessage)
  );

  // ---------------------------
  // 2) SKEPTIC
  // ---------------------------
  const skeptic = await callModel(
    "gpt-4.1-mini",
    buildPrompt(SKEPTIC_SYSTEM, userMessage)
  );

  // ---------------------------
  // 3) ARBITER
  // ---------------------------
  const arbPrompt = `
${ARBITER_SYSTEM}

OPTIMIST VIEW:
${optimist}

SKEPTIC VIEW:
${skeptic}

USER MESSAGE:
${userMessage}
`;

  const finalAnswer = await callModel("gpt-5.1", arbPrompt);

  return {
    finalAnswer,
    optimist,
    skeptic,
    arbiter: finalAnswer,
    imageUrl: null,
  };
}
