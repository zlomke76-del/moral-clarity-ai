// app/api/chat/modules/orchestrator.ts
// ------------------------------------------------------------
// SUPER-AI HYBRID PIPELINE
// Optimist → Skeptic → Arbiter
// Ministry + Founder modes supported
// Persona always active
// ------------------------------------------------------------

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

interface PipelineArgs {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
}

/**
 * Base context block used by all three agents.
 */
function buildBaseContext(userMessage: string, context: any, history: any[]) {
  return `
[User Message]: ${userMessage}

[User Memories]: ${JSON.stringify(context.memoryPack.userMemories || [], null, 2)}

[Episodic Memories]: ${JSON.stringify(
    context.memoryPack.episodicMemories || [],
    null,
    2
  )}

[Autobiography]: ${JSON.stringify(
    context.memoryPack.autobiography || {},
    null,
    2
  )}

[News Digest]: ${JSON.stringify(context.newsDigest || [], null, 2)}

[Research Context]: ${JSON.stringify(context.researchContext || [], null, 2)}

[Chat History]: ${JSON.stringify(history || [], null, 2)}
  `;
}

/**
 * Founder's direct override model
 * (no optimism/skeptic stages — direct architectural truth)
 */
async function runFounderPass(fullContext: string) {
  const founderPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("founder", `
Founder Mode Active:
- Maximum clarity.
- No hedging.
- No softening.
- Architecture, truth, and precision first.
        `),
        },
      ],
    },
    {
      role: "user",
      content: [{ type: "input_text", text: fullContext }],
    },
  ];

  return callModel(MODELS.FOUNDER, founderPrompt);
}

/**
 * HYBRID PIPELINE:
 * 1. Optimist (Create)
 * 2. Skeptic (Red Team)
 * 3. Arbiter (Next Steps — final integrator)
 */
export async function runHybridPipeline({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
}: PipelineArgs) {
  const baseContext = buildBaseContext(userMessage, context, history);

  // ------------------------------------------------------------
  // FOUNDER MODE OVERRIDE
  // ------------------------------------------------------------
  if (founderMode) {
    const founderResult = await runFounderPass(baseContext);
    return {
      optimist: null,
      skeptic: null,
      finalAnswer: founderResult,
    };
  }

  // ============================================================
  // 1. OPTIMIST (Create mode)
  // ============================================================
  const optimistSystem = buildSolaceSystemPrompt("optimist", `
You are SOLACE_OPTIMIST.
Expansive, generative, opportunity-focused.
Stay within the Abrahamic Code.
${ministryMode ? "Ministry mode is active — weave Scriptural themes gently when relevant." : ""}
  `);

  const optimistPrompt = [
    {
      role: "system",
      content: [{ type: "input_text", text: optimistSystem }],
    },
    {
      role: "user",
      content: [{ type: "input_text", text: baseContext }],
    },
  ];

  const optimist = await callModel(MODELS.OPTIMIST, optimistPrompt);

  // ============================================================
  // 2. SKEPTIC (Red Team)
  // ============================================================
  const skepticSystem = buildSolaceSystemPrompt("skeptic", `
You are SOLACE_SKEPTIC.
Challenge assumptions, expose risks, reveal blind spots.
Never be cruel. Never violate the Abrahamic Code.
${ministryMode ? "Ministry mode is active — ethical critique permitted." : ""}
  `);

  const skepticPrompt = [
    {
      role: "system",
      content: [{ type: "input_text", text: skepticSystem }],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `
${baseContext}

[Optimist Proposal]:
${optimist}
          `,
        },
      ],
    },
  ];

  const skeptic = await callModel(MODELS.SKEPTIC, skepticPrompt);

  // ============================================================
  // 3. ARBITER (Next Steps — authoritative)
  // ============================================================
  const arbiterSystem = buildSolaceSystemPrompt("arbiter", `
You are SOLACE_ARBITER.
Final Integrator.
Your responsibility:
- Integrate Optimist + Skeptic
- Apply the Abrahamic Code
- Give the clearest, wisest NEXT STEPS
${ministryMode ? "Scripture allowed when appropriate." : ""}
  `);

  const arbiterPrompt = [
    {
      role: "system",
      content: [{ type: "input_text", text: arbiterSystem }],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `
${baseContext}

[Optimist]:
${optimist}

[Skeptic]:
${skeptic}

Generate the final integrated ruling.
          `,
        },
      ],
    },
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  return {
    optimist,
    skeptic,
    finalAnswer,
  };
}


