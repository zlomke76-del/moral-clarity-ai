// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Orchestrator (Thin Wrapper)
// Unified Hybrid Super-AI Pipeline
//--------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

/**
 * orchestrateSolaceResponse
 *
 * Returns:
 *   - finalAnswer
 *   - imageUrl
 *   - optimist
 *   - skeptic
 *   - arbiter
 *   - governorLevel       (passed through from route.ts)
 *   - governorInstructions (passed through from route.ts)
 */
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
      governorLevel,        // pass through
      governorInstructions, // pass through
    });

    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl ?? null,

      // These do NOT come from result — route controls them
      governorLevel,
      governorInstructions,

      optimist: result.optimist ?? "",
      skeptic: result.skeptic ?? "",
      arbiter: result.arbiter ?? "",
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
