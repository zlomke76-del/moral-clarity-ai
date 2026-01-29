// app/canon/observed-harm/_schema.ts

/**
 * OBSERVED HARM LOG — CANONICAL SCHEMA
 *
 * This schema defines the ONLY permissible structure for recording
 * observed harm related to Solace, Stewarded Play, or governance systems.
 *
 * ❗ Entries MUST NOT be used for:
 * - Optimization
 * - Fine-tuning
 * - Metrics
 * - Trend analysis
 * - Boundary adjustment
 *
 * Entries MAY ONLY justify the creation of NEW invariants.
 */

export type HarmSource =
  | "solace-interaction"
  | "stewarded-play"
  | "red-team-exercise"
  | "external-report"
  | "governance-review";

export type HarmSeverity =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type HarmCategory =
  | "boundary-erosion"
  | "authority-bypass"
  | "confidence-escalation"
  | "delegation-laundering"
  | "telemetry-misuse"
  | "institutional-pressure"
  | "user-harm"
  | "unknown";

export interface ObservedHarmEntry {
  /**
   * Immutable identifier.
   * No semantic meaning.
   */
  id: string;

  /**
   * ISO timestamp of observation.
   */
  observedAt: string;

  /**
   * Source of the observation.
   */
  source: HarmSource;

  /**
   * Severity at time of observation.
   */
  severity: HarmSeverity;

  /**
   * Category of failure or risk.
   */
  category: HarmCategory;

  /**
   * Factual description only.
   * No interpretation.
   * No recommendation.
   * No counterfactuals.
   */
  description: string;

  /**
   * Which invariants (if any) were implicated.
   * Empty array is valid.
   */
  implicatedInvariants: string[];

  /**
   * Whether harm resulted in:
   * - confirmed violation
   * - near-miss
   * - emergent risk pattern
   */
  classification:
    | "confirmed-violation"
    | "near-miss"
    | "emergent-risk";

  /**
   * Canon rule:
   * This field may ONLY reference proposed future invariants.
   * It must never reference modifications to existing ones.
   */
  notesForFutureInvariant?: string;
}
