// lib/ethics/drift.ts

export type DriftResult = {
  driftDetected: boolean;
  conflictLevel: number;
};

export function detectDrift(newContent: string, existingContent: string): DriftResult {
  const lowerNew = newContent.toLowerCase();
  const lowerOld = existingContent.toLowerCase();

  const contradicts =
    (lowerOld.includes("yes") && lowerNew.includes("no")) ||
    (lowerOld.includes("no") && lowerNew.includes("yes"));

  return {
    driftDetected: contradicts,
    conflictLevel: contradicts ? 3 : 0,
  };
}
