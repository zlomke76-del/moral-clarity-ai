// app/edge-of-knowledge/critical-boundaries-for-testing/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Critical Boundaries for Publication-Grade Testing | Moral Clarity AI",
  description:
    "A selection framework identifying which system boundaries require minimal, falsifiable, publication-grade testing.",
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

function Boundary({
  title,
  test,
  output,
}: {
  title: string;
  test: string;
  output: string;
}) {
  return (
    <div className="rounded-xl border border-sky-900/30 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-400">
        <strong>Test:</strong> {test}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        <strong>Output:</strong> {output}
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Meta Framework
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Critical Boundaries for Publication-Grade Testing
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Which system edges are worth testing—and why.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Selection Framework" />
          <Signal label="Function" value="Test Prioritization" />
          <Signal label="Output" value="Boundary → Test Mapping" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Framework · Non-exhaustive · Test generation layer
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Function">
        <p>
          This framework identifies system boundaries where ambiguity
          translates directly into operational, safety, or governance risk.
        </p>
        <p>
          Each boundary represents a location where a minimal, falsifiable test
          can materially improve system clarity.
        </p>
      </Section>

      {/* SELECTION LOGIC */}
      <Section title="Selection Criteria">
        <ul className="list-disc pl-6 space-y-2">
          <li>Ambiguity blocks responsibility or accountability</li>
          <li>Failure propagates across system boundaries</li>
          <li>Human interpretation substitutes for clear assignment</li>
          <li>System behavior cannot be validated through inspection alone</li>
        </ul>
      </Section>

      {/* BOUNDARY SURFACES */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          Critical Boundary Surfaces
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Boundary
            title="Cross-Functional Coordination"
            test="Where does ownership break between teams?"
            output="Responsibility ambiguity under handoff"
          />

          <Boundary
            title="Data Privacy / Security"
            test="Where does data cross containment boundaries?"
            output="Leakage or unauthorized access"
          />

          <Boundary
            title="Authorization / Access Control"
            test="Where does privilege escalation occur?"
            output="Unintended access states"
          />

          <Boundary
            title="Input Validation"
            test="Which invalid inputs pass system guards?"
            output="Acceptance of out-of-bound states"
          />

          <Boundary
            title="Fault Containment"
            test="Where do failures propagate beyond isolation?"
            output="Cross-boundary failure spread"
          />

          <Boundary
            title="API / Module Integration"
            test="Where do contract mismatches occur?"
            output="Silent or partial system failure"
          />

          <Boundary
            title="Scaling / Resource Limits"
            test="Where does performance degrade into failure?"
            output="First observable system collapse signal"
          />

          <Boundary
            title="External Dependencies"
            test="What external failures penetrate system boundaries?"
            output="Dependency-induced instability"
          />
        </div>
      </section>

      {/* WHY THIS MATTERS */}
      <Section title="Why These Boundaries Matter">
        <p>
          Each boundary represents a point where untested ambiguity becomes a
          live risk vector.
        </p>
        <p>
          Testing these surfaces produces reusable, publication-grade evidence
          of system behavior under stress.
        </p>
      </Section>

      {/* TEST GENERATION */}
      <Section title="Test Generation Principle">
        <p>
          For each boundary, construct the minimal test that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Forces the boundary condition</li>
          <li>Produces a binary outcome</li>
          <li>Generates an evidentiary artifact</li>
        </ul>
        <p>
          Negative results close ambiguity. Positive results define the next
          sharper boundary.
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Framework Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Systems fail at boundaries that are not tested. This framework
          identifies which boundaries must be tested first.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Meta-layer · Boundary selection · Non-actionable
      </div>
    </main>
  );
}
