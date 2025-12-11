//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER (FINAL ONLY)
//--------------------------------------------------------------

import { callModel } from "./model-router";

type PersonaOut = {
  role: "optimist" | "skeptic" | "arbiter";
  text: string;
};

// --------------------------------------------------------------
// PROMPTS — tightly engineered, no emoji except arbiter if needed
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens. 
Your job: generate the most constructive, opportunity-focused interpretation
of the user’s message — grounded, not delusional.
No icons, no emojis, no formatting flourishes.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Your job: challenge assumptions, identify risks, constraints, failure modes.
Avoid negativity for its own sake. Avoid emojis.
Short, sharp, realistic.
`;

const ARBITER_SYSTEM = `
You are the ARBITER.
Your job: read the Optimist + Skeptic outputs and produce a SINGLE synthesis.
This is the ONLY output that is shown to the user.

Rules:
- You weigh opportunity vs. risk.
- You produce balance, clarity, direction.
- You may use emojis/icons ONLY IF they match the user’s explicit request.
- Never reveal personas or internal steps.
- NEVER output “optimist”, “skeptic”, “arbiter” names.
- Your answer must read as ONE unified Solace response.
`;

// --------------------------------------------------------------
// Build persona prompt
// --------------------------------------------------------------
function buildPrompt(system: string, userMsg: string) {
  return `${system}\nUser: ${userMsg}`;
}

// --------------------------------------------------------------
// Main hybrid function
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
  const { userMessage } = args;

  // ----------------------------------------------------------
  // 1) OPTIMIST
  // ----------------------------------------------------------
  const opt = await callModel(
    "gpt-5.1-mini",
    buildPrompt(OPTIMIST_SYSTEM, userMessage)
  );

  // ----------------------------------------------------------
  // 2) SKEPTIC
  // ----------------------------------------------------------
  const skp = await callModel(
    "gpt-5.1-mini",
    buildPrompt(SKEPTIC_SYSTEM, userMessage)
  );

  // ----------------------------------------------------------
  // 3) ARBITER — ONLY ONE SHOWN TO USER
  // ----------------------------------------------------------
  const arbInput = `
${ARBITER_SYSTEM}

--- OPTIMIST VIEW ---
${opt}

--- SKEPTIC VIEW ---
${skp}

--- USER MESSAGE ---
${userMessage}
  `;

  const finalAnswer = await callModel("gpt-5.1", arbInput);

  return {
    finalAnswer,
    imageUrl: null,
  };
}
