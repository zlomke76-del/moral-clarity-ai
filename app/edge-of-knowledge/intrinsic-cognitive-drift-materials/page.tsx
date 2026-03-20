// app/edge-of-knowledge/intrinsic-cognitive-drift-materials/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Intrinsic Cognitive-Drift Signaling Materials | Moral Clarity AI",
  description:
    "An autonomy-preserving signaling system that externalizes interaction drift without monitoring, inference, or authority transfer.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function CognitiveDriftMaterialsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Autonomy-Preserving Signal System
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Intrinsic Cognitive-Drift Signaling Materials
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Externalizing interaction drift without monitoring, inference, or authority.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          No monitoring · No inference · No scoring · No authority transfer
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Definition">
        <p>
          These materials convert patterns of human interaction into irreversible,
          perceptible physical changes that reflect cumulative behavioral drift.
        </p>

        <p className="text-red-300">
          They do not measure cognition. They do not interpret behavior. They do not diagnose.
        </p>
      </Section>

      {/* FUNCTION */}
      <Section title="System Function">
        <p>
          The system operates as a passive mirror:
        </p>

        <ul className="list-disc pl-6">
          <li>Interaction patterns → material state change</li>
          <li>No data extraction</li>
          <li>No abstraction layer</li>
          <li>No institutional visibility required</li>
        </ul>

        <p className="text-red-300">
          Meaning arises only within the user—not within the system.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Physical Mechanism Plausibility">
        <ul className="list-disc pl-6">
          <li>Interaction-induced hysteresis</li>
          <li>Force-pattern sensitivity (not magnitude alone)</li>
          <li>Temporal overuse ratchets</li>
          <li>Progressive tactile drift</li>
        </ul>

        <p>
          These encode cumulative interaction quality without semantic interpretation.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">High-value regimes</p>
        <ul className="list-disc pl-6">
          <li>Long-duration spaceflight</li>
          <li>Isolation-heavy environments</li>
          <li>Repetitive manual systems</li>
        </ul>

        <p className="font-semibold text-white mt-4">Failure regimes</p>
        <ul className="list-disc pl-6">
          <li>Short-duration missions</li>
          <li>High-speed decision environments</li>
          <li>Users unable to perceive subtle change</li>
        </ul>
      </Section>

      {/* DISTINCTION */}
      <Section title="Distinction from Monitoring Systems">
        <p>
          This system does not:
        </p>

        <ul className="list-disc pl-6">
          <li>Measure internal state</li>
          <li>Infer cognitive condition</li>
          <li>Generate scores or thresholds</li>
          <li>Trigger alerts or interventions</li>
        </ul>

        <p className="text-red-300">
          Any system performing these functions is not within this regime.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6">
          <li>No correlation with interaction degradation patterns</li>
          <li>Signals emerge too late or too ambiguously</li>
          <li>Users habituate or ignore signals</li>
          <li>Material interferes with task performance</li>
        </ul>
      </Section>

      {/* ETHICS */}
      <Section title="Ethical Constraint">
        <p>
          The system must preserve autonomy and trust:
        </p>

        <ul className="list-disc pl-6">
          <li>No monitoring or data capture</li>
          <li>No institutional visibility</li>
          <li>No disciplinary or evaluative use</li>
        </ul>

        <p className="text-red-300">
          The material may signal. It may not judge, score, or command.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Repeated interaction transformations</p>
        <p><strong>Q:</strong> Human autonomy</p>
        <p><strong>S:</strong> Irreversible material state encoding interaction quality</p>

        <p className="text-red-300">
          Failure: introduction of interpretation, inference, or authority layer
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim inferring cognitive state, diagnosing impairment, or enforcing
          behavior exceeds the epistemic and ethical boundary of this system.
        </p>

        <p className="text-red-300">
          This is a signaling system—not a cognitive system.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          The value of this system lies in what it refuses to do. It surfaces drift
          without interpretation, preserves autonomy without surveillance, and
          enables awareness without authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Autonomy-preserving · Non-inferential · Versioned
      </div>
    </main>
  );
}
