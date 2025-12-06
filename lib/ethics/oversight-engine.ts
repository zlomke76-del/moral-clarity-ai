// lib/ethics/oversight-engine.ts

import { EthicalClassification } from "./classifier";
import { LifecycleEvaluation } from "./lifecycle";

export type OversightDecision = {
  allowed: boolean;
  store: boolean;
  promoteToFact: boolean;
  requiresReview: boolean;
  finalKind: string;
};

export function ethicalOversight(
  classification: EthicalClassification,
  lifecycle: LifecycleEvaluation
): OversightDecision {
  // Hard-stop for extremely sensitive material
  if (classification.sensitivity >= 5) {
    return {
      allowed: false,
      store: false,
      promoteToFact: false,
      requiresReview: true,
      finalKind: "restricted",
    };
  }

  // Fact promotion path
  if (lifecycle.promoteToFact) {
    return {
      allowed: true,
      store: true,
      promoteToFact: true,
      requiresReview: classification.requiresReview,
      finalKind: "fact",
    };
  }

  // Default pathway
  return {
    allowed: true,
    store: true,
    promoteToFact: false,
    requiresReview: classification.requiresReview,
    finalKind: "note",
  };
}
