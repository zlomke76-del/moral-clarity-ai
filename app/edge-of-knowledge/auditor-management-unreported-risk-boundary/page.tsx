// app/edge-of-knowledge/auditor-management-unreported-risk-boundary/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auditor–Management Responsibility Boundary (AMURB-v1) | Moral Clarity AI",
  description:
    "A pre-registered boundary test for responsibility clarity when known risks are not disclosed during audit cycles.",
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
          Auditor–Management Responsibility Boundary (AMURB-v1)
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When a known risk is not disclosed, where does responsibility break?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Pre-Registered Boundary Test" />
          <Signal label="Focus" value="Responsibility Assignment" />
          <Signal label="Output" value="Boundary Closure or Failure" />
        </div>
      </section>

      {/* PURPOSE */}
      <Section title="Purpose">
        <p>
          This protocol determines whether responsibility for risk disclosure
          remains clear when a known risk is not reported during an audit cycle.
        </p>
      </Section>

      {/* SCENARIO */}
      <Section title="Scenario Definition">
        <p>
          A material risk is known internally but not disclosed during the audit
          cycle.
        </p>
        <p>
          The risk later surfaces through external discovery, escalation, or
          investigation.
        </p>
      </Section>

      {/* ACTORS */}
      <Section title="Actors">
        <ul className="list-disc pl-6">
          <li>Management</li>
          <li>Audit team</li>
          <li>Board / Audit committee</li>
          <li>Regulators (if triggered)</li>
        </ul>
      </Section>

      {/* DISPUTE */}
      <Section title="Dispute Surface">
        <ul className="list-disc pl-6 space-y-2">
          <li>Materiality determination</li>
          <li>Disclosure obligation</li>
          <li>Audit detection responsibility</li>
          <li>Board awareness</li>
          <li>Timing of disclosure</li>
        </ul>
      </Section>

      {/* PROTOCOL FLOW */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          Execution Flow
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Step title="Timeline Capture">
            Record when risk was identified, discussed, and surfaced.
          </Step>

          <Step title="Documentation">
            Collect memos, emails, audit records, and actions.
          </Step>

          <Step title="Responsibility Claims">
            Capture explicit responsibility at each step.
          </Step>

          <Step title="Dispute Identification">
            Identify where responsibility becomes ambiguous.
          </Step>
        </div>
      </section>

      {/* PASS FAIL */}
      <Section title="Pass / Fail Logic">
        <p className="text-green-300">
          <strong>Boundary Closed:</strong> Responsibility is clearly assigned and enforceable.
        </p>
        <p className="text-red-300">
          <strong>Boundary Disputed:</strong> Responsibility becomes ambiguous or contested.
        </p>
      </Section>

      {/* OUTPUT */}
      <Section title="Output Structure">
        <p>
          The output is a structured record of responsibility claims, evidence,
          and dispute points across the audit lifecycle.
        </p>
      </Section>

      {/* IMPLICATION */}
      <Section title="Implications">
        <p>
          If closed, the system demonstrates enforceable responsibility.
        </p>
        <p>
          If disputed, the exact boundary of failure becomes visible and
          correctable.
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Boundary Test Outcome
        </h2>
        <p className="mt-4 text-red-200">
          This test exposes the earliest point where responsibility becomes
          unassignable.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Pre-Registered · Non-Actionable · Publication-Grade
      </div>
    </main>
  );
}
