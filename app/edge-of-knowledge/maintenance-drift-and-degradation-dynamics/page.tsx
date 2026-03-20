// app/edge-of-knowledge/maintenance-drift-and-degradation-dynamics/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Maintenance Drift & Degradation Dynamics | Moral Clarity AI",
  description:
    "A validation-decay boundary showing how cumulative operational drift erodes the legitimacy of initial system validation over time.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function MaintenanceDriftPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Validation Decay Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Maintenance Drift & Degradation Dynamics
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Systems do not remain valid after validation. They drift.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Validation expires · Drift accumulates · Legitimacy degrades over time
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Definition">
        <p>
          Maintenance drift and degradation dynamics describe the cumulative,
          time-dependent divergence of a system from its validated state due to
          operation, wear, procedural erosion, and epistemic decay.
        </p>

        <p className="text-red-300">
          Validation is not preserved under operation. It decays as internal state evolves.
        </p>
      </Section>

      {/* GAP */}
      <Section title="Gap Identification">
        <p>
          Most systems assume equivalence between validated and operational states.
        </p>

        <p className="text-red-300">
          This assumption fails because cumulative exposure alters the invariant spectrum S.
        </p>

        <p>
          Failures often emerge not from discrete events, but from the untracked
          accumulation of drift.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Drift Mechanisms">
        <ul className="list-disc pl-6">
          <li>Material fatigue and wear</li>
          <li>Deferred or inconsistent maintenance</li>
          <li>Procedural shortcutting</li>
          <li>Knowledge loss and epistemic erosion</li>
        </ul>

        <p className="text-red-300">
          These processes are cumulative, low-salience, and often invisible to governance systems.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid</p>
        <ul className="list-disc pl-6">
          <li>Long-duration operational systems</li>
          <li>Maintenance-dependent infrastructure</li>
          <li>Institutions with evolving personnel and procedures</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails</p>
        <ul className="list-disc pl-6">
          <li>Purely static systems</li>
          <li>Singular catastrophic regimes with no precursor drift</li>
        </ul>
      </Section>

      {/* DISTINCTION */}
      <Section title="Boundary Distinction">
        <ul className="list-disc pl-6">
          <li>Not failure detection — drift precedes detection</li>
          <li>Not accountability — drift occurs without assignment</li>
          <li>Not boundary violation — occurs within validated regimes</li>
        </ul>

        <p className="text-red-300">
          This is the erosion of validity—not the moment of failure.
        </p>
      </Section>

      {/* VALIDATION DECAY */}
      <Section title="Validation Decay">
        <p>
          Validation applies only to the initial state S₀.
        </p>

        <p>
          As cumulative exposure alters S → S(t), equivalence to S₀ is lost.
        </p>

        <p className="text-red-300">
          Validation authority decays as S diverges from its validated configuration.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6">
          <li>No measurable drift between validation and operation</li>
          <li>No degradation prior to failure</li>
          <li>Existing systems fully capture drift effects</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Time and representation-preserving transformations</p>
        <p><strong>Q:</strong> Cumulative operational exposure</p>
        <p><strong>S:</strong> Degradation and drift spectrum</p>

        <p className="text-red-300">
          Failure: S diverges while validation remains treated as constant
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim of safety, reliability, or equivalence that does not account
          for drift in S is invalid.
        </p>

        <p className="text-red-300">
          Validation without re-binding to current state does not confer legitimacy.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Systems do not fail at the moment of breakdown—they fail long before,
          as validation decays unnoticed. Any framework that treats validated
          systems as static exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Time-bound · Drift-driven · Validation-decaying · Versioned
      </div>
    </main>
  );
}
