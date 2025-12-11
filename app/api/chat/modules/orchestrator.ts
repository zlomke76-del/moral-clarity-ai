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
 * Returns the *entire* pipeline result object:
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
  governorLevel,          // ✅ REQUIRED
  governorInstructions,   // ✅ REQUIRED
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
      governorLevel,        // ✅ Pass into hybrid pipeline
      governorInstructions, // ✅ Pass into hybrid pipeline
    });

    // Return the full structured result
    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl ?? null,
      governorLevel: result.governorLevel ?? governorLevel ?? 0,
      governorInstructions: result.governorInstructions ?? governorInstructions ?? "",
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
