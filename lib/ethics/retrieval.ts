// lib/ethics/retrieval.ts

export function computeRecallScore(memory: any) {
  return (
    1 +
    (memory.importance || 0) +
    (memory.emotional_weight || 0) * 0.5 -
    (memory.sensitivity_score || 0) * 0.3
  );
}

export function rankMemories(memories: any[]) {
  return memories
    .map(m => ({ ...m, _score: computeRecallScore(m) }))
    .sort((a, b) => b._score - a._score);
}
