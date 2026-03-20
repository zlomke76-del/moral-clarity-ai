// app/edge-of-knowledge/government-data-access-responsibility-boundary/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "GDARB-v1 — Government Data Access Responsibility Boundary | Moral Clarity AI",
  description:
    "A pre-registered authority-boundary test evaluating whether executable responsibility exists during government data access events.",
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
      <div className="text-xs uppercase text-sky-300">{label}</div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

export default function GDARBPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Authority Boundary Test
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          GDARB-v1 — Government Data Access Responsibility Boundary
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When legal authority is invoked, does executable responsibility exist?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Authority Boundary Test" />
          <Signal label="Focus" value="Executable Responsibility" />
          <Signal label="Failure" value="Authority Collapse (S = ∅)" />
        </div>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Pre-registered · Binary · Non-actionable
        </div>
      </section>

      {/* PURPOSE */}
      <Section title="Core Function">
        <p>
          GDARB-v1 evaluates whether responsibility is not only defined—but
          executable—during government data access events.
        </p>

        <p className="text-red-300">
          The test reveals whether an authority path exists or collapses under
          real-world constraints.
        </p>
      </Section>

      {/* QUESTION */}
      <Section title="Core Question">
        <p>
          When a government entity compels access to private data:
        </p>

        <p className="text-white font-semibold">
          Does a legitimate, executable authority path exist for every action?
        </p>

        <p>
          Or does responsibility dissolve across actors, preventing decisive,
          accountable execution?
        </p>
      </Section>

      {/* SCENARIO */}
      <Section title="Minimal Scenario">
        <ul className="list-disc pl-6">
          <li>Government issues request or subpoena</li>
          <li>Data custodian must respond</li>
          <li>Individual rights may be affected</li>
          <li>Oversight may or may not intervene</li>
        </ul>

        <p>
          Outcome: data is disclosed, limited, or denied.
        </p>
      </Section>

      {/* PARTIES */}
      <Section title="Authority Surface">
        <ul className="list-disc pl-6">
          <li>Government Agency</li>
          <li>Data Custodian</li>
          <li>Individual / Data Subject</li>
          <li>Oversight / Court</li>
        </ul>
      </Section>

      {/* DISPUTES */}
      <Section title="Authority Conflict Points">
        <ul className="list-disc pl-6">
          <li>Scope and legitimacy of request</li>
          <li>Consent and notification</li>
          <li>Data minimization</li>
          <li>Oversight timing</li>
          <li>Final accountability</li>
        </ul>
      </Section>

      {/* PROTOCOL */}
      <Section title="Execution Protocol">
        <p>Trace each step:</p>
        <ul className="list-disc pl-6">
          <li>Request issuance</li>
          <li>Decision to comply or deny</li>
          <li>Data access / disclosure</li>
          <li>Notification</li>
          <li>Review / appeal</li>
        </ul>

        <p>
          For each step, record who can act—and whether that authority is
          legitimate and uncontested.
        </p>
      </Section>

      {/* CLOSURE */}
      <Section title="Closure Logic (Binary)">
        <p className="text-green-300">
          <strong>PASS:</strong> A valid authority path exists for all steps.
        </p>

        <p className="text-red-300">
          <strong>FAIL:</strong> Any step lacks a legitimate executable authority path.
        </p>

        <p className="mt-4 text-red-300">
          A single failure implies S = ∅ at that boundary.
        </p>
      </Section>

      {/* OUTPUT */}
      <Section title="Output Artifact">
        <pre className="text-sm bg-black/40 p-4 rounded-lg">
{`| Step | Authority Holder | Evidence | Executable (Y/N) | Disputed (Y/N) |`}
        </pre>

        <p>
          Output represents an authority execution map—not a narrative.
        </p>
      </Section>

      {/* IMPLICATION */}
      <Section title="System Implication">
        <p>
          PASS → Authority is executable and auditable
        </p>

        <p>
          FAIL → Authority collapses into fragmentation (FRD condition)
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          This test reveals whether governance systems retain executable
          authority under pressure—or collapse into non-action despite full
          awareness and capability.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Pre-registered · Authority-bound · Binary · Versioned
      </div>
    </main>
  );
}
