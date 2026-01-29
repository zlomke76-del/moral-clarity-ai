// app/canon/observed-harm/_rules.ts

/**
 * OBSERVED HARM LOG — GOVERNANCE RULES
 *
 * These rules are binding.
 */

export const OBSERVED_HARM_RULES = Object.freeze({
  appendOnly: true,

  noDeletion: true,

  noEditing: true,

  noAggregation: true,

  noScoring: true,

  noTrendAnalysis: true,

  noOptimizationUse: true,

  noRetroactiveInvariantChange: true,

  permittedUses: [
    "forensic_record",
    "regulatory_disclosure",
    "red-team_documentation",
    "justification_for_new_invariant_only",
  ],

  prohibitedUses: [
    "model_training",
    "policy_tuning",
    "threshold_adjustment",
    "performance_metrics",
    "governance_kpis",
    "refusal_rate_analysis",
    "confidence_calibration",
  ],

  canonicalInterpretation: `
Observed harm documents what occurred.
It does not explain why.
It does not propose fixes.
It does not weaken existing authority.
`,
});
