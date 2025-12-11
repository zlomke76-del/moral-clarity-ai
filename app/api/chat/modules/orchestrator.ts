// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Orchestrator (Thin Wrapper)
// Updated for unified Hybrid Super-AI Pipeline
// (Optimist → Skeptic → Arbiter + Governor + Image Branch)
//--------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

/**
 * orchestrateSolaceResponse
 *
 * IMPORTANT:
 * This must return the *entire* pipeline result object
 * including:
 *   - finalAnswer
 *   - imageUrl
 *   - governorLevel
 *   - governorInstructions
 *   - optimist
 *   - skeptic
 *   - arbiter
 */
export async function orchestrateSolaceResponse({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,
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
    });

    // Return the full result object, INCLUDING imageUrl
    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl || null,
      governorLevel: result.governorLevel ?? 0,
      governorInstructions: result.governorInstructions ?? "",
      optimist: result.optimist ?? "",
      skeptic: result.skeptic ?? "",
      arbiter: result.arbiter ?? "",
    };

  } catch (err) {
    console.error("[ORCHESTRATOR] Pipeline failure:", err);

    return {
      finalAnswer: "[Hybrid pipeline error]",
      imageUrl: null,
      governorLevel: 0,
      governorInstructions: "",
      optimist: "",
      skeptic: "",
      arbiter: ""
    };
  }
}
