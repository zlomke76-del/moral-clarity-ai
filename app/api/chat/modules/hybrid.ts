// app/api/chat/modules/hybrid.ts
// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Arbiter receives icons. Optimist/Skeptic are clean.
// Governor injected only once (Arbiter stage).
// ASCII-safe, deterministic, production-stable.
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

  // dynamically assigned
  governorInstructions?: string;
};

// -----------------------------
// ASCII Sanitizer
// -----------------------------
function sanitizeASCII(s: string): string {
  if (!s) return "";

  const rep: Record<string, string> = {
    "—": "-",
    "–": "-",
    "•": "*",
    "“": "\"",
    "”": "\"",
    "‘": "'",
    "’": "'",
    "…": "..."
  };

  let out = s;
  for (const k in rep) out = out.split(k).join(rep[k]);

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// -----------------------------
// Stage Prompt Builder
// -----------------------------
function buildPrompt(
  stage: "OPTIMIST" | "SKEPTIC" | "ARBITER",
  inputs: HybridInputs,
  priorOpt?: string,
  priorSkep?: string
) {
  const { userMessage, context, history, governorInstructions } = inputs;

  const memory = JSON.stringify(context.memoryPack || {}, null, 2);

  let stageMeta = "";
  if (stage === "SKEPTIC" && priorOpt) {
    stageMeta = `\nReview the optimist:\n${priorOpt}\n`;
  }

  if (stage === "ARBITER") {
    stageMeta = `
SYNTHESIZE FINAL OUTPUT:
Optimist said:
${priorOpt || "[none]"}

Skeptic said:
${priorSkep || "[none]"}

Produce ONE unified answer.
    `.trim();
  }

  const governorBlock =
    stage === "ARBITER"
      ? `\nGOVERNOR:\n${governorInstructions || ""}\n`
      : "";

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
${stage === "ARBITER" ? "* Integrate + finalize." : ""}

${governorBlock}

USER MESSAGE:
"${userMessage}"

MEMORY:
${memory}

HISTORY:
${JSON.stringify(history || [], null, 2)}

${stageMeta}

INSTRUCTIONS:
Return ONLY the answer for this stage.
Do NOT reference roles.
Do NOT break character.
`.trim();

  return sanitizeASCII(system);
}

// -----------------------------
// HYBRID PIPELINE (Main)
// -----------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  // — Governor processes the message —
  const gov = updateGovernor(inputs.userMessage);
  inputs.governorInstructions = gov.instructions;

  try {
    // ---------------------------------------------------------
    // 1. OPTIMIST
    // ---------------------------------------------------------
    const optPrompt = buildPrompt("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: optPrompt }] }
    ]);
    const optimistClean = sanitizeASCII(optimist || "");

    // ---------------------------------------------------------
    // 2. SKEPTIC
    // ---------------------------------------------------------
    const skPrompt = buildPrompt("SKEPTIC", inputs, optimistClean);
    const skeptic = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: skPrompt }] }
    ]);
    const skepticClean = sanitizeASCII(skeptic || "");

    // ---------------------------------------------------------
    // 3. ARBITER (Final Stage)
    // ---------------------------------------------------------
    const arbPrompt = buildPrompt(
      "ARBITER",
      inputs,
      optimistClean,
      skepticClean
    );

    const arbiter = await callModel("gpt-4.1", [
      { role: "user", content: [{ type: "input_text", text: arbPrompt }] }
    ]);

    const finalClean = sanitizeASCII(arbiter || "[arbiter failed]");

    // ---------------------------------------------------------
    // Return diagnostics + final output
    // ---------------------------------------------------------
    return {
      finalAnswer: finalClean,
      optimist: optimistClean,
      skeptic: skepticClean,
      arbiter: finalClean
    };
  } catch (err) {
    console.error("[HYBRID PIPELINE ERROR]", err);

    return {
      finalAnswer: "[Hybrid pipeline error]",
      optimist: "",
      skeptic: "",
      arbiter: ""
    };
  }
}
