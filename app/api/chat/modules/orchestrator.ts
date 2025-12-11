// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Orchestrator — Thin Wrapper for Hybrid Pipeline
//--------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

export async function orchestrateSolaceResponse({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,
  governorLevel,
  governorInstructions,
}: any) {
  try {
    const result: any = await runHybridPipeline({
      userMessage,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,
      governorLevel,
      governorInstructions,
    });

    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl ?? null,

      governorLevel,
      governorInstructions,

      optimist: result?.optimist ?? "",
      skeptic: result?.skeptic ?? "",
      arbiter: result?.arbiter ?? "",
    };
  } catch (err) {
    console.error("[ORCHESTRATOR] Pipeline failure:", err);

    return {
      finalAnswer: "[Hybrid pipeline error]",
      imageUrl: null,
      governorLevel,
      governorInstructions,
      optimist: "",
      skeptic: "",
      arbiter: "",
    };
  }
}
