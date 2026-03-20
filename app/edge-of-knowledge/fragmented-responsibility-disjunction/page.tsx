// app/edge-of-knowledge/fragmented-responsibility-disjunction/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fragmented Responsibility Disjunction | Moral Clarity AI",
  description:
    "A terminal execution failure state where risk is known and capability exists, but no legitimate authority path enables action.",
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

export default function FragmentedResponsibilityDisjunctionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Execution Failure State
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Fragmented Responsibility Disjunction
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Recognized risk without executable authority.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Execution-Impossibility State" />
          <Signal label="Trigger" value="Fragmented Authority" />
          <Signal label="Failure" value="No Executable Path" />
        </div>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Diagnostic only · Non-actionable · Authority-bound
        </div>
      </section>

      {/* PREFACE */}
      <Section title="Preface">
        <p>
          Governance failures are often attributed to ignorance or unwillingness.
          This fails to explain a distinct condition:
        </p>
        <p className="text-red-300">
          Systems where risk is known, capability exists, and action is beneficial—
          yet no action occurs because no legitimate authority can act.
        </p>
      </Section>

      {/* CORE */}
      <Section title="State Definition">
        <p>
          Fragmented Responsibility Disjunction is a terminal execution failure
          state in which:
        </p>
        <ul className="list-disc pl-6">
          <li>Risk is explicitly recognized</li>
          <li>Capability to respond is present</li>
          <li>Action is beneficial and feasible</li>
          <li>No actor can act without violating legitimacy constraints</li>
        </ul>

        <p>
          The system is fully aware and fully capable—but structurally unable to act.
        </p>
      </Section>

      {/* ENTRY CONDITIONS */}
      <Section title="Entry Conditions (All Required)">
        <ul className="list-disc pl-6">
          <li>Risk is formally acknowledged</li>
          <li>Signaling is sufficient and credible</li>
          <li>System capability is preserved</li>
          <li>Authority is distributed across actors</li>
          <li>No actor has unilateral legitimacy</li>
          <li>No binding coordination mechanism exists</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework Declaration">
        <p><strong>G (Symmetry):</strong> Reassignments of authority across actors</p>
        <p><strong>Q (Conserved):</strong> Total system capability</p>
        <p><strong>S (State Space):</strong> Executable authority paths</p>

        <p className="mt-4 text-red-300">
          Failure signature: S = ∅ (no legitimate execution path exists)
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Mechanism of Failure">
        <ul className="list-disc pl-6 space-y-2">
          <li>Overlapping mandates prevent unilateral action</li>
          <li>Non-hierarchical authority blocks escalation</li>
          <li>Coordination requires consensus without enforcement</li>
          <li>Actors remain within legitimacy bounds while inaction persists</li>
        </ul>

        <p>
          The system is not blocked by rules—it is blocked by the structure of authority itself.
        </p>
      </Section>

      {/* DATA LIMIT */}
      <Section title="Why More Information Cannot Resolve It">
        <p>
          Additional data does not create authority.
        </p>
        <p>
          When S = ∅, signaling increases awareness without enabling execution.
        </p>
        <p className="text-red-300">
          The constraint is structural, not informational.
        </p>
      </Section>

      {/* DISTINCTIONS */}
      <Section title="Boundary Distinctions">
        <ul className="list-disc pl-6">
          <li>Not ignorance — risk is known</li>
          <li>Not lock-in — interpretation is correct</li>
          <li>Not inertia — actors could act individually</li>
          <li>Not procedural failure — authority itself is misaligned</li>
        </ul>
      </Section>

      {/* TERMINAL */}
      <Section title="Terminal State Characteristics">
        <ul className="list-disc pl-6">
          <li>Awareness remains high</li>
          <li>Capability remains intact</li>
          <li>Inaction persists</li>
          <li>Failure emerges externally</li>
        </ul>
      </Section>

      {/* ETHICS */}
      <Section title="Misuse Constraint">
        <p>
          This concept must not be used to diffuse responsibility or justify inaction.
        </p>
        <p>
          Invocation requires proof that no legitimate authority path exists—
          not merely that coordination is difficult.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          State Classification
        </h2>
        <p className="mt-4 text-red-200">
          Fragmented Responsibility Disjunction is not a failure of knowledge or capability.
          It is a failure of executable authority. When S = ∅, action is impossible
          without violating legitimacy. The system cannot correct itself.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Authority-bound · Terminal · Versioned
      </div>
    </main>
  );
}
