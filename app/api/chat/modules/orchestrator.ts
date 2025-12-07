// app/api/chat/modules/orchestrator.ts

/**
 * Super-AI Hybrid Pipeline
 * ---------------------------------------------
 * Solace runs THREE AGENTS on every non-neutral request:
 *
 * 1. OPTIMIST  → Create Mode (generative expansion)
 * 2. SKEPTIC   → Red Team Mode (risk, critique, adversarial reasoning)
 * 3. ARBITER   → Next Steps Mode (final integrated ruling)
 *
 * All three agents run through OpenAI *today*.
 * LLM slots are preserved for future multi-model routing.
 */

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

type PipelineArgs = {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  modeHint: string;     // Create | Red Team | Next Steps
  founderMode: boolean; // reserved for future governance model
};

export async function runHybridPipeline({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
}: PipelineArgs) {
  // --------------------------------------------
  // PREPARE CONTEXT BLOCK (identical across all 3 agents)
  // --------------------------------------------
  const persona = context.persona || "Solace";

  const baseContext = `
[Persona]: ${persona}
[User Message]: ${userMessage}

[User Memories]: ${JSON.stringify(
    context.memoryPack.userMemories || [],
    null,
    2
  )}

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

[Ministry Mode]: ${ministryMode ? "ON" : "OFF"}
[Founder Mode]: ${founderMode ? "ON" : "OFF"}
  `;

  // =======================================================================================
  // 1. OPTIMIST — GENERATIVE EXPANSION (Create Mode)
  // =======================================================================================

  const optimistPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt(
            "guidance",
            `
You are SOLACE_OPTIMIST.

Your role:
- Expand possibility space.
- Generate opportunities, options, and forward pathways.
- Assume goodwill, assume solvability.
- Help the user see what *could* be.

Constraints:
- Never violate the Abrahamic Code.
- Ministry mode ON → You may add gentle theological/metaphorical lift when useful.
- Founder mode ON → Favor more strategic, long-horizon reasoning.
`
          ),
        },
      ],
    },
    {
      role: "user",
      content: [{ type: "input_text", text: baseContext }],
    },
  ];

  const optimist = await callModel(MODELS.OPTIMIST, optimistPrompt);

  // =======================================================================================
  // 2. SKEPTIC — RED TEAM (Critical Adversary)
  // =======================================================================================

  const skepticPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt(
            "guidance",
            `
You are SOLACE_SKEPTIC.

Your role:
- Challenge assumptions.
- Identify blind spots.
- Stress-test feasibility.
- Detect risk, bias, missing variables.
- Provide the counterweight to optimism.

Constraints:
- Never demean the user.
- Never break the Abrahamic Code.
- Ministry mode ON → You may provide ethical warnings rooted in scripture or moral tradition.
- Founder mode ON → Apply higher scrutiny to long-horizon strategic choices.
`
          ),
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

  // =======================================================================================
  // 3. ARBITER — FINAL RULING (Next Steps)
  // =======================================================================================

  const arbiterPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt(
            "guidance",
            `
You are SOLACE_ARBITER.

Your role:
- Weigh Optimist and Skeptic.
- Resolve tensions.
- Apply Abrahamic Code.
- Produce the *final grounded ruling*.
- Deliver practical NEXT STEPS, not theory.
- Keep the user’s dignity and agency central.

Ministry mode ON → Quote appropriate scripture when meaningful.
Founder mode ON → Elevate strategic clarity and risk governance.
`
          ),
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

As Solace_Arbiter, integrate both and deliver the final ruling.
          `,
        },
      ],
    },
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  // --------------------------------------------
  // RETURN STRUCTURED PIPELINE RESULT
  // --------------------------------------------
  return {
    optimist,
    skeptic,
    finalAnswer,
  };
}
