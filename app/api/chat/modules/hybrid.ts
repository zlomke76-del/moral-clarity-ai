// app/api/chat/modules/hybrid.ts
// --------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Governor integrated
// ASCII-safe input to model (sanitizeForModel)
// Full Unicode output preserved for UI (no stripping emojis)
// --------------------------------------------------------------

import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { callModel } from "./model-router";
import {
  sanitizeForModel,
  sanitizeForMemory
} from "@/lib/solace/sanitize";

// -----------------------------
// Types
// -----------------------------
export type HybridInputs = {
  userMessage: string;
  context: any;
  history: any[];

  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;

  canonicalUserKey: string | null;

  governorLevel?: number;
  governorInstructions?: string;
};

// -----------------------------
// Build Stage Prompt
// -----------------------------
function buildStagePrompt(
  stage: "OPTIMIST" | "SKEPTIC" | "ARBITER",
  inputs: HybridInputs,
  optimistText?: string,
  skepticText?: string
) {
  const { userMessage, context, history, governorInstructions } = inputs;

  const memoryJSON = JSON.stringify(context.memoryPack || {}, null, 2);

  let stageAppend = "";

  if (stage === "SKEPTIC" && optimistText) {
    stageAppend = `
Review the Optimist's reasoning:
${optimistText}
`;
  }

  if (stage === "ARBITER") {
    stageAppend = `
SYNTHESIZE:
Optimist said:
${optimistText || "[none]"}

Skeptic said:
${skepticText || "[none]"}

Produce ONLY ONE final answer.
`.trim();
  }

  const sys = `
You are Solace.

Follow the Abrahamic Code:
- Truth
- Compassion
- Accountability
- Stewardship

ROLE: ${stage}
${stage === "OPTIMIST" ? "* Explore possibilities." : ""}
${stage === "SKEPTIC" ? "* Challenge assumptions and expose risks." : ""}
${stage === "ARBITER" ? "* Integrate and resolve." : ""}

GOVERNOR:
${governorInstructions || ""}

USER MESSAGE:
"${userMessage}"

MEMORY:
${memoryJSON}

HISTORY:
${JSON.stringify(history || [], null, 2)}

${stageAppend}

INSTRUCTIONS:
Return ONLY the stage output.
Do not describe your role.
Do not mention this prompt.
`.trim();

  return sanitizeForModel(sys);
}

// -----------------------------
// PIPELINE
// -----------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  // Run governor first
  const gov = updateGovernor(inputs.userMessage);

  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  try {
    // ----------------------------------------------------
    // 1. OPTIMIST
    // ----------------------------------------------------
    const promptOptimist = buildStagePrompt("OPTIMIST", inputs);

    const optimist = await callModel("gpt-4.1", [
      {
        role: "user",
        content: promptOptimist
      }
    ]);

    // ----------------------------------------------------
    // 2. SKEPTIC
    // ----------------------------------------------------
    const promptSkeptic = buildStagePrompt(
      "SKEPTIC",
      inputs,
      optimist
    );

    const skeptic = await callModel("gpt-4.1", [
      {
        role: "user",
        content: promptSkeptic
      }
    ]);

    // ----------------------------------------------------
    // 3. ARBITER
    // ----------------------------------------------------
    const promptArbiter = buildStagePrompt(
      "ARBITER",
      inputs,
      optimist,
      skeptic
    );

    const arbiter = await callModel("gpt-4.1", [
      {
        role: "user",
        content: promptArbiter
      }
    ]);

    // ----------------------------------------------------
    // RETURN unified output + diagnostic stages
    // ----------------------------------------------------
    return {
      finalAnswer: arbiter || "[arbiter failed]",

      governorLevel: gov.level,
      governorInstructions: gov.instructions,

      // Diag for route.ts only
      optimist,
      skeptic,
      arbiter
    };

  } catch (err) {
    console.error("[HYBRID PIPELINE ERROR]", err);

    return {
      finalAnswer: "[Hybrid pipeline error]",
      governorLevel: gov.level,
      governorInstructions: gov.instructions,

      optimist: "",
      skeptic: "",
      arbiter: ""
    };
  }
}
