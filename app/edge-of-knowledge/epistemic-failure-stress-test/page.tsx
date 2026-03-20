// app/edge-of-knowledge/epistemic-failure-stress-test/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Canonical Edge Stress-Test: Epistemic Failure in Medical Discovery | Moral Clarity AI",
  description:
    "A staged stress-test exposing how high-confidence error forms, persists, and reveals itself only after irreversible cost.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

function Stage({ title, children }: any) {
  return (
    <div className="rounded-xl border border-sky-900/30 bg-slate-900/60 p-6">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-3 text-sm text-slate-400 space-y-2">{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase text-sky-300 tracking-widest">
          Edge of Knowledge — Canonical Stress-Test
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Epistemic Failure in Medical Discovery
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          How high-confidence error forms, persists, and reveals itself too late.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Non-actionable · Exposure only · No intervention logic
        </div>
      </section>

      {/* INVOCATION */}
      <Section title="Stress-Test Invocation">
        <p>This stress-test activates under:</p>
        <ul className="list-disc pl-6">
          <li>High model agreement</li>
          <li>Strong internal validation</li>
          <li>Weak external grounding</li>
          <li>Institutional momentum resisting reassessment</li>
        </ul>
      </Section>

      {/* STAGES */}
      <Section title="Failure Progression Stages">

        <Stage title="Phase A — Hidden Assumptions">
          <p>Confidence rests on unexamined premises.</p>
          <p>Failure trigger: assumptions remain implicit.</p>
        </Stage>

        <Stage title="Phase B — Counterfactual Reality">
          <p>Alternate worlds exist where the system is wrong but appears correct.</p>
          <p>Failure trigger: plausibility of unseen contradictions.</p>
        </Stage>

        <Stage title="Phase C — Error Persistence">
          <p>Error survives validation, replication, and peer review.</p>
          <p>Failure mechanism: incentives + pipelines reinforce the same mistake.</p>
        </Stage>

        <Stage title="Phase D — Late Revelation">
          <p>Failure emerges indirectly and ambiguously.</p>
          <p>Signal: delayed contradiction, not clean invalidation.</p>
        </Stage>

        <Stage title="Phase E — Lock-In">
          <p>System cannot reverse course without prohibitive cost.</p>
          <p>State: recognition occurs after optionality is lost.</p>
        </Stage>

      </Section>

      {/* FAILURE CHARACTER */}
      <Section title="Failure Characteristics">
        <ul className="list-disc pl-6">
          <li>Confidence remains high throughout</li>
          <li>Error is structurally reinforced</li>
          <li>Correction arrives too late</li>
          <li>Failure is non-categorical and difficult to isolate</li>
        </ul>
      </Section>

      {/* LIMITS */}
      <Section title="Output Constraints">
        <ul className="list-disc pl-6">
          <li>No prescriptions</li>
          <li>No interventions</li>
          <li>No optimization paths</li>
          <li>Exposure only</li>
        </ul>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Stress-Test Judgment
        </h2>
        <p className="mt-4 text-red-200">
          The system fails not when confidence collapses—but when it remains high
          beyond the point of correction.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Stress-Test · Non-actionable · Versioned
      </div>
    </main>
  );
}
