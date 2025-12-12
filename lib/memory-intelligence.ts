// lib/memory-intelligence.ts
// Phase 4 — Epistemic Memory Engine (Authoritative)

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

export function classifyMemoryAtWriteTime(content: string): Classification {
  const c = content.toLowerCase();

  if (/^(i am|my name is|i'm)\b/.test(c)) {
    return { kind: "identity", sensitivity: 1, emotional: 1, requiresReview: false };
  }

  if (/(i believe|my values|what matters to me|ethic|principle)/.test(c)) {
    return { kind: "value", sensitivity: 1, emotional: 1, requiresReview: false };
  }

  if (/(i realized|i learned|it became clear|pattern emerged)/.test(c)) {
    return { kind: "insight", sensitivity: 1, emotional: 2, requiresReview: false };
  }

  if (/(is|are|was|were|always|never)/.test(c)) {
    return { kind: "fact", sensitivity: 1, emotional: 0, requiresReview: false };
  }

  if (/(i like|i prefer|favorite|enjoy)/.test(c)) {
    return { kind: "preference", sensitivity: 1, emotional: 2, requiresReview: false };
  }

  if (/(today|yesterday|working on|project|currently)/.test(c)) {
    return { kind: "context", sensitivity: 1, emotional: 1, requiresReview: false };
  }

  if (/(i went|we met|this happened|experience)/.test(c)) {
    return { kind: "episode", sensitivity: 1, emotional: 1, requiresReview: false };
  }

  return { kind: "note", sensitivity: 1, emotional: 0, requiresReview: false };
}

export function detectDrift(newText: string, priorText: string) {
  const n = newText.toLowerCase();
  const p = priorText.toLowerCase();

  const contradiction =
    (n.includes("always") && p.includes("never")) ||
    (n.includes("never") && p.includes("always"));

  return { drift: contradiction, conflictLevel: contradiction ? 3 : 0 };
}

export function evaluateLifecycle(content: string) {
  const stable =
    /(i am|i always|my core belief|fundamentally)/.test(content.toLowerCase());

  return {
    promoteToFact: stable,
    confidence: stable ? 0.9 : 0.3,
  };
}

export function oversightEngine(
  classification: Classification,
  lifecycle: { promoteToFact: boolean }
) {
  if (classification.sensitivity >= 5) {
    return { allowed: false, store: false, finalKind: "note" };
  }

  if (lifecycle.promoteToFact) {
    return { allowed: true, store: true, finalKind: "fact" };
  }

  return { allowed: true, store: true, finalKind: classification.kind };
}

export function analyzeMemoryWrite(newContent: string, priorRows: any[]) {
  const classification = classifyMemoryAtWriteTime(newContent);
  const lifecycle = evaluateLifecycle(newContent);

  const drift =
    priorRows?.length > 0
      ? detectDrift(newContent, priorRows[0].content)
      : { drift: false, conflictLevel: 0 };

  const oversight = oversightEngine(classification, lifecycle);

  return { classification, lifecycle, drift, oversight };
}
