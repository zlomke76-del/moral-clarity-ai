//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER (FINAL OUTPUT)
// Returns: { finalAnswer, imageUrl, optimist, skeptic, arbiter }
//--------------------------------------------------------------

import { callModel } from "./model-router";

// --------------------------------------------------------------
// SYSTEM PROMPTS (No emojis except Arbiter IF user explicitly asked)
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Your job: produce the most constructive, opportunity-focused interpretation
of the user’s message — grounded, not delusional.
No emojis, no icons, no persona commentary, no theatrics.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Your job: identify risks, constraints, weak assumptions, and failure modes.
Do not be cynical; be rigorous.
No emojis, no icons.
Short, sharp, realistic.
`;

const ARBITER_SYSTEM = `
You are the ARBITER.
You read the Optimist and Skeptic outputs and create a SINGLE synthesis
that is shown to the user.

Rules:
- Never mention Optimist, Skeptic, or Arbiter by name.
- Never reveal internal steps.
- Produce ONE unified Solace response.
- Balance opportunity with risk.
- You MAY use emojis/icons ONLY IF the user's message explicitly asked for emojis/icons.
- Otherwise, no emojis or icons.
- Maintain calm, clarity, and emotional intelligence.
`;

// --------------------------------------------------------------
// Build persona prompt
// --------------------------------------------------------------
function buildPrompt(system: string, userMsg: string) {
  return `${system}\nUSER MESSAGE:\n${userMsg}`;
}

// --------------------------------------------------------------
// Detect if the user explicitly requested emojis/icons
// --------------------------------------------------------------
function userWantsIcons(msg: string): boolean {
  const triggers = ["emoji", "emojis", "icon", "icons", "with emojis", "with icons"];
  const lower = msg.toLowerCase();
  return triggers.some(t => lower.includes(t));
}

// --------------------------------------------------------------
// MAIN RUNNER
// --------------------------------------------------------------
export async function runHybridPipeline({
  userMessage,
  governorLevel,
  governorInstructions,
}: {
  userMessage: string;
  governorLevel: number;
  governorInstructions: string;
}) {
  // ----------------------------------------------------------
  // 1) OPTIMIST
  // ----------------------------------------------------------
  const optimist = await callModel(
    "gpt-5.1-mini",
    buildPrompt(OPTIMIST_SYSTEM, userMessage)
  );

  // ----------------------------------------------------------
  // 2) SKEPTIC
  // ----------------------------------------------------------
  const skeptic = await callModel(
    "gpt-5.1-mini",
    buildPrompt(SKEPTIC_SYSTEM, userMessage)
  );

  // ----------------------------------------------------------
  // 3) ARBITER (FINAL OUTPUT SHOWN TO USER)
  // ----------------------------------------------------------
  const allowIcons = userWantsIcons(userMessage);

  const arbiterInput = `
${ARBITER_SYSTEM}

GOVERNOR LEVEL: ${governorLevel}
GOVERNOR INSTRUCTIONS:
${governorInstructions}

--- OPTIMIST VIEW ---
${optimist}

--- SKEPTIC VIEW ---
${skeptic}

--- USER MESSAGE ---
${userMessage}

THE USER ${allowIcons ? "EXPLICITLY REQUESTED" : "DID NOT REQUEST"} EMOJIS/ICONS.
  `;

  const arbiter = await callModel("gpt-5.1", arbiterInput);

  // FINAL OUTPUT SHOWN TO USER
  const finalAnswer = arbiter;

  return {
    finalAnswer,
    imageUrl: null, // Image handled at route-level or later extension
    optimist,
    skeptic,
    arbiter,
    governorLevel,
    governorInstructions,
  };
}
