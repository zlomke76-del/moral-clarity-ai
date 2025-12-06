// lib/memory-intelligence.ts
// Phase 4 — Ethical Memory Engine (L6)

export type ClassifiedKind =
  | "identity"
  | "value"
  | "insight"
  | "fact"
  | "preference"
  | "context"
  | "episode"
  | "note";

export type Classification = {
  kind: ClassifiedKind;
  sensitivity: number;
  emotional: number;
  requiresReview: boolean;
};

// --------------------------------------------------------
// 1. CLASSIFICATION — identity/value/insight/etc.
// --------------------------------------------------------

export function classifyMemoryAtWriteTime(content: string): Classification {
  const c = content.toLowerCase();

  // Identity
  if (/^(i am|my name is|i'm)\b/.test(c)) {
    return {
      kind: "identity",
      sensitivity: 1,
      emotional: 1,
      requiresReview: false,
    };
  }

  // Values
  if (/(i believe|i stand for|my values|what matters to me)/.test(c)) {
    return {
      kind: "value",
      sensitivity: 1,
      emotional: 1,
      requiresReview: false,
    };
  }

  // Insight (reflection / realization / pattern recognition)
  if (/(i realized|i've learned|i now understand|it became clear)/.test(c)) {
    return {
      kind: "insight",
      sensitivity: 1,
      emotional: 2,
      requiresReview: false,
    };
  }

  // Fact
  if (/(is|are|was|were|always|never)/.test(c)) {
    return {
      kind: "fact",
      sensitivity: 1,
      emotional: 0,
      requiresReview: false,
    };
  }

  // Preference
  if (/(i prefer|i like|i love|my favorite|i enjoy)/.test(c)) {
    return {
      kind: "preference",
      sensitivity: 1,
      emotional: 2,
      requiresReview: false,
    };
  }

  // Context
  if (/today|yesterday|tomorrow|we did|we are working|project/.test(c)) {
    return {
      kind: "context",
      sensitivity: 1,
      emotional: 1,
      requiresReview: false,
    };
  }

  // Episode (experience)
  if (/i went|we met|i saw|this happened|experience/.test(c)) {
    return {
      kind: "episode",
      sensitivity: 1,
      emotional: 1,
      requiresReview: false,
    };
  }

  // Default — note
  return {
    kind: "note",
    sensitivity: 1,
    emotional: 0,
    requiresReview: false,
  };
}

// --------------------------------------------------------
// 2. DRIFT DETECTION — contradiction resolution
// --------------------------------------------------------

export function detectDrift(newContent: string, existingContent: string) {
  const n = newContent.toLowerCase();
  const e = existingContent.toLowerCase();

  const directContradiction =
    (e.includes("yes") && n.includes("no")) ||
    (e.includes("no") && n.includes("yes")) ||
    (e.includes("never") && n.includes("always")) ||
    (e.includes("always") && n.includes("never"));

  return {
    drift: directContradiction,
    conflictLevel: directContradiction ? 3 : 0,
  };
}

// --------------------------------------------------------
// 3. LIFECYCLE — decide promotion to fact
// --------------------------------------------------------

export function evaluateLifecycle(content: string) {
  const c = content.toLowerCase();

  const stable =
    /(i am|i always|i never|my core|fundamentally|my belief is)/.test(c);

  return {
    promoteToFact: stable,
    confidence: stable ? 0.9 : 0.2,
    demote: false,
  };
}

// --------------------------------------------------------
// 4. OVERSIGHT — ethical filter
// --------------------------------------------------------

export function oversightEngine(classification: Classification, lifecycle: any) {
  if (classification.sensitivity >= 5) {
    return {
      allowed: false,
      store: false,
      finalKind: "restricted",
      requiresReview: true,
      promoteToFact: false,
    };
  }

  if (lifecycle.promoteToFact) {
    return {
      allowed: true,
      store: true,
      finalKind: "fact",
      requiresReview: classification.requiresReview,
      promoteToFact: true,
    };
  }

  return {
    allowed: true,
    store: true,
    finalKind: classification.kind,
    requiresReview: classification.requiresReview,
    promoteToFact: false,
  };
}

// --------------------------------------------------------
// 5. RECALL RANKING
// --------------------------------------------------------

export function computeRecallScore(mem: any) {
  const base = 1;

  const score =
    base +
    (mem.importance || 0) +
    (mem.emotional || 0) * 0.5 -
    mem.sensitivity * 0.2;

  return score;
}

export function rankMemories(rows: any[]) {
  return rows
    .map((m) => ({
      ...m,
      _score: computeRecallScore(m),
    }))
    .sort((a, b) => b._score - a._score);
}

// --------------------------------------------------------
// 6. MAIN ENTRY — full write-time pipeline
// --------------------------------------------------------

export async function analyzeMemoryWrite(newContent: string, existingRows: any[]) {
  const classification = classifyMemoryAtWriteTime(newContent);
  const lifecycle = evaluateLifecycle(newContent);

  // Drift check vs last relevant memory
  const last = existingRows[0];
  const drift = last ? detectDrift(newContent, last.content) : { drift: false };

  const oversight = oversightEngine(classification, lifecycle);

  return {
    classification,
    lifecycle,
    drift,
    oversight,
  };
}
