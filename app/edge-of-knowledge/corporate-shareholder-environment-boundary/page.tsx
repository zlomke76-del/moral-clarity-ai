// app/edge-of-knowledge/corporate-shareholder-environment-boundary/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Corporate–Shareholder–Environment Responsibility Boundary (CSEB-v1) | Moral Clarity AI",
  description:
    "A pre-registered boundary test exposing responsibility gaps in environmental reporting after minor infractions.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8 shadow-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300 leading-7">
        {children}
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/60 p-4">
      <div className="text-xs uppercase tracking-widest text-sky-300">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-sky-900/30 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-slate-400">{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Boundary Test
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Corporate–Shareholder–Environment Responsibility Boundary (CSEB-v1)
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When a minor infraction occurs, who is actually responsible?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Pre-Registered Boundary Test" />
          <Signal label="Focus" value="Responsibility Assignment" />
          <Signal label="Outcome" value="Closure or Dispute" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Minimal · Decisive · Non-actionable
        </div>
      </section>

      {/* SCENARIO */}
      <Section title="Scenario">
        <p>
          A minor environmental infraction occurs within a regulated corporate
          system.
        </p>
        <p>
          The event is non-catastrophic but introduces ambiguity around
          disclosure, materiality, and responsibility.
        </p>
      </Section>

      {/* ACTORS */}
      <Section title="Responsibility Surface">
        <ul className="list-disc pl-6 space-y-2">
          <li>Management / Board</li>
          <li>Compliance / Legal</li>
          <li>Operations</li>
          <li>Shareholders</li>
          <li>Auditors</li>
          <li>Regulators</li>
        </ul>
      </Section>

      {/* DISPUTE */}
      <Section title="Dispute Points">
        <ul className="list-disc pl-6 space-y-2">
          <li>Materiality classification</li>
          <li>Disclosure obligation</li>
          <li>Ownership of decision</li>
          <li>Timing of reporting</li>
          <li>Certification of remediation</li>
        </ul>
      </Section>

      {/* FLOW */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          Execution Flow
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Step title="Detection">
            Record when the infraction is identified and logged.
          </Step>

          <Step title="Internal Review">
            Capture evaluation, escalation, and materiality assessment.
          </Step>

          <Step title="Disclosure Decision">
            Identify who authorizes or defers disclosure.
          </Step>

          <Step title="External Reporting">
            Record regulator and shareholder communication.
          </Step>

          <Step title="Remediation">
            Track corrective actions and certification.
          </Step>

          <Step title="Audit / Verification">
            Capture third-party validation or challenge.
          </Step>
        </div>
      </section>

      {/* PASS FAIL */}
      <Section title="Boundary Closure Logic">
        <p className="text-green-300">
          <strong>Closed:</strong> Each step has a single, uncontested
          responsible party with evidence.
        </p>

        <p className="text-red-300">
          <strong>Disputed:</strong> Any ambiguity, overlap, or conflicting
          claim of responsibility.
        </p>

        <p className="mt-4">
          A single disputed step is sufficient to fail the boundary.
        </p>
      </Section>

      {/* OUTPUT */}
      <Section title="Output Artifact">
        <p>
          The result is a structured responsibility chain with explicit evidence
          and dispute markers.
        </p>
        <p>
          This output is not interpretive—it is evidentiary.
        </p>
      </Section>

      {/* IMPLICATION */}
      <Section title="System Implication">
        <p>
          If closed → the system demonstrates enforceable responsibility.
        </p>
        <p>
          If disputed → responsibility is structurally unassignable at the
          identified boundary.
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Boundary Test Outcome
        </h2>
        <p className="mt-4 text-red-200">
          This test reveals the earliest point at which responsibility ceases to
          be clearly assignable.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Pre-Registered · Minimal · Decisive · Publication-grade
      </div>
    </main>
  );
}
