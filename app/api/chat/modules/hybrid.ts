// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Image-Request Bypass → Direct generateImage()
// Text model calls → sanitizeForModel()
// ---------------------------------------------------------------

import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { sanitizeForModel } from "@/lib/solace/sanitize";
import { callModel } from "./model-router";
import { generateImage } from "./image-router";

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

// ---------------------------------------------------------------
// IMAGE-REQUEST DETECTION (same logic as route.ts)
// ---------------------------------------------------------------
function isImageRequest(msg: string): boolean {
  if (!msg) return false;
  const lower = msg.toLowerCase();

  const triggers = [
    "generate an image",
    "make an image",
    "make me an image",
    "create an illustration",
    "create image",
    "picture of",
    "image of",
    "draw ",
    "render ",
  ];

  return triggers.some((t) => lower.includes(t));
}

// ---------------------------------------------------------------
// PROMPT BUILDER (sanitized for model)
// ---------------------------------------------------------------
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
    append = `\nReview optimist:\n${priorOpt}\n`;
  }
  if (stage === "ARBITER") {
    append = `
SYNTHESIZE:
Optimist:
${priorOpt || "[none]"}
Skeptic:
${priorSkep || "[none]"}
Produce ONE final answer.
`.trim();
  }

  const prompt = `
You are Solace.

GOVERNOR:
${governorInstructions}

ROLE: ${stage}

USER MESSAGE:
"${userMessage}"

MEMORY:
${memory}

HISTORY:
${JSON.stringify(history, null, 2)}

${append}

Return ONLY the stage output.
  `.trim();

  return sanitizeForModel(prompt);
}

// ---------------------------------------------------------------
// PIPELINE
// ---------------------------------------------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  const gov = updateGovernor(inputs.userMessage);
  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  // -------------------------------------------------------------
  // IMAGE MODE → bypass LLM entirely
  // -------------------------------------------------------------
  if (isImageRequest(inputs.userMessage)) {
    try {
      const url = await generateImage(inputs.userMessage); // RAW PROMPT

      return {
        finalAnswer: `Here you go:\n\n![image](${url})`,
        imageUrl: url,
        governorLevel: gov.level,
        governorInstructions: gov.instructions,
        optimist: "",
        skeptic: "",
        arbiter: "",
      };
    } catch (err) {
      return {
        finalAnswer: "[Image generation failed]",
        imageUrl: null,
        governorLevel: gov.level,
        governorInstructions: gov.instructions,
        optimist: "",
        skeptic: "",
        arbiter: "",
      };
    }
  }

  // -------------------------------------------------------------
  // TEXT PIPELINE
  // -------------------------------------------------------------
  try {
    const p1 = buildStagePrompt("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", p1);

    const p2 = buildStagePrompt("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", p2);

    const p3 = buildStagePrompt("ARBITER", inputs, optimist, skeptic);
    const arbiter = await callModel("gpt-4.1", p3);

    return {
      finalAnswer: arbiter || "[arbiter failed]",
      imageUrl: null,
      governorLevel: gov.level,
      governorInstructions: gov.instructions,
      optimist,
      skeptic,
      arbiter,
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
      arbiter: "",
    };
  }
}
