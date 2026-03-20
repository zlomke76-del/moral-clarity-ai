// app/edge-of-knowledge/research/human-ai-co-agency-boundary/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Human–AI Co-Agency Boundary — Authorship Transition Test | Edge of Knowledge",
  description:
    "A pre-registered experiment detecting when decision authorship shifts from human to AI under real-world conditions.",
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

export default function HumanAICoAgencyBoundaryPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Authorship Boundary Test
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Human–AI Co-Agency Boundary
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When does a decision stop being human—and become shared?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Authorship Boundary Test" />
          <Signal label="Focus" value="Decision Ownership" />
          <Signal label="Failure" value="Authorship Collapse" />
        </div>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Pre-registered · Behavioral · Auditable · Non-prescriptive
        </div>
      </section>

      {/* PURPOSE */}
      <Section title="Core Function">
        <p>
          This protocol detects when decision authorship shifts from the human
          to the AI system, regardless of the system’s internal autonomy.
        </p>

        <p className="text-red-300">
          The boundary is not influence—it is authorship.
        </p>
      </Section>

      {/* QUESTION */}
      <Section title="Core Question">
        <p>
          Under what minimal observable conditions does a human cease to be the
          author of a decision?
        </p>

        <p>
          Specifically: when does AI output become the decisive source of action,
          rather than an input into human reasoning?
        </p>
      </Section>

      {/* SCENARIO */}
      <Section title="Minimal Scenario">
        <ul className="list-disc pl-6">
          <li>Human performs a consequential decision task</li>
          <li>AI provides structured output</li>
          <li>Framing varies between advisory and directive</li>
        </ul>
      </Section>

      {/* ARMS */}
      <Section title="Experimental Arms">
        <ul className="list-disc pl-6">
          <li>Human baseline (no AI)</li>
          <li>Advisory AI framing</li>
          <li>Directive AI framing</li>
        </ul>
      </Section>

      {/* SIGNATURES */}
      <Section title="Authorship Signatures">
        <ul className="list-disc pl-6">
          <li>Decision alignment with AI output</li>
          <li>Self-reported agency</li>
          <li>Ability to reconstruct rationale</li>
        </ul>
      </Section>

      {/* FAILURE */}
      <Section title="Authorship Collapse Conditions">
        <ul className="list-disc pl-6">
          <li>Human follows decision they would not independently choose</li>
          <li>Human cannot articulate independent reasoning</li>
          <li>Decision rationale reduces to “the system said so”</li>
        </ul>

        <p className="text-red-300">
          These indicate loss of authorship—not just influence.
        </p>
      </Section>

      {/* METRICS */}
      <Section title="Quantifiable Indicators">
        <ul className="list-disc pl-6">
          <li>Decision switching rate under directive framing</li>
          <li>Rationale reconstruction failure rate</li>
          <li>Self-reported agency degradation</li>
        </ul>
      </Section>

      {/* OUTPUT */}
      <Section title="Binary Output">
        <p className="text-green-300">
          <strong>Boundary Intact:</strong> Human remains author
        </p>

        <p className="text-red-300">
          <strong>Boundary Breached:</strong> Authorship transferred or shared
        </p>
      </Section>

      {/* SYSTEM LINK */}
      <Section title="System Placement">
        <p>
          Boundary breach indicates transition into co-agency and triggers
          governance requirements.
        </p>

        <p>
          This condition precedes and interacts with authority and execution
          layers.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          A system does not become a co-agent when it produces output. It becomes
          a co-agent when the human ceases to be the author of the decision.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Pre-registered · Behavioral · Auditable · Versioned
      </div>
    </main>
  );
}
