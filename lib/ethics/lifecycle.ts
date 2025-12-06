// lib/ethics/lifecycle.ts

export type LifecycleEvaluation = {
  promoteToFact: boolean;
  demote: boolean;
  confidence: number;
};

export function evaluateMemoryLifecycle(content: string): LifecycleEvaluation {
  const lower = content.toLowerCase();

  const isStable =
    /(i am|i prefer|my name is|i live|i believe|i always|i never)/i.test(lower);

  return {
    promoteToFact: isStable,
    demote: false,
    confidence: isStable ? 0.9 : 0.2,
  };
}
