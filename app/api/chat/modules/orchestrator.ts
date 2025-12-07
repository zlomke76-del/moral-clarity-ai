// app/api/chat/modules/orchestrator.ts
// =====================================================================
// HYBRID PIPELINE — Optimist → Skeptic → Arbiter
// Solace Abrahamic Code + Domain Lenses + Memory Blocks
// Supports founderMode + ministryMode + modeHint
// =====================================================================

import { callModel, MODELS } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// Types --------------------------------------------------------

export interface HybridPipelineArgs {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
}

// Utility: stringify memory safely ------------------------------

function block(label: string, data: any): string {
  try {
    return `[${label}]: ${JSON.stringify(data ?? null, null, 2)}\n`;
  } catch {
    return `[${label}]: [unserializable]\n`;
  }
}

// =====================================================================
// HYBRID PIPELINE
// =====================================================================

export async function runHybridPipeline(args: HybridPipelineArgs) {
  const {
    userMessage,
    context,
    history,
    ministryMode,
    modeHint,
    founderMode,
  } = args;

  const persona = context.persona || "Solace";

  // -------------------------------------------------------------------
  // BASE CONTEXT BLOCK (passed to all three agents)
  // -------------------------------------------------------------------
  const baseContext = `
[Persona]: ${persona}

[User Message]: ${userMessage}

${block("User Memories", context.memoryPack.userMemories)}
${block("Episodic Memories", context.memoryPack.episodicMemories)}
${block("Autobiography", context.memoryPack.autobiography)}
${block("News Digest", context.newsDigest)}
${block("Research Context", context.researchContext)}
${block("Chat History", history)}
`;

  // ===================================================================
  // 0. FOUNDER MODE SHORT-CIRCUIT
  // ===================================================================
  if (founderMode) {
    const founderPrompt = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: buildSolaceSystemPrompt("founder", `
You are in FOUNDER MODE.
Maximum clarity. No hedging. Architectural truth.
You operate under the Abrahamic Code fully.
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

Generate a direct, founder-level answer with no softening.
          `,
          },
        ],
      },
    ];

    const founderReply = await callModel(MODELS.ARBITER, founderPrompt);

    return {
      optimist: null,
      skeptic: null,
      finalAnswer: founderReply ?? "[no founder answer]",
    };
  }

  // ===================================================================
  // 1. OPTIMIST (Create Mode)
  // ===================================================================
  const optimistPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("optimist", `
You are SOLACE_OPTIMIST.
Expansive. Generative. Opportunity-focused.
Never violate the Abrahamic Code.
MinistryMode = ${ministryMode}.
If ministry mode is active, incorporate spiritual framing gently when relevant.
        `),
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: baseContext,
        },
      ],
    },
  ];

  const optimist = await callModel(MODELS.OPTIMIST, optimistPrompt);

  // ===================================================================
  // 2. SKEPTIC (Red Team)
  // ===================================================================
  const skepticPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("skeptic", `
You are SOLACE_SKEPTIC.
Critical thinker. Identify blind spots, risks, faulty logic.
Challenge without cruelty.
Always aligned to Abrahamic Code.
MinistryMode = ${ministryMode}.
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

  // ===================================================================
  // 3. ARBITER (Next Steps)
  // ===================================================================
  const arbiterPrompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: buildSolaceSystemPrompt("arbiter", `
You are SOLACE_ARBITER.
Final integrator.
Combine Optimist + Skeptic.
Provide clear NEXT STEPS based on the Abrahamic Code.
If ministryMode is ON → include appropriate scripture or spiritual grounding.
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

Generate the integrated ruling.
        `,
        },
      ],
    },
  ];

  const finalAnswer = await callModel(MODELS.ARBITER, arbiterPrompt);

  // ===================================================================
  // RETURN HYBRID OUTPUTS
  // ===================================================================
  return {
    optimist,
    skeptic,
    finalAnswer,
  };
}


