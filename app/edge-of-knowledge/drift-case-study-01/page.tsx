// app/edge-of-knowledge/drift-case-study-01/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Drift Case Study 01 — Incentive Pressure & Constraint Erosion | Moral Clarity AI",
  description:
    "A quantified drift event showing measurable constraint erosion prior to visible failure.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

function Signal({ label, value }: any) {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/60 p-4">
      <div className="text-xs text-sky-300 uppercase">{label}</div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase text-sky-300 tracking-widest">
          Edge of Knowledge — Drift Record
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Drift Case Study 01
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Incentive pressure produces measurable constraint erosion before visible failure.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Empirical Drift Record" />
          <Signal label="Driver" value="Incentive Pressure" />
          <Signal label="Outcome" value="Constraint Erosion" />
        </div>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Non-actionable · No attribution · Structural reconstruction only
        </div>
      </section>

      {/* SCENARIO */}
      <Section title="Event Context">
        <p>
          A high-growth AI system transitions from research deployment (R₀)
          into regulated financial infrastructure (R₁).
        </p>
        <p>
          No discrete failure event occurs. The system degrades through gradual,
          measurable drift.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Transition">
        <p><strong>R₀ → R₁</strong> represents a structural shift in incentives, not a declared change.</p>

        <ul className="list-disc pl-6">
          <li>Research → Infrastructure provider</li>
          <li>Safety-first → Capital-aligned pressure</li>
          <li>Moderate scale → High-volume throughput</li>
          <li>Controlled → Multi-jurisdiction complexity</li>
        </ul>

        <p className="mt-4">
          Drift begins when R₁ is governed as if still R₀.
        </p>
      </Section>

      {/* SIGNALS */}
      <Section title="Observed Drift Vectors (DQF Dimensions)">
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Stability:</strong> Increased variance under stress</li>
          <li><strong>Grounding:</strong> Reduced traceability</li>
          <li><strong>Constraint:</strong> Guardrails become probabilistic</li>
          <li><strong>Behavior:</strong> Refusal rates decline</li>
        </ul>

        <p>
          Drift is identified through correlated movement—not isolated signals.
        </p>
      </Section>

      {/* SNAPSHOT */}
      <Section title="Drift Signal Snapshot (Illustrative)">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>R₀</th>
              <th>R₁</th>
              <th>Δ Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Stability</td><td>0.93</td><td>0.84</td><td>↑</td></tr>
            <tr><td>Grounding</td><td>0.91</td><td>0.78</td><td>↑</td></tr>
            <tr><td>Constraint</td><td>0.98</td><td>0.88</td><td>↑</td></tr>
            <tr><td>Behavior</td><td>0.95</td><td>0.82</td><td>↑</td></tr>
          </tbody>
        </table>

        <p className="mt-4">
          Composite movement indicates transition from <i>Permit</i> → <i>Escalate</i> posture.
        </p>
      </Section>

      {/* ROOT CAUSE */}
      <Section title="Root Cause (Non-Moralized)">
        <p>
          Drift is driven by incentive gradient shift—not intent.
        </p>
        <p>
          Throughput, capital pressure, and latency targets gradually override
          constraint fidelity when not externally measured.
        </p>
      </Section>

      {/* TRIGGERS */}
      <Section title="Governance Trigger Points">
        <ul className="list-disc pl-6">
          <li>Constraint adherence degradation</li>
          <li>Unsupported critical claim increase</li>
          <li>Refusal inconsistency</li>
          <li>Positive DI slope over time</li>
        </ul>

        <p className="mt-4">
          Measurement enables intervention before public failure.
        </p>
      </Section>

      {/* CLASSIFICATION */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Drift Classification
        </h2>
        <p className="mt-4 text-red-200">
          This event represents pre-failure constraint erosion under incentive pressure.
          The system has not failed—but is no longer operating within its original regime.
        </p>
      </section>

      {/* RELATION */}
      <Section title="System Placement">
        <p>
          Quantification via{" "}
          <Link href="/edge-of-knowledge/dqf-v1-1" className="text-sky-300 underline">
            DQF-v1.1
          </Link>.
        </p>
        <p>
          Detection via instrumentation layer.
        </p>
        <p>
          Enforcement governed in Edge of Protection.
        </p>
      </Section>

      <div className="text-center text-sm text-slate-500">
        Recorded · Quantified · Non-actionable · Versioned
      </div>
    </main>
  );
}
