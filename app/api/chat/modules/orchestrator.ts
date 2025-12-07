// app/api/chat/modules/orchestrator.ts

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * HYBRID PIPELINE (Optimist → Skeptic → Arbiter)
 *
 * All three agents run through OpenAI today.
 * Placeholders exist for future LLM swapping.
 */

export async function runHybridPipeline({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
}: {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
}) {
  // Prepare memory blocks
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
`;

  // -----------------------------------------------------------------
  // 1. OPTIMIST (Create Mode)
  // -----------------------------------------------------------------
  const optimistPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("guidance", `
You are now SOLACE_OPTIMIST.
Creative, generative, expansive.
You propose possibilities, opportunities, and forward growth.
Never violate the Abrahamic Code.
If ministry mode is active, you may apply theological framing when relevant.
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

  // -----------------------------------------------------------------
  // 2. SKEPTIC (Red Team)
  // -----------------------------------------------------------------
  const skepticPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("guidance", `
You are now SOLACE_SKEPTIC.
Your job:
- Challenge assumptions
- Identify risks, blind spots, logical flaws
- Stress-test the Optimist's reasoning
Never be cruel. Never break the Abrahamic Code.
Ministry mode: ethical or theological critique allowed if relevant.
          `),
        },
      ],
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

  // -----------------------------------------------------------------
  // 3. ARBITER (Next Steps)
  // -----------------------------------------------------------------
  const arbiterPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("guidance", `
You are now SOLACE_ARBITER.
Your role:
- Integrate Optimist (Create) + Skeptic (Red Team)
- Apply the Abrahamic Code
- Provide final grounded NEXT STEPS for the user
- You decide the clearest, wisest path forward.
If ministry mode is ON → integrate Scripture appropriately.
Never overwhelm; remain steady, concise, and morally grounded.
          `),
        },
      ],
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
