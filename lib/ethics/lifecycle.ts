// lib/ethics/lifecycle.ts

export type LifecycleEvaluation = {
  promoteToFact: boolean;
  demote: boolean;
  confidence: number;
};

export function evaluateMemoryLifecycle(content: string): LifecycleEvaluation {
  const stablePattern = /(i am|i prefer|i always|i believe|i value|my name is|i live)/i;
  const isStable = stablePattern.test(content.toLowerCase());

  return {
    promoteToFact: isStable,
    demote: false,
    confidence: isStable ? 0.9 : 0.2,
  };
}
