// app/edge-of-knowledge/hdpe-non-commutative-morphology/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Non-Commutative Morphology Encoding in Semicrystalline Polyolefins | Moral Clarity AI",
  description:
    "A physics-enforced boundary showing that exposure order irreversibly encodes morphology, invalidating endpoint-only durability claims.",
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

export default function HDPENonCommutativeMorphologyPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Claim Invalidation Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Non-Commutative Morphology Encoding
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Exposure order irreversibly encodes structure. Endpoint equivalence is invalid.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Physics Boundary" />
          <Signal label="Constraint" value="Non-Commutativity" />
          <Signal label="Effect" value="Claim Invalidation" />
        </div>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Endpoint metrics insufficient · History encoded · Authority limited
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Statement">
        <p>
          In semicrystalline polyolefins, exposure order between mechanical strain
          and sub-melting thermal annealing produces irreducible differences in
          internal morphology.
        </p>
        <p className="text-red-300">
          These differences persist despite identical bulk endpoint measurements.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Definition">
        <ul className="list-disc pl-6">
          <li>Post-yield deformation (≈5–15%)</li>
          <li>Sub-melting annealing (≈105–130 °C)</li>
          <li>Recrystallization-permitting cooling</li>
        </ul>

        <p>
          Outside this regime, commutativity may hold.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Non-Commutative Mechanism">
        <p>
          Strain → Anneal produces fragmentation followed by oriented recrystallization.
        </p>
        <p>
          Anneal → Strain produces thickened lamellae followed by distinct deformation pathways.
        </p>

        <p className="text-red-300">
          These sequences cannot be mapped onto one another without full melting.
        </p>
      </Section>

      {/* ENDPOINT FAILURE */}
      <Section title="Endpoint Equivalence Failure">
        <p>
          Bulk observables (density, crystallinity, modulus) may converge.
        </p>

        <p className="text-red-300">
          This convergence does not imply structural equivalence.
        </p>

        <p>
          Load-bearing features—orientation fields, tie-molecule topology, and
          domain boundaries—remain distinct and govern failure behavior.
        </p>
      </Section>

      {/* STATE MEMORY */}
      <Section title="Irreversible State Memory">
        <ul className="list-disc pl-6">
          <li>Birefringence patterns</li>
          <li>Anisotropic scattering signatures</li>
        </ul>

        <p>
          Present-state morphology encodes exposure history without external records.
        </p>
      </Section>

      {/* TEST */}
      <Section title="Decisive Test">
        <p>
          Compare:
        </p>
        <ul className="list-disc pl-6">
          <li>E→M (Anneal then strain)</li>
          <li>M→E (Strain then anneal)</li>
        </ul>

        <p className="text-red-300">
          Requirement: persistent, irreducible morphology divergence.
        </p>

        <p>
          Failure to observe divergence falsifies the regime.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Permutations preserving endpoints</p>
        <p><strong>Q:</strong> Bulk thermodynamic state</p>
        <p><strong>S:</strong> Morphology spectrum encoding history</p>

        <p className="text-red-300">
          Failure: S contains multiple non-isomorphic states under identical Q
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim assuming order-invariant durability or dimensional stability
          is invalid in this regime.
        </p>

        <p className="text-red-300">
          Endpoint-only validation does not span the governing state space.
        </p>

        <p>
          Only full melting resets eligibility.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Durability is not a property. It is a trajectory. Where morphology is
          non-commutative, any endpoint-only claim exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Physics-bound · Non-commutative · Versioned
      </div>
    </main>
  );
}
