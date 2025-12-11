// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Orchestrator (Thin Wrapper)
// Hybrid Super-AI Pipeline (Opt → Skep → Arbiter)
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
    const result = await runHybridPipeline({
      userMessage,
      context,
      history,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey,
      governorLevel,
      governorInstructions,
    });

    // NOTE:
    // runHybridPipeline *may or may not* return optimist/skeptic/arbiter.
    // So we do NOT read them off `result` unless they exist.

    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl ?? null,

      // These always come from route.ts
      governorLevel,
      governorInstructions,

      // Triad components (if present)
      optimist: result.optimist || "",
      skeptic: result.skeptic || "",
      arbiter: result.arbiter || "",
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
