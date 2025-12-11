//--------------------------------------------------------------
// Solace Orchestrator — Hybrid Super-AI Pipeline (Final)
//--------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

export async function orchestrateSolaceResponse(args: any) {
  try {
    const result = await runHybridPipeline(args);

    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl ?? null,
      optimist: result.optimist,
      skeptic: result.skeptic,
      arbiter: result.arbiter,
    };

  } catch (err) {
    console.error("[ORCHESTRATOR] Pipeline failure:", err);

    return {
      finalAnswer: "[Hybrid pipeline error]",
      imageUrl: null,
      optimist: "",
      skeptic: "",
      arbiter: "",
    };
  }
}
