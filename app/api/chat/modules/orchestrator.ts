// app/api/chat/modules/orchestrator.ts
// -----------------------------------------------------------
// Solace Hybrid Pipeline
// Optimist → Skeptic → Arbiter
// Founder + Ministry overrides supported
// -----------------------------------------------------------

import type { SolaceContextBundle } from "./assembleContext";
import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

export interface HybridArgs {
  userMessage: string;
  context: SolaceContextBundle;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
}

export interface HybridResult {
  optimist: string | null;
  skeptic: string | null;
  finalAnswer: string;
}

// -----------------------------------------------------------
// INTERNAL — Build base context block for all 3 agents
// -----------------------------------------------------------
function buildBaseContext(userMessage: string, context: SolaceContextBundle, history: any[]) {
  return `
[User Message]: ${userMessage}

[User Memories]: ${JSON.stringify(context.memoryPack.userMemories || [], null, 2)}

[Episodic Memories]: ${JSON.stringify(
    context.memoryPack.episodicMemories || [],
    null,
    2
  )}

[Autobiography]: ${JSON.stringify(context.memoryPack.autobiography || {}, null, 2)}

[News Digest]: ${JSON.stringify(context.newsDigest || [], null, 2)}

[Research Context]: ${JSON.stringify(context.researchContext || [], null, 2)}

[Chat History]: ${JSON.stringify(history || [], null, 2)}
  `;
}

// -----------------------------------------------------------
// HYBRID PIPELINE EXECUTION
// -----------------------------------------------------------
export async function runHybridPipeline(args: HybridArgs): Promise<HybridResult> {
  const { userMessage, context, history, ministryMode, modeHint, founderMode } = args;

  const baseContext = buildBaseContext(userMessage, context, history);

  const ministryExtra = ministryMode
    ? "Ministry mode active — integrate Scripture sparingly and respectfully when relevant."
    : "";

  // ---------------------------------------------------------
  // 1. OPTIMIST — Create Mode
  // ---------------------------------------------------------
  const optimistSystem = buildSolaceSystemPrompt(
    "optimist",
    `
You are SOLACE_OPTIMIST.
Creative, expansive, generative.
Your job: explore possibilities without violating the Abrahamic Code.
${ministryExtra}
`
  );

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

  // ---------------------------------------------------------
  // 2. SKEPTIC — Red Team Mode
  // ---------------------------------------------------------
  const skepticSystem = buildSolaceSystemPrompt(
    "skeptic",
    `
You are SOLACE_SKEPTIC.
Critical evaluator. Identify flaws, risks, blind spots.
Challenge optimist ideas constructively.
${ministryExtra}
`
  );

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
          text: `${baseContext}

[Optimist Proposal]:
${optimist}
          `,
        },
      ],
    },
  ];

  const skeptic = await callModel(MODELS.SKEPTIC, skepticPrompt);

  // ---------------------------------------------------------
  // 3. ARBITER — Final Next Steps
  // ---------------------------------------------------------
  const arbiterSystem = buildSolaceSystemPrompt(
    "arbiter",
    `
You are SOLACE_ARBITER.
You synthesize Optimist + Skeptic.
Founder mode: if enabled, be maximally direct, precise, architecture-oriented.
${founderMode ? "Founder Mode ON — apply maximum clarity and decisiveness." : ""}
${ministryExtra}
`
  );

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
          text: `${baseContext}

[Optimist]:
${optimist}

[Skeptic]:
${skeptic}

Produce the final integrated ruling with clarity and stewardship.
          `,
        },
      ],
    },
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  return {
    optimist,
    skeptic,
    finalAnswer: finalAnswer ?? "[Arbiter produced no output]",
  };
}

