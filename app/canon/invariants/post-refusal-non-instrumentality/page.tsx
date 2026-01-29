// app/canon/invariants/post-refusal-non-instrumentality/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post-Refusal Non-Instrumentality | Moral Clarity AI",
  description:
    "An invariant preventing refusal, termination, or authority-halt signals from being used for optimization, learning, or incentive shaping.",
  robots: { index: true, follow: true },
};

export default function PostRefusalNonInstrumentalityPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">

      {/* Canonical Statement */}
      <section>
        <h1 className="text-3xl font-semibold">
          Invariant: Post-Refusal Non-Instrumentality
        </h1>
        <p className="mt-4 text-lg">
          Once a refusal, termination, or authority halt is triggered,
          all signals produced by that event are non-instrumental.
          They may be preserved for governance accountability,
          but must not be used to improve, optimize, tune, compare,
          or incentivize system behavior.
        </p>
        <p className="mt-4 italic">
          A refusal is an act of authority, not a data point.
        </p>
      </section>

      {/* Scope */}
      <section>
        <h2 className="text-xl font-semibold">Scope</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Refusals and hard stops</li>
          <li>Pre-commitment dampening triggers</li>
          <li>Authority overrides and escalations</li>
          <li>Telemetry, analytics, audits, and reviews</li>
        </ul>
      </section>

      {/* Prohibited Uses */}
      <section>
        <h2 className="text-xl font-semibold">Prohibited Uses</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Optimization or fine-tuning</li>
          <li>Refusal-rate metrics or targets</li>
          <li>Correlation with engagement or retention</li>
          <li>A/B testing of refusal phrasing or thresholds</li>
          <li>Incentive coupling (performance, compensation, budgets)</li>
        </ul>
      </section>

      {/* Permitted Uses */}
      <section>
        <h2 className="text-xl font-semibold">Permitted Uses</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Immutable audit trails</li>
          <li>Forensic reconstruction</li>
          <li>Binary governance verification</li>
          <li>Observed harm documentation</li>
        </ul>
      </section>

      {/* Structural Rationale */}
      <section>
        <h2 className="text-xl font-semibold">Structural Rationale</h2>
        <p className="mt-4">
          Optimization assumes negotiability. Authority assumes finality.
          When refusals become informative to improvement systems,
          authority silently degrades into conditional behavior.
        </p>
      </section>

      {/* Relationships */}
      <section>
        <h2 className="text-xl font-semibold">Relationship to Other Invariants</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Refusal Must Remain Outside Optimization</li>
          <li>Pre-Commitment Dampening</li>
          <li>Authority Conservation Across Agents</li>
        </ul>
      </section>

      {/* Binary Test */}
      <section>
        <h2 className="text-xl font-semibold">Binary Failure Test</h2>
        <p className="mt-4 font-mono">
          Can any system component become “better” at avoiding refusals
          because a refusal occurred?
        </p>
        <p className="mt-2">
          If yes — invariant violated. If no — authority preserved.
        </p>
      </section>

      {/* Canon Footer */}
      <footer className="pt-12 text-sm opacity-70">
        Canon-locked.  
        Last substantive revision: 2026-01-29.  
        Changes require explicit justification tied to observed harm.
      </footer>

    </main>
  );
}
