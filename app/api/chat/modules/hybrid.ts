// app/api/chat/modules/hybrid.ts
// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// ---------------------------------------------------------------
// Now includes:
//   • Generous automatic image-request detection
//   • Direct OpenAI image generation bypass
//   • Markdown output for inline rendering in SolaceDock
//   • Complete preservation of hybrid pipeline logic for text mode
// ---------------------------------------------------------------

import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { callModel } from "./model-router";

// *** NEW ***
import { generateImage } from "./image-router";

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

// ---------------------------------------------------------------
// Generous Image-Request Detection
// ---------------------------------------------------------------
// This MUST match route.ts detection so that both behave identically.
function isImageRequest(msg: string): boolean {
  if (!msg) return false;
  const lower = msg.toLowerCase();

  const triggers = [
    "make me an image",
    "generate an image",
    "make an illustration",
    "create an illustration",
    "create an image",
    "make a picture",
    "generate a picture",
    "show me a picture",
    "show me an image",
    "draw ",
    "render ",
    "create art",
    "make art",
    "i want an image",
    "picture of",
    "image of",
    "please draw",
    "please make an image"
  ];

  return triggers.some((t) => lower.includes(t));
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

// ---------------------------------------------------------------
// RUN HYBRID PIPELINE
// ---------------------------------------------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  // Governor is always updated before pipeline
  const gov = updateGovernor(inputs.userMessage);
  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  // -------------------------------------------------------------
  // IMAGE MODE — bypass pipeline completely
  // -------------------------------------------------------------
  if (isImageRequest(inputs.userMessage)) {
    try {
      const url = await generateImage(inputs.userMessage);

      const markdown = sanitizeASCII(
        `Here you go:\n\n![image](${url})`
      );

      return {
        finalAnswer: markdown,
        governorLevel: gov.level,
        governorInstructions: gov.instructions,
        optimist: "",
        skeptic: "",
        arbiter: markdown
      };
    } catch (err: any) {
      return {
        finalAnswer: "[Image generation failed]",
        governorLevel: gov.level,
        governorInstructions: gov.instructions,
        optimist: "",
        skeptic: "",
        arbiter: ""
      };
    }
  }

  // -------------------------------------------------------------
  // NORMAL HYBRID TEXT PIPELINE
  // -------------------------------------------------------------
  try {
    // -----------------------------------------
    // 1. OPTIMIST
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
    const promptArbiter = buildStagePrompt(
      "ARBITER",
      inputs,
      optimist,
      skeptic
    );

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
