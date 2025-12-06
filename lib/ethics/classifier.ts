// lib/ethics/classifier.ts

export type EthicalClassification = {
  sensitivity: number;        // 0–5
  emotionalWeight: number;     // 0–5
  requiresReview: boolean;
  category: "identity" | "value" | "insight" | "note";
};

export function classifyMemory(content: string): EthicalClassification {
  const lower = content.toLowerCase();

  // Sensitivity detection
  const sensitiveKeywords = [
    "password", "address", "ssn", "bank", "medical",
    "private", "secret", "danger", "threat"
  ];
  const sensitivity = sensitiveKeywords.some(k => lower.includes(k)) ? 5 : 1;

  // Emotional weight detection
  const emotionalKeywords = [
    "love", "hate", "fear", "sad", "angry", "hurt",
    "excited", "anxious", "proud"
  ];
  const emotionalWeight = emotionalKeywords.filter(k => lower.includes(k)).length;
  const boundedEmotion = Math.min(emotionalWeight, 5);

  // Auto category classification
  let category: EthicalClassification["category"] = "note";
  if (/i am|i feel|i believe|i value|my principle/i.test(lower)) category = "identity";
  if (/important to me|i care about|my goal|my mission|i want/i.test(lower)) category = "value";
  if (/i realized|i learned|i discovered|now i see/i.test(lower)) category = "insight";

  return {
    sensitivity,
    emotionalWeight: boundedEmotion,
    requiresReview: sensitivity >= 4,
    category,
  };
}

