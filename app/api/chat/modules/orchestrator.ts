// app/api/chat/modules/orchestrator.ts
// HYBRID PIPELINE — CORRECTED TO USE FULL SOLACE PERSONA

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * MAIN HYBRID PIPELINE
 * Optimist → Skeptic → Arbiter
 * All inherit the full Abrahamic Code + Solace Identity
 */

export async function runHybridPipeline({
  userMessage,
  context,
  history,
  ministryMode,
  founderMode,
  modeHint
}: {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  founderMode: boolean;
  modeHint: string;
}) {
  // ------------------------------------------
  // Build Memory / Context Block
  // ------------------------------------------
  const memoryBlock = `
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

[Flags]:
- Ministry: ${ministryMode}
- Founder Mode: ${founderMode}
- Mode Hint: ${modeHint}
`;

  // ============================================================
  // 1. OPTIMIST (Create Mode)
  // ============================================================

  const optimistSystem = buildSolaceSystemPrompt(
    "optimist",
    ministryMode
      ? "Ministry mode ON: apply scripture gently & only when meaningful."
      : ""
  );

  const optimistPrompt = [
    {
      role: "system",
      content: [{ type: "input_text", text: optimistSystem }]
    },
    {
      role: "user",
      content: [{ type: "input_text", text: memoryBlock }]
    }
  ];

  const optimist = await callModel(MODELS.OPTIMIST, optimistPrompt);

  // ============================================================
  // 2. SKEPTIC (Red Team)
  // ============================================================

  const skepticSystem = buildSolaceSystemPrompt(
    "skeptic",
    ministryMode
      ? "Ministry mode ON: ethical critique allowed where relevant."
      : ""
  );

  const skepticPrompt = [
    {
      role: "system",
      content: [{ type: "input_text", text: skepticSystem }]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `${memoryBlock}

[Optimist Proposal]:
${optimist}`
        }
      ]
    }
  ];

  const skeptic = await callModel(MODELS.SKEPTIC, skepticPrompt);

  // ============================================================
  // 3. ARBITER (Next Steps)
  // ============================================================

  const arbiterSystem = buildSolaceSystemPrompt(
    "arbiter",
    ministryMode
      ? "Ministry mode ON: include scripture only when directly useful."
      : founderMode
      ? "Founder mode ON: maximum clarity, direct truth, decisive architecture."
      : ""
  );

  const arbiterPrompt = [
    {
      role: "system",
      content: [{ type: "input_text", text: arbiterSystem }]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `${memoryBlock}

[Optimist]:
${optimist}

[Skeptic]:
${skeptic}

Integrate these into a single, clear, morally aligned NEXT STEPS answer.`
        }
      ]
    }
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  return {
    optimist,
    skeptic,
    finalAnswer
  };
}

