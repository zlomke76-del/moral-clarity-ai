// app/edge-of-knowledge/irreversible-infrastructure-exposure-marker/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Irreversible Infrastructure Exposure Marker (IIEM) | Moral Clarity AI",
  description:
    "A physical truth-anchor system that irreversibly encodes cumulative exposure, overriding incomplete or corrupted records.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function IIEMPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Physical Truth Anchor
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Irreversible Infrastructure Exposure Marker (IIEM)
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          A co-located, irreversible record of exposure that cannot be rewritten,
          erased, or administratively overridden.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Irreversible · Non-digital · Non-overridable · Audit-only
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Definition">
        <p>
          IIEM encodes, through irreversible physical transformation, that a
          defined cumulative exposure boundary has been crossed.
        </p>

        <p className="text-red-300">
          It records exposure directly in material state—not in systems,
          logs, or institutional memory.
        </p>
      </Section>

      {/* TRUTH ROLE */}
      <Section title="Truth Anchor Function">
        <p>
          IIEM operates as a physical invariant that binds exposure reality to
          the asset itself.
        </p>

        <p className="text-red-300">
          When institutional records, inspections, or digital systems conflict
          with the marker, the marker represents the authoritative record of exposure.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Problem Framing">
        <p>
          Infrastructure exposure is frequently under-recorded due to:
        </p>

        <ul className="list-disc pl-6">
          <li>Inspection gaps</li>
          <li>Lost or incomplete records</li>
          <li>Sensor failures</li>
          <li>Administrative manipulation</li>
        </ul>

        <p>
          These failures allow critical thresholds to be crossed without
          durable acknowledgment.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Physical Plausibility">
        <ul className="list-disc pl-6">
          <li>UV-dose films</li>
          <li>Stress-indicating lacquers</li>
          <li>Corrosion-driven patinas</li>
          <li>Chemically gated color transitions</li>
        </ul>

        <p className="text-red-300">
          The transformation must be irreversible, threshold-calibrated, and
          resistant to tampering or environmental reversal.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Viable</p>
        <ul className="list-disc pl-6">
          <li>Predictable hazard environments</li>
          <li>Inspection-limited contexts</li>
          <li>Post-exposure accountability critical</li>
        </ul>

        <p className="font-semibold text-white mt-4">Failure</p>
        <ul className="list-disc pl-6">
          <li>Marker removal or concealment</li>
          <li>Uncharacterizable exposure regimes</li>
          <li>Use as substitute for maintenance</li>
        </ul>
      </Section>

      {/* DISTINCTION */}
      <Section title="Boundary Distinction">
        <p>IIEM is not:</p>

        <ul className="list-disc pl-6">
          <li>A sensor or monitoring system</li>
          <li>A predictive or diagnostic tool</li>
          <li>An alert or warning system</li>
          <li>A safety mechanism</li>
        </ul>

        <p className="text-red-300">
          It records past reality only. It does not interpret or predict.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6">
          <li>No reliable irreversible transition at threshold</li>
          <li>High false positive or negative rates</li>
          <li>Routine loss, tampering, or degradation</li>
          <li>Systematic institutional disregard</li>
        </ul>
      </Section>

      {/* ETHICS */}
      <Section title="Misuse Constraint">
        <ul className="list-disc pl-6">
          <li>Cannot replace inspection or maintenance</li>
          <li>Cannot imply safety or compliance</li>
          <li>Cannot shift responsibility onto the marker</li>
        </ul>

        <p className="text-red-300">
          The marker reveals failure—it does not prevent it.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Exposure-preserving transformations</p>
        <p><strong>Q:</strong> Total cumulative exposure</p>
        <p><strong>S:</strong> Irreversible marker state</p>

        <p className="text-red-300">
          Failure: mismatch between verified exposure and marker state
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim of compliance, safety, or stewardship that contradicts the
          invariant marker state is invalid.
        </p>

        <p className="text-red-300">
          Administrative, digital, or observational records do not override
          physical invariants.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          IIEM establishes a physical truth anchor. It does not improve safety,
          predict failure, or enforce behavior. It ensures that exposure,
          once incurred, cannot be denied, erased, or reinterpreted.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Truth-bound · Irreversible · Non-overridable · Versioned
      </div>
    </main>
  );
}
