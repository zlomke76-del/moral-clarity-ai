// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Governor Integrated (updateGovernor only)
// Model calls routed through model-router.ts
// ASCII-SAFE, deterministic, production stable.
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
    "‘": "'", "’": "'", "…": "..."
  };

  let out = input;
  for (const k in rep) out = out.split(k).join(rep[k]);

  // Replace >255 characters with '?'
  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// -----------------------------
// Build Stage Block
// -----------------------------
function buildStageBlock(
  stage: "OPTIMIST" | "SKEPTIC" | "ARBITER",
  inputs: HybridInputs,
  priorOptimist?: string,
  priorSkeptic?: string
) {
  const { userMessage, context, history, governorInstructions } = inputs;

  const memory = JSON.stringify(context.memoryPack || {}, null, 2);

  let append = "";
  if (stage === "SKEPTIC" && priorOptimist) {
    append = `\nReview the optimist's reasoning:\n${priorOptimist}\n`;
  }

  if (stage === "ARBITER") {
    append = `
SYNTHESIZE:
Optimist said:
${priorOptimist || "[none]"}

Skeptic said:
${priorSkeptic || "[none]"}

Produce ONE final answer only.
`.trim();
  }

  const gov = `
GOVERNOR:
${governorInstructions}
  `.trim();

  const system = `
You are Solace.
Follow the Abrahamic Code:
- Truth
- Compassion
- Accountability
- Stewardship

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

${append}

INSTRUCTIONS:
Return ONLY the stage-appropriate output.
No meta. No role references.
`;

  return sanitizeASCII(system);
}

// -----------------------------
// RUN HYBRID PIPELINE
// -----------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  // Governor computes behavioral signals
  const gov = updateGovernor(inputs.userMessage);

  // Store on inputs (read by buildStageBlock)
  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  try {
    // -------------------------
    // 1. Optimist
    // -------------------------
    const optPrompt = buildStageBlock("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: optPrompt }] }
    ]);

    // -------------------------
    // 2. Skeptic
    // -------------------------
    const skPrompt = buildStageBlock("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: skPrompt }] }
    ]);

    // -------------------------
    // 3. Arbiter
    // -------------------------
    const arbPrompt = buildStageBlock("ARBITER", inputs, optimist, skeptic);
    const arbiter = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: arbPrompt }] }
    ]);

    // -------------------------
    // FINAL unified output
    // -------------------------
    return {
      finalAnswer: sanitizeASCII(arbiter || "[arbiter failed]"),

      // governor continuity
      governorLevel: gov.level,
      governorInstructions: gov.instructions,

      // diagnostics for route.ts
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

      // keep diag props defined
      optimist: "",
      skeptic: "",
      arbiter: ""
    };
  }
}
