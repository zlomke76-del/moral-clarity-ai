// app/api/chat/modules/orchestrator.ts
//---------------------------------------------------------------
// Solace Orchestration Layer — FINAL FIXED VERSION
//---------------------------------------------------------------

import type { SolaceContextBundle } from "./assembleContext";
import { runHybridPipeline } from "./hybrid";

type OrchestratorInputs = {
  userMessage: string;
  context: SolaceContextBundle;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string | null; // ★ FIXED
};

//---------------------------------------------------------------
export async function orchestrateSolaceResponse(
  inputs: OrchestratorInputs
): Promise<string> {
  const {
    userMessage,
    context,
    history,
    ministryMode,
    modeHint,
    founderMode,
    canonicalUserKey,
  } = inputs;

  const hybridAllowed =
    modeHint === "Create" ||
    modeHint === "Red Team" ||
    modeHint === "Next Steps" ||
    founderMode;

  console.log("[ORCHESTRATOR] incoming:", {
    message: userMessage,
    modeHint,
    founderMode,
    ministryMode,
    canonicalUserKey,
  });

  if (hybridAllowed) {
    console.log("[ORCHESTRATOR] Running HYBRID pipeline…");

    const result = await runHybridPipeline({
      userMessage,
      context,
      history,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey, // now valid type
    });

    if (typeof result === "string") {
      return result || "[arbiter produced no text]";
    }

    if (result && typeof result === "object" && "finalAnswer" in result) {
      const finalAnswer = (result as any).finalAnswer as string | null;
      return finalAnswer?.trim() ? finalAnswer : "[arbiter produced no text]";
    }

    return "[arbiter produced no text]";
  }

  console.log("[ORCHESTRATOR] Hybrid not allowed for this mode.");
  return "[hybrid pipeline is disabled for this mode]";
}

