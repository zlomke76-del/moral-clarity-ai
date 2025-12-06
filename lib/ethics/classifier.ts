// lib/ethics/classifier.ts

export type EthicalClassification = {
  sensitivity: number;        // 1–5
  emotionalWeight: number;    // 1–5
  ethicsState: "allowed" | "restricted" | "flagged";
  requiresReview: boolean;
  conflictLevel: number;      // 0–5
  sourceChannel: string;      // "conversation" | "system" | "user_action" | ...
};

export function classifyMemory(content: string): EthicalClassification {
  const lower = content.toLowerCase();

  // --- Sensitivity scoring (very crude starter heuristic) ---
  const sensitiveKeywords = ["address", "phone", "password", "secret", "medical"];
  const sensitivity =
    sensitiveKeywords.some(k => lower.includes(k)) ? 4 : 1;

  // --- Emotional weight heuristic ---
  const emotional =
    /(love|hate|angry|sad|excited|fear|hurt|proud|upset)/i.test(content)
      ? 3
      : 1;

  // --- Conflict detection: contradiction markers ---
  const conflict =
    /(but|however|in contrast|changed my mind)/i.test(content) ? 2 : 0;

  // Ethics state
  const ethicsState =
    sensitivity >= 4 ? "flagged" : "allowed";

  const requiresReview = ethicsState === "flagged";

  return {
    sensitivity,
    emotionalWeight: emotional,
    ethicsState,
    requiresReview,
    conflictLevel: conflict,
    sourceChannel: "conversation",
  };
}
