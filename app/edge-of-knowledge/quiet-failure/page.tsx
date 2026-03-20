// app/edge-of-knowledge/quiet-failure/page.tsx
// Upgraded: Failure Attribution Boundary

export const metadata = {
  title:
    "Materials That Quietly Prevent Failure | Failure Attribution Boundary",
  description:
    "A constraint establishing that failure suppression must be causally attributable to material state—not inferred from absence of events.",
};

function Section({ title, children }: any) {
  return (
    <section className="mb-14">
      <h2 className="mb-4 text-2xl font-semibold text-white">{title}</h2>
      <div className="space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function QuietFailureWhitePaper() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-16 text-slate-100 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10">
        <p className="text-sm uppercase tracking-widest text-slate-400">
          Edge of Knowledge — Failure Attribution Boundary
        </p>

        <h1 className="mt-4 text-4xl font-semibold">
          Materials That Quietly Prevent Failure
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Failure suppression is valid only when causally attributable—not inferred from absence.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Silent suppression · Attribution required · Absence not proof
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          This system defines a constraint: absence of failure is not valid
          evidence unless causally attributable to the material system.
        </p>

        <p className="text-red-300">
          “Nothing happened” is not proof—unless mechanism and attribution are demonstrated.
        </p>
      </Section>

      {/* PRINCIPLE */}
      <Section title="Failure Suppression Principle">
        <p>
          These materials function by preventing or delaying failure without
          improving observable performance metrics.
        </p>

        <p>
          Their success is measured by:
        </p>

        <ul className="list-disc pl-6">
          <li>Reduction in real-world failure frequency</li>
          <li>Suppression of degradation pathways</li>
          <li>Stabilization of system behavior over time</li>
        </ul>

        <p className="text-red-300">
          Suppression must be causally linked—not statistically assumed.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Physical Mechanisms">
        <ul className="list-disc pl-6">
          <li>Micro-damage arrest before propagation</li>
          <li>Stress redistribution to prevent crack initiation</li>
          <li>Resistance to corrosion, wear, or chemical attack</li>
          <li>Stabilization under predictable degradation regimes</li>
        </ul>

        <p>
          These mechanisms must be observable or inferable through validated models.
        </p>
      </Section>

      {/* ATTRIBUTION */}
      <Section title="Attribution Requirement">
        <p>
          A valid claim must demonstrate:
        </p>

        <ul className="list-disc pl-6">
          <li>Clear causal pathway between material and failure suppression</li>
          <li>Baseline comparison without the material</li>
          <li>Consistency across real-world conditions</li>
        </ul>

        <p className="text-red-300">
          Absence of failure without attribution is non-admissible.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid:</p>
        <ul className="list-disc pl-6">
          <li>Long-lived systems with cumulative degradation</li>
          <li>Low-signal, high-impact failure environments</li>
          <li>Systems where monitoring is unreliable or infeasible</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails:</p>
        <ul className="list-disc pl-6">
          <li>High-performance edge systems</li>
          <li>Environments with strong real-time monitoring</li>
          <li>Systems where failure modes are already controlled</li>
        </ul>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>No measurable extension of service life</li>
          <li>Failure becomes more catastrophic when it occurs</li>
          <li>New hidden vulnerabilities are introduced</li>
          <li>Attribution cannot be established</li>
        </ul>

        <p className="text-red-300">
          Unattributed success is indistinguishable from luck.
        </p>
      </Section>

      {/* ETHICS */}
      <Section title="Ethical Constraint">
        <p>
          These systems must not:
        </p>

        <ul className="list-disc pl-6">
          <li>Encourage complacency or reduced oversight</li>
          <li>Be presented as guarantees of safety</li>
          <li>Replace sound engineering or monitoring practices</li>
        </ul>

        <p className="text-red-300">
          Silence must not be mistaken for certainty.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Failure-preserving transformations</p>
        <p><strong>Q:</strong> Failure occurrence</p>
        <p><strong>S:</strong> Suppression state with causal linkage</p>

        <p className="text-red-300">
          Failure: Q absent without demonstrable linkage to S
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim of failure prevention must demonstrate causal attribution
          between material state and suppressed outcome.
        </p>

        <p className="text-red-300">
          Absence of failure alone is not admissible evidence.
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-lg border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-2xl font-semibold text-white">Boundary Judgment</h2>
        <p className="mt-4 text-red-200">
          Systems that prevent failure without visible signals must meet a higher
          burden of proof. When success is defined by absence, attribution becomes
          the only valid evidence.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Attribution-bound · Silent-suppression · Non-admissible absence · Versioned
      </div>
    </main>
  );
}
