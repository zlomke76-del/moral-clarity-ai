// app/api/chat/modules/orchestrator.ts
//---------------------------------------------------------------
// Solace Orchestration Layer
// Chooses between:
//   - Hybrid Pipeline (Optimist → Skeptic → Arbiter)
//   - Single-model neutral inference
//
// This module is the conductor called by route.ts
//---------------------------------------------------------------

import type { SolaceContextBundle } from "./assembleContext";
import { runHybridPipeline } from "./hybrid"; // NEW unified pipeline

const OAI_URL = "https://api.openai.com/v1/responses";
const OAI_KEY = process.env.OPENAI_API_KEY;

//---------------------------------------------------------------
// Types
//---------------------------------------------------------------
export type OrchestratorInputs = {
  userMessage: string;
  context: SolaceContextBundle;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string;
};

//---------------------------------------------------------------
// Helper for neutral mode call
//---------------------------------------------------------------
async function callNeutralModel(blocks: any[]): Promise<string> {
  const res = await fetch(OAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      input: blocks,
    }),
  });

  const json = await res.json();
  const block = json?.output?.[0]?.content?.[0];
  return block?.text || "[No reply]";
}

//---------------------------------------------------------------
// MAIN ORCHESTRATION FUNCTION
//---------------------------------------------------------------
export async function orchestrateSolaceResponse(inputs: OrchestratorInputs) {
  const {
    userMessage,
    context,
    history,
    ministryMode,
    modeHint,
    founderMode,
    canonicalUserKey,
  } = inputs;

  //-------------------------------------------------------------
  // Determine if hybrid mode should run
  //-------------------------------------------------------------
  const hybridAllowed =
    modeHint === "Create" ||
    modeHint === "Red Team" ||
    modeHint === "Next Steps" ||
    founderMode;

  //-------------------------------------------------------------
  // DEBUGGING (safe — logs only)
  //-------------------------------------------------------------
  console.log("[ORCHESTRATOR] incoming:", {
    message: userMessage,
    modeHint,
    founderMode,
    ministryMode,
    canonicalUserKey,
  });

  //-------------------------------------------------------------
  // HYBRID MODE
  //-------------------------------------------------------------
  if (hybridAllowed) {
    console.log("[ORCHESTRATOR] Running HYBRID pipeline…");

    const { finalAnswer } = await runHybridPipeline({
      userMessage,
      context,
      history,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey,
    });

    // ✅ ALWAYS return an object
    return {
      finalAnswer: finalAnswer || "[arbiter produced no text]",
    };
  }

  //-------------------------------------------------------------
  // NEUTRAL MODE (single-model)
  //-------------------------------------------------------------
  console.log("[ORCHESTRATOR] Running NEUTRAL mode…");

  const blocks = (context as any).systemPromptBlocks || [];
  const neutralText = await callNeutralModel(blocks);

  // ✅ ALWAYS return an object
  return {
    finalAnswer: neutralText,
  };
}


