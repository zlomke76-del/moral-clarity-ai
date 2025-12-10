// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Orchestrator (Thin Wrapper)
// Updated for new unified Hybrid Super-AI Pipeline
// (Optimist → Skeptic → Arbiter + Governor)
//--------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

/**
 * orchestrateSolaceResponse
 *
 * This is now a lightweight forwarder that hands all control
 * to the unified Hybrid Pipeline. It preserves legacy signature
 * compatibility but no longer performs any internal stage logic.
 *
 * All research-awareness, pacing, governor behavior,
 * and stage synthesis live inside hybrid.ts.
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

    return result?.finalAnswer || "[Hybrid pipeline returned empty output]";
  } catch (err) {
    console.error("[ORCHESTRATOR] Pipeline failure:", err);
    return "[Hybrid pipeline error]";
  }
}
