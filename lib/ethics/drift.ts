// lib/ethics/drift.ts

export type DriftResult = {
  driftDetected: boolean;
  conflictLevel: number;
};

export function detectDrift(newContent: string, existing: string): DriftResult {
  const a = newContent.toLowerCase();
  const b = existing.toLowerCase();

  const contradiction =
    (b.includes("yes") && a.includes("no")) ||
    (b.includes("no") && a.includes("yes"));

  return {
    driftDetected: contradiction,
    conflictLevel: contradiction ? 3 : 0,
  };
}
