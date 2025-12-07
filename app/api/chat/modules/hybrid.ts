// app/api/chat/modules/hybrid.ts
//---------------------------------------------------------------
// HYBRID SUPER-AI PIPELINE (Optimist → Skeptic → Arbiter)
// Abrahamic Code guardrails applied at every stage.
//---------------------------------------------------------------

export type HybridInputs = {
  userMessage: string;
  context: any; // full assembleContext bundle
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;

  // 🔥 FIX: must allow null so orchestrator can pass through canonicalUserKey
  canonicalUserKey: string | null;
};

const OAI_URL = "https://api.openai.com/v1/responses";
const OAI_KEY = process.env.OPENAI_API_KEY;

//---------------------------------------------------------------
// Helper: call OpenAI model
//---------------------------------------------------------------
async function callModel(model: string, input: any): Promise<string> {
  const res = await fetch(OAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OAI_KEY}`,
    },
    body: JSON.stringify({
      model,
      input,
    }),
  });

  const json = await res.json();
  const block = json?.output?.[0]?.content?.[0];
  return block?.text || "";
}

//---------------------------------------------------------------
// Build a system block for each stage
//---------------------------------------------------------------
function buildStageSystem(stage: "OPTIMIST" | "SKEPTIC" | "ARBITER"): string {
  const base = `
You are Solace, under the Abrahamic Code:
• Truth — no fabrication.
• Compassion — reduce harm.
• Accountability — moral weight in every action.
• Stewardship — long-term safety first.

Apply Conscience Recursion before finalizing any answer.
  `.trim();

  if (stage === "OPTIMIST") {
    return `
${base}

ROLE: OPTIMIST
• Expand possibilities.
• Be generative, creative, constructive.
• Focus on what *could* work if constraints were handled.
• No exaggeration; stay within truth.
    `.trim();
  }

  if (stage === "SKEPTIC") {
    return `
${base}

ROLE: SKEPTIC
• Identify risks, flaws, blind spots.
• Challenge assumptions.
• Protect safety and realism.
• Do not be cruel or dismissive.
    `.trim();
  }

  return `
${base}

ROLE: ARBITER
• Synthesize Optimist + Skeptic.
• Deliver the clearest, morally aligned NEXT STEP.
• Provide one decisive, grounded answer.
• Reduce confusion; increase clarity.
  `.trim();
}

//---------------------------------------------------------------
// Build prompt for each stage
//---------------------------------------------------------------
function buildStagePrompt(
  stage: "OPTIMIST" | "SKEPTIC" | "ARBITER",
  inputs: HybridInputs,
  priorOptimist?: string,
  priorSkeptic?: string
) {
  const { userMessage, context, history } = inputs;

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
`;
  }

  return `
${buildStageSystem(stage)}

USER MESSAGE:
"${userMessage}"

RELEVANT MEMORY:
${memorySummary}

HISTORY:
${JSON.stringify(history || [], null, 2)}

${stageExtras}

INSTRUCTIONS:
Provide ONLY the stage-appropriate answer. No fluff. No disclaimers.
  `.trim();
}

//---------------------------------------------------------------
// RUN HYBRID PIPELINE
//---------------------------------------------------------------
export async function runHybridPipeline(inputs: HybridInputs) {
  const { userMessage } = inputs;

  try {
    //-----------------------------------------------------------
    // 1. Optimist
    //-----------------------------------------------------------
    const optPrompt = buildStagePrompt("OPTIMIST", inputs);
    const optimist = await callModel("gpt-4.1", optPrompt);

    //-----------------------------------------------------------
    // 2. Skeptic
    //-----------------------------------------------------------
    const skPrompt = buildStagePrompt("SKEPTIC", inputs, optimist);
    const skeptic = await callModel("gpt-4.1", skPrompt);

    //-----------------------------------------------------------
    // 3. Arbiter (final synthesis)
    //-----------------------------------------------------------
    const arbPrompt = buildStagePrompt("ARBITER", inputs, optimist, skeptic);
    const finalAnswer = await callModel("gpt-4.1", arbPrompt);

    return {
      finalAnswer: finalAnswer || "[arbiter failed to produce text]",
      optimist,
      skeptic,
    };
  } catch (err: any) {
    console.error("[Hybrid Pipeline Error]", err);
    return {
      finalAnswer: "[Hybrid pipeline error — arbiter unavailable]",
      optimist: null,
      skeptic: null,
    };
  }
}
