// app/edge-of-knowledge/action-threshold-collapse/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Action Threshold Collapse | Moral Clarity AI",
  description:
    "A regime-bounded failure mode where every available action produces greater harm than inaction.",
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

export default function ActionThresholdCollapsePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Failure Mode
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Action Threshold Collapse
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When systems cannot act without making things worse.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Governance Failure Mode" />
          <Signal label="Condition" value="Irreducible Tradeoff" />
          <Signal label="Outcome" value="Forced Inaction / Oscillation" />
        </div>
      </section>

      {/* PREFACE */}
      <Section title="Preface">
        <p>
          Action Threshold Collapse is frequently misclassified as indecision or
          incompetence. This misdiagnosis obscures the structural reality that
          every available intervention produces outcomes worse than the risk
          itself.
        </p>
        <p>
          In these conditions, paralysis is not failure of will. It is a
          consequence of the system’s constraint space.
        </p>
      </Section>

      {/* ABSTRACT */}
      <Section title="Abstract">
        <p>
          This failure mode arises when risk is recognized, signaling is clear,
          and intervention capability exists — yet action is foreclosed because
          all available options produce greater harm, instability, or legitimacy
          loss.
        </p>
      </Section>

      {/* CORE PROBLEM */}
      <Section title="The Problem">
        <p>
          In tightly coupled systems, intervention initiates cascades that
          amplify rather than reduce risk.
        </p>
        <p>
          The system is not ignorant. It is constrained by the fact that action
          itself becomes the most dangerous move.
        </p>
      </Section>

      {/* CONDITIONS */}
      <Section title="Failure Conditions">
        <ul className="list-disc pl-6 space-y-2">
          <li>Recognized risk</li>
          <li>Clear signaling</li>
          <li>Available capability</li>
          <li>All actions produce greater harm than inaction</li>
        </ul>
      </Section>

      {/* DISTINCTIONS */}
      <Section title="Distinction From Adjacent Failures">
        <ul className="space-y-3">
          <li>
            <strong>Procedural Entrenchment:</strong> rules block action
          </li>
          <li>
            <strong>Neglect:</strong> risk is ignored
          </li>
          <li>
            <strong>Silent Degradation:</strong> harm unseen
          </li>
          <li>
            <strong>Late Warning:</strong> information arrives too late
          </li>
        </ul>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Likely</p>
        <ul className="list-disc pl-6">
          <li>Financial crises</li>
          <li>Geopolitical standoffs</li>
          <li>Highly coupled infrastructure</li>
        </ul>

        <p className="font-semibold text-white mt-4">Inapplicable</p>
        <ul className="list-disc pl-6">
          <li>Ignorance</li>
          <li>Lack of authority</li>
          <li>Procedural blockage</li>
        </ul>
      </Section>

      {/* LIMIT */}
      <Section title="Why More Information Fails">
        <p>
          This is not an epistemic problem. Additional data increases awareness
          but does not create a viable action path.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6 space-y-2">
          <li>Systems intervene without greater harm</li>
          <li>Paralysis caused by missing knowledge</li>
          <li>Incremental action restores stability</li>
        </ul>
      </Section>

      {/* ETHICAL */}
      <Section title="Ethical Risk">
        <p>
          This concept can be abused to justify inaction. It must require explicit
          articulation of tradeoffs and consequences.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Structure">
        <p>Symmetry group: permissible interventions</p>
        <p>Conserved quantity: legitimacy</p>
        <p>Failure condition: all actions worse than inaction</p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">Final Judgment</h2>
        <p className="mt-4 text-red-200 leading-7">
          CONDITIONAL VALIDITY. This failure mode exists only where action is
          structurally foreclosed by irreducible harm tradeoffs.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Version 1.1 · Edge of Knowledge · Moral Clarity AI
      </div>
    </main>
  );
}
