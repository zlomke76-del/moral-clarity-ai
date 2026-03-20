// app/edge-of-knowledge/damage-activated-nitrogen-fixation/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Damage-Activated Nitrogen Fixation | Moral Clarity AI",
  description:
    "A kinetic-boundary evaluation of whether mechanical damage can produce trace nitrogen fixation under strict physical and ethical constraints.",
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
          Edge of Knowledge — Kinetic Boundary Evaluation
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Damage-Activated Nitrogen Fixation
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Can mechanical damage alone produce trace nitrogen fixation?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Extreme-Edge Evaluation" />
          <Signal label="Constraint" value="Mechanical Energy Only" />
          <Signal label="Status" value="Kinetically Marginal" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          No scalability · No energy gain · No replacement claims
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Question">
        <p>
          Can unavoidable mechanical damage generate sufficient localized
          energy to produce measurable nitrogen fixation without external
          inputs?
        </p>
        <p>
          The hypothesis is strictly limited to trace, distributed, and
          non-competitive chemical output.
        </p>
      </Section>

      {/* PHYSICS */}
      <Section title="Kinetic Constraint">
        <p>
          Nitrogen fixation is limited by the strength of the N≡N bond.
        </p>
        <p>
          Mechanical damage may create transient, high-energy defect states:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fresh fracture surfaces</li>
          <li>Crack-tip electronic distortion</li>
          <li>Strained lattice regions</li>
        </ul>

        <p>
          These states are:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Extremely localized</li>
          <li>Transient</li>
          <li>Energy-limited</li>
          <li>Rapidly passivated</li>
        </ul>
      </Section>

      {/* HARD CONSTRAINTS */}
      <Section title="Hard Constraints">
        <ul className="list-disc pl-6 space-y-2">
          <li>No electricity, plasma, or deliberate heating</li>
          <li>No biological mediation</li>
          <li>Only Earth-abundant elements</li>
          <li>Mechanical damage is the sole energy source</li>
        </ul>
      </Section>

      {/* REGIME */}
      <Section title="Admissibility Window">
        <p className="font-semibold text-white">Admissible</p>
        <ul className="list-disc pl-6">
          <li>Continuous mechanical cycling</li>
          <li>Distributed environments</li>
          <li>Long time horizons</li>
        </ul>

        <p className="font-semibold text-white mt-4">Marginal</p>
        <ul className="list-disc pl-6">
          <li>Rapid passivation environments</li>
          <li>Low mechanical stress</li>
        </ul>

        <p className="font-semibold text-white mt-4">Rejected</p>
        <ul className="list-disc pl-6">
          <li>Industrial nitrogen production</li>
          <li>Scalable fertilizer systems</li>
          <li>Any efficiency-based claim</li>
        </ul>
      </Section>

      {/* CONFUNDS */}
      <Section title="Confound Exclusion">
        <ul className="list-disc pl-6 space-y-2">
          <li>Hidden electrochemical pathways</li>
          <li>Thermal activation</li>
          <li>Biological contamination</li>
          <li>Simple adsorption without reduction</li>
        </ul>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Gate">
        <p>This hypothesis collapses if:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>No measurable nitrogen fixation above background</li>
          <li>Energy accounting matches known pathways</li>
          <li>Passivation dominates defect formation</li>
          <li>Results are irreproducible</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Structure">
        <p>Conserved: mechanical work input</p>
        <p>Invariant: verified nitrogen species per damage event</p>
        <p>
          Failure: absence of new chemically verified nitrogen products
        </p>
      </Section>

      {/* ETHICS */}
      <Section title="Ethical Boundary">
        <p>
          Overclaiming converts a marginal effect into systemic risk.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>False “green fertilizer” claims</li>
          <li>Policy misdirection</li>
          <li>Neglect of proven systems</li>
        </ul>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Final Judgment
        </h2>
        <p className="mt-4 text-red-200">
          CONDITIONAL RESEARCH GO — Extremely Narrow Window.
          This concept exists only at the kinetic edge of plausibility and
          collapses under any claim of scale, efficiency, or substitution.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Edge-bound · Kinetically constrained · Non-scalable · Versioned
      </div>
    </main>
  );
}
