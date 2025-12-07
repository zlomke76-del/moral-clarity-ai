// app/api/chat/modules/orchestrator.ts
// -------------------------------------------------------------
// Solace Hybrid Pipeline
// (Optimist → Skeptic → Arbiter)
// Founder Mode override supported.
// Ministry Mode supported.
// -------------------------------------------------------------

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

/**
 * runHybridPipeline()
 * Runs 2–3 LLM passes depending on mode:
 *
 *  - Optimist  (Create)
 *  - Skeptic   (Red Team)
 *  - Arbiter   (Next Steps — final authority)
 *
 * Founder Mode → bypasses Optimist/Skeptic
 * and produces a single decisive founder-grade answer.
 */
export async function runHybridPipeline({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,
}: {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string; // NEW
}) {

  // -------------------------------------------------------------
  // BASE CONTEXT FOR ALL AGENTS
  // -------------------------------------------------------------
  const baseContext = `
[Persona]: ${context.persona || "Solace"}

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
`;

  // -------------------------------------------------------------
  // FOUNDER MODE: Single decisive pass
  // -------------------------------------------------------------
  if (founderMode) {
    const founderPrompt = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: buildSolaceSystemPrompt(
              "founder",
              "Founder mode: Maximum clarity. No hedging. Strategic truth only."
            ),
          },
        ],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: baseContext }],
      },
    ];

    const founderReply = await callModel(MODELS.ARBITER, founderPrompt); // arbiter = most decisive
    return {
      optimist: null,
      skeptic: null,
      finalAnswer: founderReply,
    };
  }

  // =============================================================
  // 1. OPTIMIST (Create)
  // =============================================================
  const optimistPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt(
            "optimist",
            `
You are SOLACE_OPTIMIST.
Expansive, creative, forward-looking.
Goal: propose viable paths and opportunities.
${ministryMode ? "MINISTRY ACTIVE: Faith framing permitted." : ""}
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

  // =============================================================
  // 2. SKEPTIC (Red Team)
  // =============================================================
  const skepticPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt(
            "skeptic",
            `
You are SOLACE_SKEPTIC.
Your role: stress test the Optimist’s ideas.
Identify risks, blind spots, flaws.
Never cynical. Never cruel.
${ministryMode ? "MINISTRY ACTIVE: Ethical scrutiny allowed." : ""}
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

  // =============================================================
  // 3. ARBITER (Next Steps — FINAL)
  // =============================================================
  const arbiterPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt(
            "arbiter",
            `
You are SOLACE_ARBITER.
Goal: Integrate Optimist + Skeptic.
Produce the clearest NEXT STEPS.
Final authority.
${ministryMode ? "MINISTRY ACTIVE: Apply Scripture sparingly when relevant." : ""}
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

Generate the final integrated ruling.
`,
        },
      ],
    },
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  // Return the 3-agent composite
  return {
    optimist,
    skeptic,
    finalAnswer,
  };
}


