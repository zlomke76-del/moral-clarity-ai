// app/edge-of-knowledge/high-crystallinity-polyamide-fibers/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "High-Crystallinity Polyamide Fibers: Morphology-Dependent Performance Boundary | Moral Clarity AI",
  description:
    "A state-dependent evaluation showing that environmental exposure irreversibly alters morphology-driven performance, invalidating dry-state claims.",
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

export default function HighCrystallinityPolyamideFibersPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — State-Dependent Claim Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          High-Crystallinity Polyamide Fibers
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Performance is morphology-dependent and environment-coupled. Dry-state claims are insufficient.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="State-Dependent Boundary" />
          <Signal label="Driver" value="Environmental Drift" />
          <Signal label="Failure" value="Claim Invalidation" />
        </div>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Moisture-sensitive · Drift-prone · Environment required for validity
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Statement">
        <p>
          Mechanical and thermal performance in high-crystallinity polyamide fibers
          is governed by morphology and is strongly coupled to environmental state.
        </p>
        <p className="text-red-300">
          Performance measured under dry conditions does not represent operational reality.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Definition">
        <ul className="list-disc pl-6">
          <li>Semi-crystalline polyamides (nylon-6, nylon-6,6)</li>
          <li>Crystallinity ~40–60%</li>
          <li>High chain orientation via drawing</li>
          <li>Service exposure to humidity and temperature variation</li>
        </ul>
      </Section>

      {/* MECHANISM */}
      <Section title="Morphology Mechanism">
        <p>
          Crystalline domains provide strength via dense packing and hydrogen bonding.
        </p>
        <p>
          Amorphous regions enable toughness and deformation accommodation.
        </p>
        <p>
          Performance depends on the balance and interaction of these domains.
        </p>
      </Section>

      {/* DRIFT */}
      <Section title="Environmental Drift Mechanism">
        <ul className="list-disc pl-6">
          <li>Moisture uptake plasticizes amorphous regions</li>
          <li>Modulus decreases and creep increases</li>
          <li>Thermal cycling relaxes orientation</li>
          <li>Hydrolysis reduces molecular weight over time</li>
        </ul>

        <p className="text-red-300">
          These effects shift the morphology-dependent performance state irreversibly over time.
        </p>
      </Section>

      {/* STATE DEPENDENCE */}
      <Section title="State Dependence">
        <p>
          Mechanical properties are functions of environmental state variables:
        </p>

        <ul className="list-disc pl-6">
          <li>Moisture content</li>
          <li>Temperature history</li>
          <li>Exposure duration</li>
        </ul>

        <p className="text-red-300">
          A single material does not have a single performance value—it has a trajectory.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>Loss of stiffness under humidity</li>
          <li>Creep and dimensional drift</li>
          <li>Hydrolytic degradation</li>
          <li>Brittle fracture at high crystallinity extremes</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Morphology-preserving transformations within process window</p>
        <p><strong>Q:</strong> Polymer backbone continuity</p>
        <p><strong>S:</strong> Distribution of morphology + environmental state</p>

        <p className="text-red-300">
          Failure: Shift in S under environmental exposure not captured by dry-state metrics
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim based solely on dry-state or initial measurements is invalid in this regime.
        </p>

        <p className="text-red-300">
          Performance must be specified as a function of environmental state.
        </p>

        <p>
          Absence of environmental conditioning removes claim authority.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Mechanical performance is not a fixed property. It is a state-dependent trajectory.
          Any framework that treats conditioned materials as invariant exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Environment-bound · State-dependent · Versioned
      </div>
    </main>
  );
}
