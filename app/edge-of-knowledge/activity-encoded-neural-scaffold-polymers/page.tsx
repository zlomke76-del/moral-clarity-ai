// app/edge-of-knowledge/activity-encoded-neural-scaffold-polymers/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity-Encoded Neural Scaffold Polymers | Moral Clarity AI",
  description:
    "A regime-bounded material framework where neural activity irreversibly encodes scaffold architecture, invalidating endpoint equivalence.",
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

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Material Constraint
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Activity-Encoded Neural Scaffold Polymers
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Neural activity irreversibly encodes scaffold architecture, not chemistry.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Class" value="Stimulus-Responsive Polymer Scaffold" />
          <Signal label="Property" value="Irreversible Architectural Encoding" />
          <Signal label="Implication" value="Endpoint Equivalence Invalid" />
        </div>
      </section>

      {/* CORE CLAIM */}
      <Section title="Core Constraint">
        <p>
          Scaffold architecture can encode neural activity history through irreversible
          nanoscale conformational change.
        </p>
        <p>
          Once encoded, this structure governs future plasticity and cannot be reduced
          to biochemical composition or bulk material properties.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Unaddressed Failure in Neural Engineering">
        <p>
          Current scaffolds are treated as passive substrates. They do not encode history.
        </p>
        <p>
          This leads to a structural error: endpoint equivalence is assumed despite
          divergent developmental trajectories.
        </p>
      </Section>

      {/* ARCHITECTURE */}
      <Section title="Polymer Architecture">
        <p>
          The system consists of a crosslinked hydrogel scaffold with bistable
          mechanophoric crosslinkers.
        </p>
        <p>
          These crosslinkers shift between discrete conformational states under
          suprathreshold neural activity.
        </p>
      </Section>

      {/* PHYSICS */}
      <Section title="Governing Physics">
        <p>
          Activity induces irreversible architectural changes that constrain synaptic
          geometry and connectivity.
        </p>
        <p>
          The system is non-commutative: identical endpoints can arise from
          non-equivalent histories.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Why Endpoint Equivalence Fails">
        <p>
          Bulk measurements cannot reconstruct activity history.
        </p>
        <p>
          Two scaffolds may appear identical while enforcing different neural constraints.
        </p>
      </Section>

      {/* STATE */}
      <Section title="Irreversible State Vector">
        <ul className="list-disc pl-6 space-y-2">
          <li>Crosslinker conformation</li>
          <li>Mesh geometry</li>
          <li>Constraint topology</li>
        </ul>
        <p>This state cannot be reset without destruction.</p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6 space-y-2">
          <li>No activity-correlated architectural change</li>
          <li>Distinct histories produce identical structure</li>
          <li>Transitions occur outside physiological thresholds</li>
        </ul>
      </Section>

      {/* REGIME */}
      <Section title="Regime Boundaries">
        <p className="font-semibold text-white">Applies to</p>
        <ul className="list-disc pl-6">
          <li>Neural organoids</li>
          <li>In vitro systems</li>
          <li>Regenerative platforms</li>
        </ul>

        <p className="font-semibold text-white mt-4">Does not apply</p>
        <ul className="list-disc pl-6">
          <li>Human nervous systems</li>
          <li>Non-plastic tissue</li>
          <li>Non-neural systems</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Structure">
        <p>Symmetry group: endpoint reparameterization</p>
        <p>Conserved: network connectivity</p>
        <p>Invariant: spatial conformational distribution</p>
        <p>
          Failure condition: identical endpoints with non-identical internal states
        </p>
      </Section>

      {/* JUDGMENT */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Edge of Knowledge Judgment
        </h2>
        <p className="mt-4 text-red-200 leading-7">
          Endpoint equivalence is invalid in systems where material architecture
          encodes activity history.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Edge of Knowledge · Regime-bounded · Non-actionable
      </div>
    </main>
  );
}
