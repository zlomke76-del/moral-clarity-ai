// --------------------------------------------------------------
// SOLACE ORCHESTRATOR
// Unified-response contract
// No lens leakage
// NEXT 16 SAFE
// --------------------------------------------------------------

import { runHybridPipeline } from "./hybrid";

// --------------------------------------------------------------
// TYPES
// --------------------------------------------------------------
export type OrchestratorResult = {
  finalAnswer: string;
  imageUrl: string | null;
};

// --------------------------------------------------------------
// ORCHESTRATOR
// --------------------------------------------------------------
export async function orchestrateSolaceResponse(args: {
  userMessage: string;
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
  governorLevel?: number;
  governorInstructions?: string;
}) : Promise<OrchestratorResult> {

  const result = await runHybridPipeline({
    userMessage: args.userMessage,
    context: args.context,
    ministryMode: args.ministryMode,
    founderMode: args.founderMode,
    modeHint: args.modeHint,
    governorLevel: args.governorLevel,
    governorInstructions: args.governorInstructions,
  });

  return {
    finalAnswer: result.finalAnswer,
    imageUrl: null, // reserved for future multimodal use
  };
}
