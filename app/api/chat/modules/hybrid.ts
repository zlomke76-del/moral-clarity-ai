// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Unified Output + Governor Integration)
// Router-based model calls (model-router.ts)
// ASCII-safe, deterministic, production stable.
// ---------------------------------------------------------------

import { applyGovernor } from "@/lib/solace/governor/governor-adapter";
import { callModel } from "./model-router"; // <-- all model calls routed here

// Types
export type HybridInputs = {
  userMessage: string;
  context: any;            // output of assembleContext
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string | null;

  governorLevel?: number;
  governorInstructions?: string;
};

// ---------------------------------------------------------------
// ASCII sanitizer
// ---------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const rep: Record<string, string> = {
    "—": "-", "–": "-", "•": "*", "“": "\"", "”": "\"",
    "‘": "'", "’": "'", "…": "..."
  };

  let out = input;
  for (const k in rep) out = out.split(k).join(rep[k]);

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// ---------------------------------------------------------------
// Build stage instructions (Optimist / Skeptic / Arbiter)
// ---------------------------------------------------------------
function buildInstructionBlock(
  stage: "OPTIMIST" | "SKEPTIC" | "ARBITER",
  inputs: HybridInputs,
  priorOptimist?: string,
  priorSkeptic?: string
) {
  const { userMessage, context, history, governorInstructions } = inputs;

  const memory = JSON.stringify(context.memoryPack || {}, null, 2);

  let stageExtras = "";
  if (stage === "SKEPTIC" && priorOptimist) {
    stageExtras = `\nReview the optimist's reasoning:\n${priorOptimist}\n`;
  }
  if (stage === "ARBITER") {
    stageExtras = `
SYNTHESIZE:
Optimist said:
${priorOptimist || "[none]"}
Skeptic said:
${priorSkeptic || "[none]"}
Produce ONE final answer only.
`.trim();
  }

  // The governor block is the only injected behavioral modifier.
  const gov = `
GOVERNOR:
${governorInstructions}
`;

  const system = `
You are Solace.
Follow the Abrahamic Code:
- Truth (no fabrication)
- Compassion (reduce harm)
- Accountability (moral weight)
- Stewardship (long-term safety)

ROLE: ${stage}
${stage === "OPTIMIST" ? "* Explore possibilities." : ""}
${stage === "SKEPTIC" ? "* Expose risks and failures." : ""}
${stage === "ARBITER" ? "* Synthesize and resolve." : ""}

${gov}

USER MESSAGE:
"${userMessage}"

MEMORY:
${memory}

HISTORY:
${JSON.stringify(history || [], null, 2)}

${stageExtras}

INSTRUCTIONS:
Return ONLY the stage-appropriate answer.
No disclaimers. No meta. No references to roles.
`;

  return sanitizeASCII(system);
}

// ---------------------------------------------------------------
// RUN HYBRID PIPELINE
// ---------------------------------------------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  // Governor processes the message
  const gov = applyGovernor(inputs.userMessage);

  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  try {
    // ---------------------------------------------------------
    // OPTIMIST
    // ---------------------------------------------------------
    const optPrompt = buildInstructionBlock("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: optPrompt }] }
    ]);

    // ---------------------------------------------------------
    // SKEPTIC
    // ---------------------------------------------------------
    const skPrompt = buildInstructionBlock("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: skPrompt }] }
    ]);

    // ---------------------------------------------------------
    // ARBITER (final unified output)
    // ---------------------------------------------------------
    const arbPrompt = buildInstructionBlock(
      "ARBITER",
      inputs,
      optimist,
      skeptic
    );

    const arbiter = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: arbPrompt }] }
    ]);

    // ---------------------------------------------------------
    // Unified output only — NEVER expose stages
    // ---------------------------------------------------------
    return {
      finalAnswer: sanitizeASCII(arbiter || "[arbiter failed]"),
      governorLevel: gov.level,
      governorInstructions: gov.instructions
    };

  } catch (err) {
    console.error("[Hybrid Pipeline Error]", err);
    return {
      finalAnswer: "[Hybrid pipeline error]",
      governorLevel: gov.level,
      governorInstructions: gov.instructions
    };
  }
}
