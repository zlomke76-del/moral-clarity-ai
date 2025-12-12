// lib/explainability.ts
// Phase 5 — Explainability Core (Canonical)

import "server-only";

export type Explanation = {
  type: "memory" | "proactivity" | "context" | "consent";
  summary: string;
  details: string[];
  evidence_refs?: string[];
  created_at: string;
};

export function buildExplanation(input: {
  type: Explanation["type"];
  summary: string;
  details: string[];
  evidence_refs?: string[];
}): Explanation {
  return {
    type: input.type,
    summary: input.summary,
    details: input.details,
    evidence_refs: input.evidence_refs,
    created_at: new Date().toISOString(),
  };
}
