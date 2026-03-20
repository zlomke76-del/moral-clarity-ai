// app/edge-of-knowledge/non-commutative-morphology-trajectories/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Non-Commutative Morphology Trajectories | Order-Dependence Boundary",
  description:
    "A constraint establishing that load sequence governs morphology evolution, invalidating durability claims that omit trajectory order.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function NonCommutativeMorphologyTrajectoriesPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Order-Dependence Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Non-Commutative Morphology Trajectories
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Durability is governed by load sequence—not total exposure.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Order matters · Sequence required · Commutativity invalid
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Statement">
        <p>
          Polymer durability under cyclic mechanical and environmental loading
          is governed by the explicit trajectory through morphology state space,
          not by total exposure alone.
        </p>

        <p className="text-red-300">
          Load order is a governing variable—not an implementation detail.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Failure of Commutativity Assumption">
        <p>
          Conventional models assume that mechanical and environmental loading
          commute, implying:
        </p>

        <p className="text-center text-white font-mono">
          E → M = M → E
        </p>

        <p>
          In trajectory-sensitive systems, this assumption fails:
        </p>

        <p className="text-center text-red-300 font-mono">
          E → M ≠ M → E
        </p>

        <p>
          Identical exposure totals produce divergent outcomes due to
          intermediate morphology evolution.
        </p>
      </Section>

      {/* STATE VECTOR */}
      <Section title="Minimal Morphology State Vector">
        <p className="font-mono text-white">M = (φ, d_cl, ρ_d, σ_int)</p>

        <ul className="list-disc pl-6">
          <li><strong>φ</strong>: ordered phase fraction</li>
          <li><strong>d_cl</strong>: domain size</li>
          <li><strong>ρ_d</strong>: defect density</li>
          <li><strong>σ_int</strong>: interfacial cohesion</li>
        </ul>

        <p className="text-red-300">
          These variables evolve sequentially and encode system history.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Mechanism of Non-Commutativity">
        <p>
          Morphology evolves on service-relevant timescales and feeds back into
          subsequent response.
        </p>

        <p>
          Each step in the trajectory modifies:
        </p>

        <ul className="list-disc pl-6">
          <li>Stress distribution</li>
          <li>Energy dissipation pathways</li>
          <li>Defect nucleation probability</li>
        </ul>

        <p className="text-red-300">
          Subsequent loading acts on a different system—not the original.
        </p>
      </Section>

      {/* TEST */}
      <Section title="Decisive Experimental Test">
        <ul className="list-disc pl-6">
          <li>Group A: Environmental → Mechanical</li>
          <li>Group B: Mechanical → Environmental</li>
        </ul>

        <p>
          Divergence in morphology or durability under matched exposure falsifies commutativity.
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any durability claim that does not explicitly specify load sequence is invalid.
        </p>

        <p className="text-red-300">
          Total exposure metrics cannot substitute for trajectory order.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Conditions">
        <ul className="list-disc pl-6">
          <li>Durability invariant to load order</li>
          <li>Damage independent of trajectory</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Order-preserving transformations</p>
        <p><strong>Q:</strong> Total exposure</p>
        <p><strong>S:</strong> Morphology trajectory (sequence-dependent)</p>

        <p className="text-red-300">
          Failure: collapse of sequence into total exposure representation
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Two systems with identical exposure are not equivalent if their histories differ.
          Any framework that ignores sequence exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Order-bound · Non-commutative · Sequence-required · Versioned
      </div>
    </main>
  );
}
