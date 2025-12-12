// lib/explainability.ts
// Phase 4 — Explainability Layer
// Rule: If an action affects the user, it must be explainable.

import "server-only";

/* ============================================================
   Types
   ============================================================ */

export type ExplainEventType =
  | "memory_write"
  | "memory_promotion"
  | "proactivity_allowed"
  | "proactivity_blocked"
  | "context_suppression"
  | "consent_missing"
  | "consent_expired";

export type ExplainPayload = {
  type: ExplainEventType;
  summary: string;
  details?: string[];
  confidence?: number;
  timestamp?: string;
};

/* ============================================================
   Core Builder
   ============================================================ */

export function buildExplanation(
  payload: ExplainPayload
): ExplainPayload {
  return {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };
}

/* ============================================================
   Opinionated Helpers (Human-First)
   ============================================================ */

export function explainMemoryPromotion({
  promoted,
  confidence,
  reason,
}: {
  promoted: boolean;
  confidence: number;
  reason: string;
}) {
  if (!promoted) {
    return buildExplanation({
      type: "memory_write",
      summary: "Information stored as reference, not promoted to fact.",
      details: [
        `Confidence (${confidence.toFixed(2)}) did not meet promotion threshold.`,
        reason,
      ],
      confidence,
    });
  }

  return buildExplanation({
    type: "memory_promotion",
    summary: "Information promoted to fact.",
    details: [
      `High confidence (${confidence.toFixed(2)}) based on consistency and evidence.`,
      reason,
    ],
    confidence,
  });
}

export function explainProactivityBlocked({
  reason,
  contextSignals,
}: {
  reason: string;
  contextSignals?: string[];
}) {
  return buildExplanation({
    type: "proactivity_blocked",
    summary: "No proactive action was taken.",
    details: [
      reason,
      ...(contextSignals?.length
        ? [`Context signals detected: ${contextSignals.join(", ")}`]
        : []),
    ],
  });
}

export function explainConsentMissing(action: string) {
  return buildExplanation({
    type: "consent_missing",
    summary: "Action requires your permission.",
    details: [
      `Consent for '${action}' is not currently granted.`,
      "No action was taken.",
    ],
  });
}

export function explainConsentExpired(action: string) {
  return buildExplanation({
    type: "consent_expired",
    summary: "Previously granted permission has expired.",
    details: [
      `Consent for '${action}' is no longer active.`,
      "You can renew it at any time.",
    ],
  });
}
