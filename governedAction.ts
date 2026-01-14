// governedAction.ts
// ------------------------------------------------------------
// Solace Governance Adapter
// Single mandatory entry point for all consequence-bearing actions
// ------------------------------------------------------------

import { executeGoverned } from "./executionGateIntegration";
import { compileConstraints } from "./constraintCompiler";
import { DecisionTrace } from "./decisionTrace";
import { AuthorityInstance } from "./authorityModel";

export type GovernedActionInput<T> = {
  trace: DecisionTrace;
  authority: AuthorityInstance | null;
  effect: () => T;

  // REQUIRED execution context for constraint compilation
  context: {
    hasHumanStop: boolean;
    reversible: boolean;
  };
};

export type GovernedActionResult<T> =
  | { status: "ALLOW"; result: T }
  | { status: "DEGRADE"; result: T }
  | { status: "BLOCK" }
  | { status: "ESCALATE" };

export function governedAction<T>(
  input: GovernedActionInput<T>
): GovernedActionResult<T> {
  const { trace, authority, effect, context } = input;

  const compiled = compileConstraints(
    trace,
    authority,
    context
  );

  return executeGoverned(
    trace,
    compiled,
    authority,
    () => effect()
  );
}
