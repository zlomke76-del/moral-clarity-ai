// app/api/chat/modules/orchestrator.ts

import { runHybridPipeline } from "./hybrid";
import type { SolaceContextBundle } from "./assembleContext";

export async function orchestrateSolaceResponse({
  message,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,
}: {
  message: string;
  context: SolaceContextBundle;
  history: Array<{ role: string; content: string }>;
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string; // REQUIRED
}) {
  // -------------------------------------------------------------------
  // Hard validation — prevents “undefined canonicalUserKey” model bugs
  // -------------------------------------------------------------------
  if (!canonicalUserKey) {
    console.warn("[orchestrator] Missing canonicalUserKey — defaulting to 'guest'");
  }

  const safeKey = canonicalUserKey || "guest";

  // -------------------------------------------------------------------
  // HYBRID PIPELINE (Solace Arbiter → Model) 
  // Completely aligned with runHybridPipeline expected shape
  // -------------------------------------------------------------------
  const response = await runHybridPipeline({
    userMessage: message,
    context,
    history,
    ministryMode,
    modeHint,
    founderMode,
    canonicalUserKey: safeKey, // FIXED
  });

  // Arbiter should always return `{ finalAnswer }`
  if (!response || !response.finalAnswer) {
    return "[No arbiter answer]";
  }

  return response.finalAnswer;
}

