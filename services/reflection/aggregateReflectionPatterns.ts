// ------------------------------------------------------------
// Reflection Pattern Aggregation
// Canonical, Non-Normative Compression
//------------------------------------------------------------

import { ReflectionLedgerEntry } from "./reflectionLedger.types";

export type ReflectionPattern = {
  scope: ReflectionLedgerEntry["scope"];
  source: string;
  count: number;
  summaries: string[];
};

export function aggregateReflectionPatterns(
  ledger: ReflectionLedgerEntry[]
): ReflectionPattern[] {
  const index: Record<string, ReflectionPattern> = {};

  for (const entry of ledger) {
    const key = `${entry.scope}::${entry.source}`;

    if (!index[key]) {
      index[key] = {
        scope: entry.scope,
        source: entry.source,
        count: 0,
        summaries: [],
      };
    }

    index[key].count += 1;
    index[key].summaries.push(entry.summary);
  }

  return Object.values(index);
}
