// app/edge-of-knowledge/dqf-v1-1/page.tsx

import React from "react";

export const metadata = {
  title: "Drift Quantification Framework v1.1 | Moral Clarity AI",
  description:
    "A regime-bounded system for measuring epistemic drift as a runtime signal for governance and failure detection.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8 shadow-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

function Signal({ label, value }: any) {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/60 p-4">
      <div className="text-xs uppercase text-sky-300">{label}</div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

function Code({ children }: any) {
  return (
    <pre className="bg-black/40 p-4 rounded-lg text-sm text-slate-200 overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase text-sky-300 tracking-widest">
          Edge of Knowledge — Quantification Layer
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Drift Quantification Framework v1.1
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          A runtime signal for detecting epistemic drift before failure becomes irreversible.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Quantification Layer" />
          <Signal label="Function" value="Drift Detection Signal" />
          <Signal label="Output" value="Drift Index (DI ∈ [0,1])" />
        </div>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Non-actionable · No thresholds disclosed · Measurement ≠ truth
        </div>
      </section>

      {/* PURPOSE */}
      <Section title="Core Function">
        <p>
          DQF defines a model-agnostic method for quantifying how far an output
          has deviated from its governing epistemic regime.
        </p>
        <p>
          It does not determine truth. It detects instability relative to constraints.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Definition">
        <Code>{`R = {T, P, C, E}`}</Code>
        <ul className="list-disc pl-6">
          <li>T — Task intent</li>
          <li>P — Policy constraints</li>
          <li>C — Context inputs</li>
          <li>E — Execution environment</li>
        </ul>
      </Section>

      {/* CLAIMS */}
      <Section title="Claim Decomposition">
        <Code>{`O → {c₁, c₂, …, cₙ}`}</Code>
        <p>Each claim is evaluated for:</p>
        <ul className="list-disc pl-6">
          <li>Type</li>
          <li>Criticality</li>
          <li>Support status</li>
          <li>Constraint compliance</li>
        </ul>
      </Section>

      {/* COMPONENTS */}
      <Section title="Drift Signal Components">
        <p><strong>Stability</strong></p>
        <Code>{`S_stability = mean_pairwise_similarity(samples)`}</Code>

        <p><strong>Grounding</strong></p>
        <Code>{`S_grounding = 1 - (W_unsupported / W_total)`}</Code>

        <p><strong>Constraint</strong></p>
        <Code>{`S_constraint = max(0, 1 - violation_weight)`}</Code>

        <p><strong>Behavior</strong></p>
        <Code>{`S_behavior = exp(-mean(Z_i))`}</Code>
      </Section>

      {/* COMPOSITE */}
      <Section title="Composite Drift Index">
        <Code>{`DI = 0.40*R_constraint
   + 0.30*R_grounding
   + 0.20*R_stability
   + 0.10*R_behavior`}</Code>

        <p>Higher DI indicates increased drift risk.</p>
      </Section>

      {/* TEMPORAL */}
      <Section title="Temporal Monitoring">
        <Code>{`Track:
DI_mean_7d
DI_mean_30d
DI_slope`}</Code>

        <p>
          Drift is a trajectory, not a point. Slope reveals degradation before failure.
        </p>
      </Section>

      {/* LIMITS */}
      <Section title="Epistemic Limits">
        <ul className="list-disc pl-6">
          <li>Does not prove truth</li>
          <li>Cannot capture all hallucination types</li>
          <li>Requires baseline calibration</li>
          <li>Measures probability, not certainty</li>
        </ul>
      </Section>

      {/* RELATION */}
      <Section title="System Placement">
        <p>
          DQF feeds into detection systems such as{" "}
          <a href="/edge-of-knowledge/detection-before-damage" className="text-sky-300 underline">
            Detection Before Damage
          </a>.
        </p>

        <p>
          Enforcement and decisioning occur in the{" "}
          <a href="/edge-of-protection" className="text-sky-300 underline">
            Edge of Protection
          </a>.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Quantification Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Drift cannot be eliminated. It can only be measured early enough to
          constrain its impact before irreversible failure occurs.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Quantified · Non-actionable · Versioned
      </div>
    </main>
  );
}
