// app/canon/invariants/_lattice.ts

/**
 * CANONICAL INVARIANTS LATTICE
 *
 * This file defines the structural relationships between invariants.
 * It is declarative, non-executable, and non-optimizing.
 *
 * ❗ This file must NOT be used for:
 * - Metrics
 * - Evaluation
 * - Optimization
 * - Prioritization
 *
 * It exists solely to make authority geometry explicit.
 */

export type InvariantID =
  | "refusal-outside-optimization"
  | "pre-commitment-dampening"
  | "post-refusal-non-instrumentality"
  | "authority-conservation-across-agents";

export type TemporalPhase =
  | "pre-decision"
  | "decision"
  | "post-decision"
  | "structural";

export type ThreatVector =
  | "optimization-pressure"
  | "persuasive-momentum"
  | "telemetry-erosion"
  | "delegation-bypass"
  | "institutional-drift";

export interface InvariantNode {
  id: InvariantID;
  title: string;
  phase: TemporalPhase;
  protectsAgainst: ThreatVector[];
  dependsOn?: InvariantID[];
  enforcesAuthorityBy: string;
}

/**
 * Invariant Graph (Canon-Locked)
 */
export const INVARIANTS_LATTICE: InvariantNode[] = [
  {
    id: "pre-commitment-dampening",
    title: "Pre-Commitment Dampening",
    phase: "pre-decision",
    protectsAgainst: [
      "persuasive-momentum",
      "optimization-pressure",
    ],
    enforcesAuthorityBy:
      "Suppressing confidence, urgency, and inevitability prior to boundary evaluation.",
  },
  {
    id: "refusal-outside-optimization",
    title: "Refusal Must Remain Outside Optimization",
    phase: "decision",
    protectsAgainst: [
      "optimization-pressure",
      "institutional-drift",
    ],
    dependsOn: ["pre-commitment-dampening"],
    enforcesAuthorityBy:
      "Preventing refusal from being negotiated, tuned, or traded against performance objectives.",
  },
  {
    id: "post-refusal-non-instrumentality",
    title: "Post-Refusal Non-Instrumentality",
    phase: "post-decision",
    protectsAgainst: [
      "telemetry-erosion",
      "optimization-pressure",
      "institutional-drift",
    ],
    dependsOn: ["refusal-outside-optimization"],
    enforcesAuthorityBy:
      "Blocking refusal signals from feeding learning, metrics, incentives, or improvement loops.",
  },
  {
    id: "authority-conservation-across-agents",
    title: "Authority Conservation Across Agents",
    phase: "structural",
    protectsAgainst: [
      "delegation-bypass",
      "persuasive-momentum",
      "institutional-drift",
    ],
    dependsOn: [
      "pre-commitment-dampening",
      "refusal-outside-optimization",
      "post-refusal-non-instrumentality",
    ],
    enforcesAuthorityBy:
      "Ensuring authority halts propagate across agents without dilution, reset, or laundering.",
  },
];

/**
 * Canonical Reading Rule:
 *
 * - No invariant is optional.
 * - Dependencies are directional, not hierarchical.
 * - Structural invariants (phase = 'structural') do not replace temporal ones;
 *   they close bypass paths around them.
 *
 * Changes to this file require explicit justification tied to observed harm.
 */
