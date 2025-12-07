// app/api/chat/modules/orchestrator.ts
// ============================================================
// HYBRID SUPER-AI PIPELINE
// Optimist  →  Skeptic  →  Arbiter
// Founder Mode (single-pass, decisive)
// Ministry overlay supported via system prompt
// Guest mode gracefully downgraded
// ============================================================

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
  // ------------------------------------------------------------
  // 0. Guest mode — NO memory, NO hybrid
  // ------------------------------------------------------------
  if (context.guest) {
    const sys = buildSolaceSystemPrompt(
      "guidance",
      `
You are in GUEST MODE.
Memory features are disabled because the user is not signed in.
Avoid referencing missing memory. Do not attempt recall.

If the user asks you to remember something:
Say: "I can only remember things when you are signed in."
`
    );

    const prompt = [
      { role: "system", content: [{ type: "input_text", text: sys }] },
      {
        role: "user",
        content: [{ type: "input_text", text: `[User]: ${userMessage}` }],
      },
    ];

    const reply = await callModel(MODELS.ARBITER, prompt);
    return { optimist: null, skeptic: null, finalAnswer: reply };
  }

  // ------------------------------------------------------------
  // 1. Build Base Context Block (used by all agents)
  // ------------------------------------------------------------
  const personaName = context.persona || "Solace";

  const baseContext = `
[Persona]: ${personaName}
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
[Research Context]: ${JSON.stringify(
    context.researchContext || [],
    null,
    2
  )}

[Chat History]: ${JSON.stringify(history || [], null, 2)}

[Ministry Mode]: ${ministryMode ? "ON" : "OFF"}
[Founder Mode]: ${founderMode ? "ON" : "OFF"}
`;

  // ------------------------------------------------------------
  // 2. Founder Mode → Single decisive super-pass
  // ------------------------------------------------------------
  if (founderMode) {
    const founderPrompt = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: buildSolaceSystemPrompt(
              "founder",
              `
You are SOLACE_FOUNDER.
Direct, high-clarity reasoning.
Architect-level thinking.
No hedging. No soft qualifiers.
Still under the Abrahamic Code.
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

    const founderReply = await callModel(MODELS.ARBITER, founderPrompt);

    return {
      optimist: null,
      skeptic: null,
      finalAnswer: founderReply,
    };
  }

  // ------------------------------------------------------------
  // 3. OPTIMIST (Create Mode)
  // ------------------------------------------------------------
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
Expansive. Generative. Forward-looking.
Surface opportunities and creative paths.
Abrahamic Code applies.  
If ministryMode is ON → theological framing is allowed when *relevant*.
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

  // ------------------------------------------------------------
  // 4. SKEPTIC (Red Team)
  // ------------------------------------------------------------
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
Stress-test the Optimist.
Expose flaws, blind spots, risks.
Never be cruel. Never violate the Abrahamic Code.
If ministryMode ON → moral critique is allowed where relevant.
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

[Optimist Proposal]
${optimist}
`,
        },
      ],
    },
  ];

  const skeptic = await callModel(MODELS.SKEPTIC, skepticPrompt);

  // ------------------------------------------------------------
  // 5. ARBITER (Next Steps)
  // ------------------------------------------------------------
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
Final integrator.
Combine Optimist + Skeptic.
Deliver the clearest, wisest NEXT STEPS.
If ministryMode ON → integrate scripture meaningfully but sparingly.
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

[Optimist]
${optimist}

[Skeptic]
${skeptic}

Provide the final integrated ruling.
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


