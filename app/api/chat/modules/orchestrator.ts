// app/api/chat/modules/orchestrator.ts
// -----------------------------------------------------------------------------
// Solace Hybrid Pipeline (Optimist → Skeptic → Arbiter)
// Domain-aware, ministry-aware, founder-aware orchestration
// All models = OpenAI today, but structure supports future multi-LLM routing.
// -----------------------------------------------------------------------------

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

export async function runHybridPipeline({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
}: {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
}) {
  // ---------------------------------------------------------
  // 1. PREPARE CONTEXT BLOCK
  // ---------------------------------------------------------
  const persona = context.persona || "Solace";

  const baseContext = `
[Persona]: ${persona}
[User message]: ${userMessage}

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
`.trim();

  // ---------------------------------------------------------
  // FOUNDER MODE OVERRIDE — Arbiter determines the final truth
  // ---------------------------------------------------------
  if (founderMode) {
    const founderPrompt = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: buildSolaceSystemPrompt("founder", `
You are in FOUNDER MODE.
Maximum clarity, architectural truth, no hedging.
Still governed by the Abrahamic Code.
          `),
          },
        ],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: baseContext }],
      },
    ];

    const founderReply = await callModel(MODELS.ARBITER, founderPrompt);

    return {
      optimist: null,
      skeptic: null,
      finalAnswer: founderReply,
    };
  }

  // ---------------------------------------------------------
  // 2. OPTIMIST (Create Mode)
  // ---------------------------------------------------------
  const optimistPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("optimist", `
You are SOLACE_OPTIMIST.
Expansive, generative, opportunity-focused.
Never violate the Abrahamic Code.
Ministry mode: apply theological framing only if relevant.
        `),
        },
      ],
    },
    {
      role: "user",
      content: [{ type: "input_text", text: baseContext }],
    },
  ];

  const optimist = await callModel(MODELS.OPTIMIST, optimistPrompt);

  // ---------------------------------------------------------
  // 3. SKEPTIC (Red Team)
  // ---------------------------------------------------------
  const skepticCtx = `
${baseContext}

[Optimist Proposal]:
${optimist}
  `;

  const skepticPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("skeptic", `
You are SOLACE_SKEPTIC.
Expose risks, flaws, blind spots.
Challenge without cruelty.
Never break the Abrahamic Code.
        `),
        },
      ],
    },
    {
      role: "user",
      content: [{ type: "input_text", text: skepticCtx }],
    },
  ];

  const skeptic = await callModel(MODELS.SKEPTIC, skepticPrompt);

  // ---------------------------------------------------------
  // 4. ARBITER (Next Steps)
  // ---------------------------------------------------------
  const arbiterCtx = `
${baseContext}

[Optimist]:
${optimist}

[Skeptic]:
${skeptic}

Generate the final integrated ruling.
  `;

  const arbiterPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("arbiter", `
You are SOLACE_ARBITER.
Integrate Optimist + Skeptic.
Deliver the clearest, morally grounded NEXT STEPS.
Ministry mode: apply Scripture sparingly, respectfully, and only when relevant.
        `),
        },
      ],
    },
    {
      role: "user",
      content: [{ type: "input_text", text: arbiterCtx }],
    },
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  // ---------------------------------------------------------
  // 5. RETURN ALL TIERS (for debugging or UI transparency)
  // ---------------------------------------------------------
  return {
    optimist,
    skeptic,
    finalAnswer,
  };
}

