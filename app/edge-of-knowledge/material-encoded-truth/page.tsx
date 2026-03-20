// app/edge-of-knowledge/material-encoded-truth/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Material-Encoded Truth: Physics-Enforced Epistemic Boundary | Moral Clarity AI",
  description:
    "A foundational doctrine establishing that invariant physical state overrides institutional, digital, and narrative representations of risk.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function MaterialEncodedTruthPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Foundational Truth Doctrine
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Material-Encoded Truth
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When representation fails, truth must be enforced by physics.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Irreversible · Non-overridable · Representation-independent · Physics-enforced
        </div>
      </section>

      {/* CORE LAW */}
      <Section title="Core Doctrine">
        <p>
          Material-encoded truth establishes that cumulative risk, once encoded
          in invariant physical state, cannot be negated by documentation,
          monitoring systems, institutional narratives, or human interpretation.
        </p>

        <p className="text-red-300">
          When conflict exists, invariant physical state is the authoritative record.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="The Failure of Representation">
        <p>
          Most safety systems rely on representation:
        </p>

        <ul className="list-disc pl-6">
          <li>Inspection reports</li>
          <li>Sensor data</li>
          <li>Administrative logs</li>
          <li>Compliance frameworks</li>
        </ul>

        <p>
          These are vulnerable to delay, minimization, misalignment of incentives,
          or deliberate manipulation.
        </p>

        <p className="text-red-300">
          When representation diverges from reality, failure becomes inevitable.
        </p>
      </Section>

      {/* PRINCIPLE */}
      <Section title="Material-Encoded Truth Principle">
        <p>
          Truth is encoded directly into material state through irreversible,
          path-dependent transformations driven by real exposure.
        </p>

        <ul className="list-disc pl-6">
          <li>Encoding is intrinsic, not observed</li>
          <li>History is preserved, not reconstructed</li>
          <li>State is irreversible, not resettable</li>
          <li>Denial requires physical destruction</li>
        </ul>
      </Section>

      {/* MECHANISMS */}
      <Section title="Physical Realization">
        <ul className="list-disc pl-6">
          <li>Hysteretic phase transformations</li>
          <li>Irreversible microstructural evolution</li>
          <li>Progressive crack or domain formation</li>
          <li>Monotonic chemical state changes</li>
        </ul>

        <p>
          These mechanisms ensure that exposure history becomes inseparable from material state.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid</p>
        <ul className="list-disc pl-6">
          <li>Cumulative hazard systems</li>
          <li>Long-lived infrastructure</li>
          <li>Low-trust or misaligned incentive environments</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails</p>
        <ul className="list-disc pl-6">
          <li>Non-cumulative hazards</li>
          <li>Disposable systems</li>
          <li>Environments where signals can be erased without consequence</li>
        </ul>
      </Section>

      {/* DISTINCTION */}
      <Section title="Boundary Distinction">
        <p>
          Material-encoded truth is not:
        </p>

        <ul className="list-disc pl-6">
          <li>Monitoring</li>
          <li>Analytics</li>
          <li>Compliance</li>
          <li>Prediction</li>
        </ul>

        <p className="text-red-300">
          It is a constraint on truth—not a method of observation.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6">
          <li>State can be reset without loss of function</li>
          <li>Weak correlation with real exposure</li>
          <li>Signals can be ignored without consequence</li>
          <li>Representation can override physical state</li>
        </ul>
      </Section>

      {/* ETHICS */}
      <Section title="Ethical Constraint">
        <p>
          This system must not be used as a substitute for maintenance,
          engineering controls, or systemic reform.
        </p>

        <p className="text-red-300">
          It exposes truth. It does not enforce action.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Representation-preserving transformations</p>
        <p><strong>Q:</strong> Cumulative real-world exposure</p>
        <p><strong>S:</strong> Irreversible material state encoding history</p>

        <p className="text-red-300">
          Failure: divergence between representation and S
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim of safety, compliance, or equivalence that contradicts
          invariant material state is invalid.
        </p>

        <p className="text-red-300">
          Representation does not override physics.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          When systems fail, it is often not because truth was unknown—but
          because it was suppressible. Material-encoded truth removes that
          possibility. Once encoded, reality cannot be negotiated.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Physics-bound · Non-overridable · Foundational · Versioned
      </div>
    </main>
  );
}
