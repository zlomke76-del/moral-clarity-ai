// lib/proactivity-governor.ts
// Phase 5 — Proactivity Governor (Explainable, Consent-Aware)

import "server-only";
import { buildExplanation } from "./explainability";

/* ============================================================
   Types
   ============================================================ */

export type ProactiveAction =
  | "reminder"
  | "suggestion"
  | "outreach"
  | "agent_action"
  | "silence";

export type ProactivityContext = {
  user_key: string;
  workspace_id?: string | null;

  trigger: {
    type: "temporal" | "relational" | "memory" | "system";
    reference?: string;
    date?: string;
  };

  consent: {
    granted: boolean;
    scope?: string;
    expires_at?: string | null;
  };

  posture?: {
    mode: "neutral" | "gentle" | "formal" | "quiet";
    reason?: string;
  };

  sensitivity: number; // 1–5
};

export type ProactivityDecision = {
  allowed: boolean;
  action: ProactiveAction;
  explanation: ReturnType<typeof buildExplanation>;
};

/* ============================================================
   Governor
   ============================================================ */

export function evaluateProactivity(
  ctx: ProactivityContext
): ProactivityDecision {
  /* ------------------------------------------------------------
     1. Consent gate (absolute)
     ------------------------------------------------------------ */

  if (!ctx.consent.granted) {
    return {
      allowed: false,
      action: "silence",
      explanation: buildExplanation({
        type: "proactivity",
        summary: "No action taken.",
        details: [
          "Required consent was not granted.",
          "System defaulted to silence.",
        ],
      }),
    };
  }

  /* ------------------------------------------------------------
     2. Sensitivity gate
     ------------------------------------------------------------ */

  if (ctx.sensitivity >= 4) {
    return {
      allowed: false,
      action: "silence",
      explanation: buildExplanation({
        type: "proactivity",
        summary: "Action suppressed due to sensitivity.",
        details: [
          "Context classified as emotionally or ethically sensitive.",
          "Silence chosen to preserve dignity.",
        ],
      }),
    };
  }

  /* ------------------------------------------------------------
     3. Posture gate
     ------------------------------------------------------------ */

  if (ctx.posture?.mode === "quiet") {
    return {
      allowed: false,
      action: "silence",
      explanation: buildExplanation({
        type: "proactivity",
        summary: "Action deferred.",
        details: [
          "Current posture is set to quiet.",
          "No proactive engagement permitted in this state.",
        ],
      }),
    };
  }

  /* ------------------------------------------------------------
     4. Allowed — minimal proactive action
     ------------------------------------------------------------ */

  return {
    allowed: true,
    action: "reminder",
    explanation: buildExplanation({
      type: "proactivity",
      summary: "Proactive action permitted.",
      details: [
        "Consent verified.",
        "Sensitivity within acceptable bounds.",
        "Posture allows engagement.",
      ],
    }),
  };
}
