// app/api/chat/modules/orchestrator.ts
//---------------------------------------------------------------
// Solace Orchestration Engine
// Hybrid Pipeline (Optimist → Skeptic → Arbiter) + Neutral Mode
// Updated for Unified Memory Model (facts / episodic / autobio)
//---------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";
import type { SolaceContextBundle } from "./assembleContext";

export async function orchestrateSolaceResponse({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,
}: {
  userMessage: string;
  context: SolaceContextBundle;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string;
}) {
  //-------------------------------------------------------------
  // LOGGING — MINIMAL (Option A)
  //-------------------------------------------------------------
  try {
    console.log("[Solace Context Snapshot]", {
      user: canonicalUserKey,
      facts_count: context.memoryPack.facts?.length ?? 0,
      episodic_count: context.memoryPack.episodic?.length ?? 0,
      autobio_count: context.memoryPack.autobiography?.length ?? 0,
      news_count: context.newsDigest?.length ?? 0,
      research_count: context.researchContext?.length ?? 0,
    });
  } catch (err) {
    console.warn("[orchestrator logging failed]", err);
  }

  //-------------------------------------------------------------
  // DETERMINE DOMAIN
  //-------------------------------------------------------------
  const hybridAllowed =
    founderMode ||
    modeHint === "Create" ||
    modeHint === "Red Team" ||
    modeHint === "Next Steps";

  //-------------------------------------------------------------
  // HYBRID PIPELINE MODE
  //-------------------------------------------------------------
  if (hybridAllowed) {
    const { finalAnswer } = await runHybridPipeline({
      userMessage,
      context,
      history,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey,
    });

    return (
      finalAnswer ||
      "[No arbiter answer produced. Hybrid pipeline reached empty output.]"
    );
  }

  //-------------------------------------------------------------
  // NEUTRAL MODE — Single step inference
  //-------------------------------------------------------------
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "Solace — Neutral Guidance Mode. Provide accurate, grounded, concise support.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "text", text: userMessage }],
        },
      ],
    }),
  });

  const json = await response.json();
  const block = json.output?.[0]?.content?.[0];
  return block?.text ?? "[No reply produced in neutral mode]";
}

