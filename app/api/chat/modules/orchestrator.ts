// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Orchestrator (Thin Wrapper)
// Updated for unified Hybrid Super-AI Pipeline
// (Optimist → Skeptic → Arbiter + Governor)
//--------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

/**
 * orchestrateSolaceResponse
 *
 * IMPORTANT:
 * This must return the *entire* pipeline result object
 * so route.ts can read:
 *   - finalAnswer
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

    // Return the full object — DO NOT strip fields
    return result;

  } catch (err) {
    console.error("[ORCHESTRATOR] Pipeline failure:", err);

    return {
      finalAnswer: "[Hybrid pipeline error]",
      governorLevel: 0,
      governorInstructions: "",
      optimist: "",
      skeptic: "",
      arbiter: ""
    };
  }
}
