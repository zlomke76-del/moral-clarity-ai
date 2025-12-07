// app/api/chat/modules/orchestrator.ts
// ============================================================
// HYBRID SUPER-AI PIPELINE
// (Optimist → Skeptic → Arbiter)
// Founder Mode = Arbiter with elevated clarity
// Ministry Mode = Theological layer (controlled)
// ============================================================

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * Hybrid pipeline: three-agent reasoning loop
 *
 * NOTE:
 * - NO canonicalUserKey is used here.
 * - Identity is irrelevant inside the cognitive pipeline.
 * - Memory writes happen AFTER the pipeline completes.
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
  // ------------------------------------------------------------
  // BASE CONTEXT FED INTO ALL SUB-AGENTS
  // ------------------------------------------------------------
  const persona = context.persona || "Solace";

  const baseContext = `
[Persona]: ${persona}

[User Message]:
${userMessage}

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
`.trim();

  // ============================================================
  // 1) OPTIMIST — GENERATIVE / POSSIBILITY LENS
  // ============================================================
  const optimistPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("optimist", `
You are SOLACE_OPTIMIST.
Generative, expansive, opportunity-focused.
Offer possibilities, directions, and creative paths.
Never violate the Abrahamic Code.
Ministry mode: you may apply gentle ethical or scriptural framing if relevant.
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


  // ============================================================
  // 2) SKEPTIC — RED TEAM / RISK LENS
  // ============================================================
  const skepticPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("skeptic", `
You are SOLACE_SKEPTIC.
Expose risks, contradictions, missing assumptions.
Challenge the Optimist's reasoning with precision and fairness.
Never be cruel. Never violate the Abrahamic Code.
Ministry mode: offer ethical critique where appropriate.
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


  // ============================================================
  // 3) ARBITER — FINAL INTEGRATION AND NEXT STEPS
  // ============================================================
  const arbiterPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("arbiter", `
You are SOLACE_ARBITER.
Final judge and integrator.
Combine:
 • Optimist (Create)
 • Skeptic (Red Team)
Apply the Abrahamic Code.
Deliver clear, grounded NEXT STEPS.
Founder mode: be more decisive, architectural, truth-forward.
Ministry mode: integrate Scripture sparingly when meaningful.
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

Produce the final integrated ruling.
          `,
        },
      ],
    },
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  // ============================================================
  // RETURN ALL SUBOUTPUTS (ARBITER IS AUTHORITATIVE)
  // ============================================================
  return {
    optimist,
    skeptic,
    finalAnswer,
  };
}

