// app/edge-of-knowledge/polymer-discovery-validation/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Polymer Discovery — Validation-First Mapping | Discovery Boundary",
  description:
    "A constraint-driven framework establishing that valid polymer discovery must emerge from physically grounded, validation-first regimes—not speculative invention.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function PolymerDiscoveryValidationPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Validation-First Discovery Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Polymer Discovery (Validation-First, Non-Inventive)
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Discovery is valid only when grounded in existing physical regimes—not speculative invention.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Validation required · Speculation invalid · Non-inventive · Regime-bound
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          This framework defines a constraint: polymer discovery must emerge from
          physically plausible, already-supported regimes.
        </p>

        <p className="text-red-300">
          Novelty without validation is non-admissible.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Problem Framing">
        <p>
          Many applications require combinations of properties that existing
          single-material systems cannot provide without trade-offs.
        </p>

        <p>
          Conventional approaches often introduce:
        </p>

        <ul className="list-disc pl-6">
          <li>Exotic chemistries</li>
          <li>Complex synthesis pathways</li>
          <li>Fragile supply chains</li>
        </ul>

        <p className="text-red-300">
          These increase cost, risk, and epistemic uncertainty.
        </p>
      </Section>

      {/* DISCOVERY RULE */}
      <Section title="Validation-First Discovery Principle">
        <p>
          Discovery is performed through mapping—not invention.
        </p>

        <ul className="list-disc pl-6">
          <li>Identify physically supported material regimes</li>
          <li>Explore architecture-level combinations</li>
          <li>Validate behavior through known mechanisms</li>
        </ul>

        <p className="text-red-300">
          Claims must be reducible to established physics—not hypothetical synergy.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Candidate Polymer Regime">
        <p>
          Multiphase architectures combining:
        </p>

        <ul className="list-disc pl-6">
          <li>Semicrystalline polyolefin matrices</li>
          <li>Commodity elastomeric phases</li>
          <li>Optional fiber reinforcement or ionomeric interfaces</li>
        </ul>

        <p className="text-red-300">
          Defined at the architectural level only—no formulation claims.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Physical Plausibility Constraint">
        <p>
          All observed behavior must derive from:
        </p>

        <ul className="list-disc pl-6">
          <li>Established polymer physics</li>
          <li>Known processing pathways</li>
          <li>Documented interfacial and morphological mechanisms</li>
        </ul>

        <p className="text-red-300">
          Unsupported or emergent mechanisms invalidate the claim.
        </p>
      </Section>

      {/* COST */}
      <Section title="Economic Boundary">
        <p>
          Valid systems must remain compatible with:
        </p>

        <ul className="list-disc pl-6">
          <li>Commodity-scale production</li>
          <li>Standard processing infrastructure</li>
          <li>Reasonable morphological tolerances</li>
        </ul>

        <p className="text-red-300">
          Excessive complexity invalidates practical discovery.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>Phase incompatibility or delamination</li>
          <li>Unstable morphology under load</li>
          <li>Environmental degradation outside base polymer limits</li>
          <li>Economic infeasibility due to process complexity</li>
        </ul>
      </Section>

      {/* ETHICS */}
      <Section title="Misuse Constraint">
        <ul className="list-disc pl-6">
          <li>Overclaiming multifunctionality</li>
          <li>Using unvalidated systems in regulated contexts</li>
          <li>Substituting proven materials without justification</li>
        </ul>

        <p className="text-red-300">
          Validation cannot be replaced by narrative.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Physics-preserving transformations</p>
        <p><strong>Q:</strong> Material system constraints</p>
        <p><strong>S:</strong> Validated architecture space</p>

        <p className="text-red-300">
          Failure: claims extend beyond validated S
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any discovery claim must be grounded in physically validated regimes.
        </p>

        <p className="text-red-300">
          Speculative invention without validation is not admissible.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Discovery is not the creation of the unknown—it is the disciplined
          mapping of what already exists within physical law. Any framework that
          prioritizes novelty over validation exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Validation-first · Non-inventive · Regime-bound · Versioned
      </div>
    </main>
  );
}
