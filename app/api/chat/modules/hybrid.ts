// app/api/chat/modules/hybrid.ts
// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Now supports: automatic image detection + direct OpenAI call
// Returns: { finalAnswer, imageUrl, optimist, skeptic, arbiter }
// Text for image replies follows A1: "Here you go."
// ---------------------------------------------------------------

import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { callModel } from "./model-router";

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
// Image Request Detection
// ---------------------------------------------------------------
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
    append = `\nReview the optimist:\n${priorOpt}\n`;
  }
  if (stage === "ARBITER") {
    append = `
SYNTHESIZE:
Optimist:
${priorOpt || "[none]"}

Skeptic:
${priorSkep || "[none]"}

Return ONE final answer.
    `.trim();
  }

  const gov = `GOVERNOR:\n${governorInstructions}`;

  const prompt = `
You are Solace.
Follow the Abrahamic Code:
Truth, Compassion, Accountability, Stewardship.

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
Return ONLY the stage output.
`;

  return sanitizeASCII(prompt);
}

// ---------------------------------------------------------------
// HYBRID PIPELINE
// ---------------------------------------------------------------
export async function runHybridPipeline(inputs: HybridInputs) {

  // governor
  const gov = updateGovernor(inputs.userMessage);
  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  // -------------------------------------------------------------
  // IMAGE MODE (Option A1)
  // -------------------------------------------------------------
  if (isImageRequest(inputs.userMessage)) {
    try {
      const url = await generateImage(inputs.userMessage);

      return {
        finalAnswer: "Here you go.",
        imageUrl: url,

        governorLevel: gov.level,
        governorInstructions: gov.instructions,

        optimist: "",
        skeptic: "",
        arbiter: "Here you go."
      };
    } catch (err) {
      return {
        finalAnswer: "[Image generation failed]",
        imageUrl: null,

        governorLevel: gov.level,
        governorInstructions: gov.instructions,

        optimist: "",
        skeptic: "",
        arbiter: ""
      };
    }
  }

  // -------------------------------------------------------------
  // TEXT MODE — full hybrid pipeline
  // -------------------------------------------------------------
  try {
    const promptO = buildStagePrompt("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", promptO);

    const promptS = buildStagePrompt("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", promptS);

    const promptA = buildStagePrompt("ARBITER", inputs, optimist, skeptic);
    const arbiter = await callModel("gpt-4.1", promptA);

    return {
      finalAnswer: sanitizeASCII(arbiter || "[arbiter failed]"),
      imageUrl: null,

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
      imageUrl: null,

      governorLevel: gov.level,
      governorInstructions: gov.instructions,

      optimist: "",
      skeptic: "",
      arbiter: ""
    };
  }
}
