//--------------------------------------------------------------
// SOLACE ORCHESTRATOR — CLEAN PASS-THROUGH
// Triad → Arbiter → Final Answer
//--------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

export async function orchestrateSolaceResponse(args: any) {
  try {
    const result = await runHybridPipeline(args);

    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl ?? null,

      // Expose triad for debugging UI if needed
      optimist: result.optimist ?? "",
      skeptic: result.skeptic ?? "",
      arbiter: result.arbiter ?? "",
    };

  } catch (err) {
    console.error("[ORCHESTRATOR ERROR]", err);

    return {
      finalAnswer: "[Hybrid pipeline error]",
      imageUrl: null,
      optimist: "",
      skeptic: "",
      arbiter: "",
    };
  }
}
