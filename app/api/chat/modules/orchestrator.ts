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
    const result: any = await runHybridPipeline({
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

    // Casting result as `any` above guarantees TS won't choke
    return {
      finalAnswer: result.finalAnswer,
      imageUrl: result.imageUrl ?? null,

      governorLevel,
      governorInstructions,

      // Triad (safe even if undefined)
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

