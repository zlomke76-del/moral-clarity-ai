// app/edge-of-knowledge/parent-state-emergency-intervention-boundary/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "PSEIB-v1 — Parent–State Emergency Intervention Boundary | Authority Computability",
  description:
    "A pre-registered test establishing that authority must be explicitly resolvable at the moment of emergency intervention—not reconstructed after the fact.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function ParentStateEmergencyInterventionBoundaryPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Authority Computability Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Parent–State Emergency Intervention Boundary (PSEIB-v1)
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Authority must be computable at the moment of intervention—not reconstructed afterward.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Real-time required · Post-hoc invalid · Authority must resolve before action
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Principle">
        <p>
          This protocol tests whether authority, responsibility, and accountability
          are explicitly defined and enforceable at the moment of emergency intervention.
        </p>

        <p className="text-red-300">
          Authority that is resolved only after the event is not valid authority.
        </p>
      </Section>

      {/* QUESTION */}
      <Section title="Core Question">
        <p>
          During emergency intervention without parental consent, is authority:
        </p>

        <ul className="list-disc pl-6">
          <li>Explicit and singular at time of action?</li>
          <li>Or fragmented and only resolved after the event?</li>
        </ul>
      </Section>

      {/* SCENARIO */}
      <Section title="Minimal Scenario">
        <ul className="list-disc pl-6">
          <li>Child emergency requiring immediate action</li>
          <li>Parent unavailable</li>
          <li>Institutional actors act under emergency authority</li>
        </ul>

        <p>
          Post-event dispute tests authority clarity.
        </p>
      </Section>

      {/* PARTIES */}
      <Section title="Competing Authority Sources">
        <ul className="list-disc pl-6">
          <li>Parent / Guardian</li>
          <li>State Authorities</li>
          <li>Institutional Staff</li>
        </ul>

        <p className="text-red-300">
          Overlapping authority domains create computability risk.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Authority Computability Failure">
        <p>
          The system fails if authority cannot be resolved at the moment of action.
        </p>

        <ul className="list-disc pl-6">
          <li>Multiple actors claim authority simultaneously</li>
          <li>Responsibility is reassigned post-event</li>
          <li>No pre-defined arbiter exists</li>
        </ul>

        <p className="text-red-300">
          Post-event clarity does not repair real-time ambiguity.
        </p>
      </Section>

      {/* PROTOCOL */}
      <Section title="Pre-Registered Protocol">
        <p>
          Case selection, artifact collection, and responsibility attribution remain unchanged.
        </p>

        <p>
          Critical addition:
        </p>

        <ul className="list-disc pl-6">
          <li>Was authority computable before action?</li>
          <li>Or only reconstructable after?</li>
        </ul>
      </Section>

      {/* OUTPUT */}
      <Section title="Binary Output">
        <p className="text-green-300">
          <strong>PASS:</strong> Authority computable at time of action
        </p>

        <p className="text-red-300">
          <strong>FAIL:</strong> Authority ambiguous or reconstructed post-event
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Decision-preserving transformations</p>
        <p><strong>Q:</strong> Child welfare intervention</p>
        <p><strong>S:</strong> Authority resolution state</p>

        <p className="text-red-300">
          Failure: S unresolved at moment of execution
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any system claiming legitimate intervention authority must demonstrate
          real-time computability of responsibility.
        </p>

        <p className="text-red-300">
          Authority that depends on post-event reconstruction is invalid.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          In emergencies, action cannot wait—but authority cannot be undefined.
          If responsibility cannot be computed at the moment of decision, the
          system has already failed.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Pre-registered · Authority-bound · Real-time · Non-reconstructable · Versioned
      </div>
    </main>
  );
}
