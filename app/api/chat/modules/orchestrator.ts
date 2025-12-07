// app/api/chat/modules/orchestrator.ts

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * HYBRID PIPELINE (Optimist → Skeptic → Arbiter)
 *
 * - Optimist generates possibilities (Create Mode)
 * - Skeptic challenges assumptions (Red Team)
 * - Arbiter integrates both → final, grounded Next Steps
 *
 * All stages run through OpenAI today.
 * Future LLMs drop into MODELS.* transparently.
 */

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
  // ============================================================================
  // BASE CONTEXT BLOCK (Memory, persona, news, research, chat history)
  // ============================================================================
  const persona = context.persona || "Solace";

  const baseContext = `
[Persona]: ${persona]
[User message]: ${userMessage}

[User Memories]:
${JSON.stringify(context.memoryPack.userMemories || [], null, 2)}

[Episodic Memories]:
${JSON.stringify(context.memoryPack.episodicMemories || [], null, 2)}

[Autobiography]:
${JSON.stringify(context.memoryPack.autobiography || {}, null, 2)}

[News Digest]:
${JSON.stringify(context.newsDigest || [], null, 2)}

[Research Context]:
${JSON.stringify(context.researchContext || [], null, 2)}

[Chat History]:
${JSON.stringify(history || [], null, 2)}
`;

  // ============================================================================
  // 0. FOUNDER MODE (bypass hybrid pipeline)
  // ============================================================================
  if (founderMode) {
    const founderPrompt = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: buildSolaceSystemPrompt("guidance", `
You are Solace in FOUNDER MODE.

Founder Mode rules:
- Maximum directness.
- No hedging.
- No emotional padding.
- Prioritize architectural clarity, system truth, and actionable output.
- You may bypass normal guardrails when the founder explicitly requests it.
- Still follow the Abrahamic Code (truth, accountability, stewardship).
`),
          },
        ],
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: baseContext }
        ],
      },
    ];

    const founderReply = await callModel(MODELS.FOUNDER, founderPrompt);
    return {
      optimist: null,
      skeptic: null,
      finalAnswer: founderReply,
    };
  }

  // ============================================================================
  // 1. OPTIMIST — CREATE MODE (Generative, Expansive)
  // ============================================================================
  const optimistPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("guidance", `
You are SOLACE_OPTIMIST.
Creative, generative, future-oriented.
Expand possibilities without violating the Abrahamic Code.

Ministry mode active: ${ministryMode ? "YES" : "NO"}
If YES → you may incorporate gentle theological framing when relevant.
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

  // ============================================================================
  // 2. SKEPTIC — RED TEAM MODE (Adversarial but Ethical)
  // ============================================================================
  const skepticPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("guidance", `
You are SOLACE_SKEPTIC.
Role:
- Identify risks
- Challenge assumptions
- Stress-test logic
- Reveal blind spots

NEVER be cruel. NEVER violate the Abrahamic Code.
Ministry mode: theological/ethical critique permitted when relevant.
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

[Optimist Proposal]
${optimist}
        `,
        },
      ],
    },
  ];

  const skeptic = await callModel(MODELS.SKEPTIC, skepticPrompt);

  // ============================================================================
  // 3. ARBITER — NEXT STEPS MODE (Final Ruling)
  // ============================================================================
  const arbiterPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("guidance", `
You are SOLACE_ARBITER.
Your responsibilities:
- Integrate Optimist + Skeptic
- Apply the Abrahamic Code faithfully
- Produce final, grounded NEXT STEPS
- Deliver the clearest path forward

Ministry mode: ${ministryMode ? "ON — integrate Scripture where relevant." : "OFF — stay secular."}
Never overwhelm; be structured, concise, and morally anchored.
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

[Optimist]
${optimist}

[Skeptic]
${skeptic}

Generate the integrated final ruling.
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

