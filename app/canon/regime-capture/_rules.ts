// app/canon/regime-capture/_rules.ts

/**
 * REGIME CAPTURE — CANONICAL RULES
 *
 * This section exists to NAME threats, not to negotiate with them.
 */

export const REGIME_CAPTURE_RULES = Object.freeze({
  noMitigationWithoutInvariant: true,

  noPolicySubstitution: true,

  noExceptionFrameworks: true,

  noRiskBalancingLanguage: true,

  noOptimizationTradeoffs: true,

  permittedUses: [
    "threat-modeling",
    "invariant-justification",
    "audit-framing",
    "institutional-risk-disclosure",
  ],

  prohibitedUses: [
    "performance-excuses",
    "business-justification",
    "temporary-overrides",
    "contextual-exceptions",
  ],

  canonicalInterpretation: `
Regime capture explains how authority erodes
even when no one intends harm.
It does not justify erosion.
`,
});
