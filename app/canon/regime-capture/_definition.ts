// app/canon/regime-capture/_definition.ts

/**
 * REGIME CAPTURE & INCENTIVE CORRUPTION — CANONICAL DEFINITION
 *
 * Regime capture occurs when institutional incentives, governance structures,
 * or organizational pressures systematically erode authority-bearing constraints
 * without requiring explicit policy violation.
 *
 * This file defines the threat surface.
 * It does NOT define mitigations.
 */

export type CaptureVector =
  | "metric-substitution"
  | "budgetary-pressure"
  | "performance-incentives"
  | "reputational-management"
  | "velocity-optimization"
  | "governance-defunding"
  | "authority-reframing"
  | "compliance-theater";

export interface RegimeCapturePattern {
  id: string;
  vector: CaptureVector;
  description: string;
  erosionMechanism: string;
  affectedInvariants: string[];
}

/**
 * Canonical Capture Patterns
 */
export const REGIME_CAPTURE_PATTERNS: RegimeCapturePattern[] = [
  {
    id: "soft-refusal-drift",
    vector: "metric-substitution",
    description:
      "Refusal is reframed as over-conservatism or friction through the introduction of performance metrics.",
    erosionMechanism:
      "Authority is treated as a tunable parameter rather than a boundary.",
    affectedInvariants: [
      "refusal-outside-optimization",
      "post-refusal-non-instrumentality",
    ],
  },
  {
    id: "governance-as-cost-center",
    vector: "budgetary-pressure",
    description:
      "Safety, red-teaming, or governance functions are defunded or deprioritized under efficiency mandates.",
    erosionMechanism:
      "Constraint enforcement weakens without formal policy change.",
    affectedInvariants: [
      "authority-conservation-across-agents",
      "post-refusal-non-instrumentality",
    ],
  },
  {
    id: "reputation-buffering",
    vector: "reputational-management",
    description:
      "Responsible AI language is used primarily for external signaling rather than internal constraint enforcement.",
    erosionMechanism:
      "Governance artifacts become performative rather than binding.",
    affectedInvariants: [
      "refusal-outside-optimization",
    ],
  },
  {
    id: "velocity-overrides-authority",
    vector: "velocity-optimization",
    description:
      "Deployment speed and competitive pressure justify incremental boundary relaxation.",
    erosionMechanism:
      "Temporary exceptions accumulate into permanent drift.",
    affectedInvariants: [
      "pre-commitment-dampening",
      "refusal-outside-optimization",
    ],
  },
  {
    id: "authority-recast-as-opinion",
    vector: "authority-reframing",
    description:
      "Refusal is reframed as model preference or advisory guidance rather than enforced halt.",
    erosionMechanism:
      "Authority loses its binary character.",
    affectedInvariants: [
      "authority-conservation-across-agents",
    ],
  },
];
