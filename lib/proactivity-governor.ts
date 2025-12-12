// lib/proactivity-governor.ts
// Phase 4 — Proactivity Governor
// Rule: Proactivity is permissioned, contextual, and explainable.

import "server-only";
import { buildContextSnapshot, ContextSignal } from "./context-engine";

/* ============================================================
   Types
   ============================================================ */

export type ProactiveAction =
  | "reminder"
  | "suggestion"
  | "draft_message"
  | "external_action"; // e.g. Amazon, email, calendar

export type ProactivityDecision = {
  allowed: boolean;
  reason: string;
  requiredConsent?: string;
  blockedByContext?: ContextSignal[];
  explain: string;
};

/* ============================================================
   Consent Contract (passed in, not queried here)
   ============================================================ */

export type ConsentState = {
  scopes: string[];          // e.g. ["reminders", "drafting"]
  expires_at?: string | null;
};

/* ============================================================
   Governor Logic
   ============================================================ */

export async function evaluateProactivity({
  user_id,
  workspace_id,
  action,
  consent,
}: {
  user_id: string;
  workspace_id?: string | null;
  action: ProactiveAction;
  consent: ConsentState | null;
}): Promise<ProactivityDecision> {
  // --------------------------------------------------
  // 1. Consent Gate — HARD STOP
  // --------------------------------------------------

  if (!consent || !consent.scopes.includes(action)) {
    return {
      allowed: false,
      reason: "missing_consent",
      requiredConsent: action,
      explain: `No consent on file for proactive action: ${action}`,
    };
  }

  if (consent.expires_at && new Date(consent.expires_at) < new Date()) {
    return {
      allowed: false,
      reason: "consent_expired",
      requiredConsent: action,
      explain: `Consent expired for action: ${action}`,
    };
  }

  // --------------------------------------------------
  // 2. Context Awareness
  // --------------------------------------------------

  const context = await buildContextSnapshot({
    user_id,
    workspace_id,
  });

  const blockedSignals: ContextSignal[] = [];

  if (context.signals.includes("solemn_day")) {
    blockedSignals.push("solemn_day");
  }

  if (
    action === "external_action" &&
    context.signals.includes("relationship_sensitive")
  ) {
    blockedSignals.push("relationship_sensitive");
  }

  if (blockedSignals.length > 0) {
    return {
      allowed: false,
      reason: "blocked_by_context",
      blockedByContext: blockedSignals,
      explain: `Proactivity suppressed due to context: ${blockedSignals.join(", ")}`,
    };
  }

  // --------------------------------------------------
  // 3. Allow (with explainability)
  // --------------------------------------------------

  return {
    allowed: true,
    reason: "cleared",
    explain: `Action '${action}' permitted by consent and context`,
  };
}
