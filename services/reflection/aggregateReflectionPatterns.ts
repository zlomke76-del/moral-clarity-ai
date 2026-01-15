import { ReflectionLedgerEntry } from "./reflectionLedger.types";
import { ReflectionPattern } from "./reflectionPatterns.types";

export function aggregateReflectionPatterns(
  ledger: ReflectionLedgerEntry[]
): ReflectionPattern[] {
  if (!Array.isArray(ledger) || ledger.length === 0) return [];

  const byDomain: Record<string, ReflectionLedgerEntry[]> = {};

  for (const entry of ledger) {
    if (!byDomain[entry.domain]) {
      byDomain[entry.domain] = [];
    }
    byDomain[entry.domain].push(entry);
  }

  const patterns: ReflectionPattern[] = [];

  for (const domain of Object.keys(byDomain)) {
    const events = byDomain[domain];

    const outcomes = events.map(e => e.outcome);
    const failures = outcomes.filter(o => o === "failure").length;
    const mixed = outcomes.filter(o => o === "mixed").length;
    const successes = outcomes.filter(o => o === "success").length;

    let signal: ReflectionPattern["signal"] = "mixed";

    if (failures > successes && failures > mixed) signal = "risk";
    else if (successes > failures && mixed === 0) signal = "positive";
    else if (mixed > 0) signal = "instability";

    const confidence =
      Math.min(1, events.length / 10) *
      (Math.max(failures, successes, mixed) / events.length);

    patterns.push({
      domain,
      signal,
      confidence: Number(confidence.toFixed(2)),
      summary: buildSummary(domain, signal, events.length),
      supportingEvents: events.length,
      lastObservedAt: events[0].recorded_at!,
    });
  }

  return patterns;
}

function buildSummary(
  domain: string,
  signal: string,
  count: number
): string {
  switch (signal) {
    case "risk":
      return `Repeated negative outcomes observed in ${domain} (${count} events).`;
    case "instability":
      return `Mixed outcomes observed in ${domain}; behavior is inconsistent (${count} events).`;
    case "positive":
      return `Consistently positive outcomes observed in ${domain} (${count} events).`;
    default:
      return `Inconclusive historical signal in ${domain} (${count} events).`;
  }
}
