// ---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// With GOVERNOR INTEGRATION (A+ instruction format)
// ASCII-safe, deterministic, production stable.
// ---------------------------------------------------------------

import { applyGovernor } from "@/lib/solace/governor/governor-adapter";

export type HybridInputs = {
  userMessage: string;
  context: any; // output of assembleContext
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string | null;

  // Governor will inject:
  governorLevel?: number;
  governorInstructions?: string;
};

const OAI_URL = "https://api.openai.com/v1/responses";
const OAI_KEY = process.env.OPENAI_API_KEY;

// ---------------------------------------------------------------
// ASCII sanitizer (for prompts and outputs)
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
// Helper: call OpenAI model
// ---------------------------------------------------------------
async function callModel(model: string, text: string): Promise<string> {
  const payload = {
    model,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: sanitizeASCII(text)
          }
        ]
      }
    ]
  };

  const res = await fetch(OAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OAI_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  return sanitizeASCII(json?.output?.[0]?.content?.[0]?.text ?? "");
}

// ---------------------------------------------------------------
// Stage system prompts (ASCII-safe)
// ---------------------------------------------------------------
function buildStageSystem(stage: "OPTIMIST" | "SKEPTIC" | "ARBITER"): string {
  const base = `
You are Solace, under the Abrahamic Code:
* Truth: no fabrication.
* Compassion: reduce harm.
* Accountability: moral weight in every action.
* Stewardship: long-term safety first.

Apply Conscience Recursion before finalizing any answer.
  `.trim();

  if (stage === "OPTIMIST") {
    return `
${base}

ROLE: OPTIMIST
* Expand possibilities.
* Be generative, creative, constructive.
* Explore what could work without violating truth.
    `.trim();
  }

  if (stage === "SKEPTIC") {
    return `
${base}

ROLE: SKEPTIC
* Identify risks, flaws, blind spots.
* Challenge assumptions.
* Protect realism and safety.
    `.trim();
  }

  return `
${base}

ROLE: ARBITER
* Synthesize Optimist and Skeptic.
* Deliver the clearest next step.
* Be concise, grounded, and decisive.
  `.trim();
}

// ---------------------------------------------------------------
// Build stage prompt with GOVERNOR injection
// ---------------------------------------------------------------
function buildStagePrompt(
  stage: "OPTIMIST" | "SKEPTIC" | "ARBITER",
  inputs: HybridInputs,
  priorOptimist?: string,
  priorSkeptic?: string
) {
  const { userMessage, context, history, governorInstructions } = inputs;

  const memorySummary = JSON.stringify(context.memoryPack || {}, null, 2);

  let stageExtras = "";

  if (stage === "SKEPTIC" && priorOptimist) {
    stageExtras = `
Review the optimist's reasoning:
${priorOptimist}
`;
  }

  if (stage === "ARBITER") {
    stageExtras = `
SYNTHESIZE:

Optimist said:
${priorOptimist || "[none]"}

Skeptic said:
${priorSkeptic || "[none]"}

Produce one clear, grounded final answer.
`;
  }

  // Governor injected here (A+ format)
  const governorBlock = `
GOVERNOR:
${governorInstructions}
`;

  return sanitizeASCII(`
${buildStageSystem(stage)}

${governorBlock}

USER MESSAGE:
"${userMessage}"

RELEVANT MEMORY:
${memorySummary}

HISTORY:
${JSON.stringify(history || [], null, 2)}

${stageExtras}

INSTRUCTIONS:
Provide ONLY the stage-appropriate answer. No fluff. No disclaimers.
`);
}

// ---------------------------------------------------------------
// RUN HYBRID PIPELINE (GOVERNOR-AWARE)
// ---------------------------------------------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  // 1. Governor processes the user's message
  const gov = applyGovernor(inputs.userMessage);

  // Attach governor signals to inputs
  inputs.governorLevel = gov.level;
  inputs.governorInstructions = gov.instructions;

  try {
    // -----------------------------------------------------------
    // 1. Optimist
    // -----------------------------------------------------------
    const optPrompt = buildStagePrompt("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", optPrompt);

    // -----------------------------------------------------------
    // 2. Skeptic
    // -----------------------------------------------------------
    const skPrompt = buildStagePrompt("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", skPrompt);

    // -----------------------------------------------------------
    // 3. Arbiter (final synthesis)
    // -----------------------------------------------------------
    const arbPrompt = buildStagePrompt("ARBITER", inputs, optimist, skeptic);
    const finalAnswer = await callModel("gpt-4.1", arbPrompt);

    return {
      finalAnswer: finalAnswer || "[arbiter failed]",
      optimist,
      skeptic,
      governorLevel: gov.level,
      governorInstructions: gov.instructions
    };
  } catch (err: any) {
    console.error("[Hybrid Pipeline Error]", err);
    return {
      finalAnswer: "[Hybrid pipeline error]",
      optimist: null,
      skeptic: null,
      governorLevel: gov.level,
      governorInstructions: gov.instructions
    };
  }
}
