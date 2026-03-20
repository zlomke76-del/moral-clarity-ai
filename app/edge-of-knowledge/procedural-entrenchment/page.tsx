// app/edge-of-knowledge/procedural-entrenchment/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Procedural Entrenchment: Execution Admissibility Boundary | Moral Clarity AI",
  description:
    "A governance constraint identifying failure when known risk cannot be converted into admissible action due to procedural inertia.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function ProceduralEntrenchmentPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Execution Admissibility Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Procedural Entrenchment
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When risk is known but action is not admissible, governance has failed its execution function.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Risk known · Action blocked · Execution invalid · Post-recognition failure
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          Procedural Entrenchment defines a failure state in which recognized
          risk persists because governance structures prevent timely and
          proportional action.
        </p>

        <p className="text-red-300">
          Governance that cannot convert knowledge into action is not valid within that regime.
        </p>
      </Section>

      {/* FAILURE DEFINITION */}
      <Section title="Failure Mode Definition">
        <p>
          The system fails when:
        </p>

        <ul className="list-disc pl-6">
          <li>Risk is explicitly recognized</li>
          <li>Capacity to act exists</li>
          <li>Action is procedurally constrained or delayed</li>
        </ul>

        <p className="text-red-300">
          Awareness without admissible execution is a structural failure—not a delay.
        </p>
      </Section>

      {/* MECHANISMS */}
      <Section title="Mechanisms of Entrenchment">
        <ul className="list-disc pl-6">
          <li>Procedural recursion without escalation authority</li>
          <li>Liability structures favoring inaction over deviation</li>
          <li>Fragmented authority preventing decisive ownership</li>
          <li>Normalization of persistent, known hazards</li>
        </ul>
      </Section>

      {/* EXECUTION FAILURE */}
      <Section title="Execution Admissibility Failure">
        <p>
          The critical failure is not informational—it is operational.
        </p>

        <p className="text-red-300">
          If action is not admissible within governance, execution is structurally blocked.
        </p>

        <p>
          Post-event accountability does not repair this failure.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Applies when:</p>
        <ul className="list-disc pl-6">
          <li>Risk is known and documented</li>
          <li>Signals are sufficient</li>
          <li>Capability exists</li>
          <li>Governance blocks execution</li>
        </ul>

        <p className="font-semibold text-white mt-4">Does not apply when:</p>
        <ul className="list-disc pl-6">
          <li>Risk is unknown</li>
          <li>Capability is absent</li>
          <li>Signals are missing or suppressed</li>
        </ul>
      </Section>

      {/* DISTINCTION */}
      <Section title="Boundary Distinction">
        <p>This is not:</p>

        <ul className="list-disc pl-6">
          <li>Neglect (risk is known)</li>
          <li>Signal failure (information exists)</li>
          <li>Capability gap (tools are available)</li>
        </ul>

        <p className="text-red-300">
          The failure exists within governance logic itself.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6">
          <li>Procedures adapt reliably to known risk</li>
          <li>Governance enables timely action</li>
          <li>Delays are caused by true uncertainty or incapacity</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Procedure-preserving transformations</p>
        <p><strong>Q:</strong> Recognized risk</p>
        <p><strong>S:</strong> Execution admissibility state</p>

        <p className="text-red-300">
          Failure: Q exists while S blocks action
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any governance system claiming effectiveness must demonstrate that
          recognized risk can be converted into admissible action.
        </p>

        <p className="text-red-300">
          Process continuity cannot substitute for outcome execution.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Governance exists to enable action under uncertainty. When it prevents
          action after certainty is achieved, it has exceeded its valid regime.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Execution-bound · Post-recognition · Non-admissible delay · Versioned
      </div>
    </main>
  );
}
