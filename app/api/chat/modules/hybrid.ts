// app/api/chat/modules/hybrid.ts
// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Image mode bypass – returns { finalAnswer, imageUrl }
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
// Generous Image-Request Detection
// ---------------------------------------------------------------
function isImageRequest(msg: string): boolean {
  if (!msg) return false;
  const lower = msg.toLowerCase();

  const triggers = [
    "make me an image",
    "generate an image",
    "create an image",
    "make a picture",
    "generate a picture",
    "show me a picture",
    "show me an image",
    "draw ",
    "render ",
    "picture of",
    "image of"
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
  const gov = updateGovernor(inputs.userMessage);
  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  // -------------------------------------------------------------
  // IMAGE MODE — bypass text pipeline
  // -------------------------------------------------------------
  if (isImageRequest(inputs.userMessage)) {
    try {
      const url = await generateImage(inputs.userMessage);

      const markdown = sanitizeASCII(`Here you go:\n\n![image](${url})`);

      return {
        finalAnswer: markdown,
        imageUrl: url,              // <- PASSED THROUGH
        governorLevel: gov.level,
        governorInstructions: gov.instructions,
        optimist: "",
        skeptic: "",
        arbiter: markdown
      };
    } catch {
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
  // NORMAL TEXT PIPELINE
  // -------------------------------------------------------------
  try {
    const promptOptimist = buildStagePrompt("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", promptOptimist);

    const promptSkeptic = buildStagePrompt("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", promptSkeptic);

    const promptArbiter = buildStagePrompt(
      "ARBITER",
      inputs,
      optimist,
      skeptic
    );
    const arbiter = await callModel("gpt-4.1", promptArbiter);

    return {
      finalAnswer: sanitizeASCII(arbiter || "[arbiter failed]"),
      imageUrl: null, // <- IMPORTANT
      governorLevel: gov.level,
      governorInstructions: gov.instructions,
      optimist: sanitizeASCII(optimist || ""),
      skeptic: sanitizeASCII(skeptic || ""),
      arbiter: sanitizeASCII(arbiter || "")
    };
  } catch {
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
