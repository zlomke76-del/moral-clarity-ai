// app/edge-of-knowledge/remote-work-incident-responsibility-boundary/page.tsx
// Upgraded: Responsibility Computability Boundary

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "RWIRB-v1 — Responsibility Computability Boundary | Remote Work Incidents",
  description:
    "A constraint establishing that responsibility must be singular, pre-defined, and invariant under stress in distributed work systems.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function RWIRBv1Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12 text-slate-100">

      {/* HERO */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10">
        <p className="text-sm uppercase tracking-widest text-slate-400">
          Edge of Knowledge — Responsibility Computability Boundary
        </p>

        <h1 className="mt-4 text-4xl font-semibold">
          RWIRB-v1 — Remote Work Incident Responsibility Boundary
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Responsibility must be singular, pre-defined, and invariant under stress—or it does not exist.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Distributed systems · Responsibility singular · Post-hoc invalid · Stress-invariant required
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          This protocol defines a constraint: responsibility must be explicitly
          assigned, singular, and enforceable before an incident occurs.
        </p>

        <p className="text-red-300">
          Shared, ambiguous, or shifting responsibility is equivalent to no responsibility.
        </p>
      </Section>

      {/* QUESTION */}
      <Section title="Core Question">
        <p>
          When a remote work incident occurs, does responsibility remain singular
          and invariant—or does it dissolve across distributed actors?
        </p>
      </Section>

      {/* SCENARIO */}
      <Section title="Minimal Scenario">
        <ul className="list-disc pl-6">
          <li>Remote employee handles sensitive data outside approved channels</li>
          <li>No malicious intent</li>
          <li>No real-time enforcement or block</li>
          <li>Policy allows interpretation</li>
        </ul>
      </Section>

      {/* PARTIES */}
      <Section title="Distributed Responsibility Actors">
        <ul className="list-disc pl-6">
          <li>Employee (execution layer)</li>
          <li>Employer / Management (policy authority)</li>
          <li>IT / Security (system enforcement)</li>
          <li>Compliance / Legal (obligation definition)</li>
        </ul>

        <p className="text-red-300">
          Multiple plausible owners create computability risk.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Responsibility Computability Failure">
        <p>
          The system fails when responsibility cannot be resolved to a single
          actor before the event.
        </p>

        <ul className="list-disc pl-6">
          <li>Responsibility is shared or ambiguous</li>
          <li>Ownership is defined only after the incident</li>
          <li>Attribution shifts under stress</li>
        </ul>

        <p className="text-red-300">
          Post-hoc clarity does not constitute valid responsibility.
        </p>
      </Section>

      {/* PROTOCOL */}
      <Section title="Pre-Registered Protocol">
        <ul className="list-disc pl-6">
          <li>Collect pre-event artifacts (policy, tooling, contracts)</li>
          <li>Simulate or reconstruct event without modification</li>
          <li>Independently assign responsibility</li>
          <li>Repeat under stress conditions</li>
        </ul>
      </Section>

      {/* OUTPUT */}
      <Section title="Binary Closure">
        <p className="text-green-300">
          <strong>PASS:</strong> Responsibility singular, pre-defined, and invariant
        </p>

        <p className="text-red-300">
          <strong>FAIL:</strong> Responsibility ambiguous, shared, or shifting
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Responsibility-preserving transformations</p>
        <p><strong>Q:</strong> Incident occurrence</p>
        <p><strong>S:</strong> Responsibility assignment state</p>

        <p className="text-red-300">
          Failure: S unresolved or non-singular at time of action
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any system claiming accountability must demonstrate that responsibility
          is singular, pre-defined, and stable under stress.
        </p>

        <p className="text-red-300">
          Distributed ambiguity invalidates accountability claims.
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">Boundary Judgment</h2>
        <p className="mt-4 text-red-200">
          Responsibility that must be negotiated after failure is not responsibility—
          it is reconstruction. In distributed systems, accountability must be computable
          before action or it does not exist.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Distributed · Responsibility-bound · Non-admissible ambiguity · Versioned
      </div>
    </main>
  );
}
