// lib/ethics/retrieval.ts

export function computeRecallScore(memory: any) {
  const base = 1;

  const weight =
    base +
    memory.importance +
    memory.emotional_weight * 0.5 -
    memory.sensitivity_score * 0.3;

  return weight;
}

export function rankMemories(memories: any[]) {
  return memories
    .map(m => ({ ...m, _score: computeRecallScore(m) }))
    .sort((a, b) => b._score - a._score);
}
