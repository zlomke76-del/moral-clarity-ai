// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Governor Integrated (updateGovernor only)
// Works with TEXT-ONLY callModel()
// ---------------------------------------------------------------

import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { callModel } from "./model-router";

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
// ASCII Sanitize
// -----------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const rep: Record<string, string> = {
    "—": "-", "–": "-", "•": "*",
    "“": "\"", "”": "\"",
    "‘": "'", "’": "'",
    "…": "..."
  };

  let out = input;
  for (const k in rep) out = out.split(k).join(rep[k]);

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// -----------------------------
// Build Stage Prompt
// -----------------------------
function buildStagePrompt(
  stage: "OPTIMIST" | "SKEPTIC" | "ARBITER",
  inputs: HybridInputs,
  priorOpt?: string,
  priorSkep?: string
) {
  const { userMessage, context, history, governorInstructions } = inputs;

  const memory = JSON.stringify(context.memoryPack || {}, null, 2);

  let append = "";
  if (stage === "SKEPTIC" && priorOpt) {
    append = `\nReview the optimist's reasoning:\n${priorOpt}\n`;
  }
  if (stage === "ARBITER") {
    append = `
SYNTHESIZE:
Optimist said:
${priorOpt || "[none]"}

Skeptic said:
${priorSkep || "[none]"}

Produce ONE final answer only.
`.trim();
  }

  const gov = `GOVERNOR:\n${governorInstructions}`;

  const prompt = `
You are Solace.
Follow the Abrahamic Code:
- Truth
- Compassion
- Accountability
- Stewardship

ROLE: ${stage}

${gov}

USER MESSAGE:
"${userMessage}"

MEMORY:
${memory}

HISTORY:
${JSON.stringify(history || [], null, 2)}

${append}

INSTRUCTIONS:
Return ONLY the stage-appropriate output.
No meta. No role references.
`;

  return sanitizeASCII(prompt);
}

// -----------------------------
// RUN HYBRID PIPELINE
// -----------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  const gov = updateGovernor(inputs.userMessage);
  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  try {
    // -----------------------------------------
    // 1. OPTIMIST (TEXT ONLY)
    // -----------------------------------------
    const promptOptimist = buildStagePrompt("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", promptOptimist);

    // -----------------------------------------
    // 2. SKEPTIC
    // -----------------------------------------
    const promptSkeptic = buildStagePrompt("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", promptSkeptic);

    // -----------------------------------------
    // 3. ARBITER
    // -----------------------------------------
    const promptArbiter = buildStagePrompt("ARBITER", inputs, optimist, skeptic);
    const arbiter = await callModel("gpt-4.1", promptArbiter);

    return {
      finalAnswer: sanitizeASCII(arbiter || "[arbiter failed]"),

      governorLevel: gov.level,
      governorInstructions: gov.instructions,

      optimist: sanitizeASCII(optimist || ""),
      skeptic: sanitizeASCII(skeptic || ""),
      arbiter: sanitizeASCII(arbiter || "")
    };
  } catch (err) {
    console.error("[HYBRID ERROR]", err);
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
