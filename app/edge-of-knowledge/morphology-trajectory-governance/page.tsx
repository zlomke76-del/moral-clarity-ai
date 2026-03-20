// app/edge-of-knowledge/morphology-trajectory-governance/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Morphology Trajectory Governance | Trajectory Sovereignty Doctrine",
  description:
    "A foundational doctrine establishing morphology trajectory as the only admissible representation of durability in trajectory-sensitive regimes.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function MorphologyTrajectoryGovernancePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Trajectory Sovereignty Doctrine
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Morphology Trajectory Governance
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Durability is not a property. It is a trajectory through morphology state space.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Trajectory required · Endpoint invalid · Properties non-admissible
        </div>
      </section>

      {/* CORE LAW */}
      <Section title="Core Doctrine">
        <p>
          In trajectory-sensitive polymer regimes, durability is governed by the
          explicit path taken through morphology state space.
        </p>

        <p className="text-red-300">
          Static properties, endpoint measurements, and averaged metrics are not admissible representations.
        </p>
      </Section>

      {/* SOVEREIGNTY */}
      <Section title="Trajectory Sovereignty">
        <p>
          Morphology trajectory is the only representation that preserves causal
          linkage between structure and outcome.
        </p>

        <p className="text-red-300">
          Any framework that substitutes endpoints, averages, or inferred states
          for trajectory loses epistemic authority.
        </p>
      </Section>

      {/* MOMT */}
      <Section title="Minimal Observable Morphology Trajectory (MOMT)">
        <p>
          All claims must define and track a continuous trajectory consisting of
          at least three orthogonal morphology observables.
        </p>

        <p className="text-red-300">
          Missing trajectory segments invalidate the claim.
        </p>
      </Section>

      {/* CONTINUITY */}
      <Section title="Continuity Requirement">
        <p>
          Durability claims must reference a continuous trajectory through S.
        </p>

        <p className="text-red-300">
          Endpoint-only or interpolated representations constitute structural breaks.
        </p>
      </Section>

      {/* NON-COMMUTATIVITY */}
      <Section title="Non-Commutativity Constraint">
        <p>
          Order of applied loads must be explicitly tested or declared invariant.
        </p>

        <p className="text-red-300">
          Silence on load sequence invalidates the claim.
        </p>
      </Section>

      {/* IRREVERSIBILITY */}
      <Section title="Irreversible Loss of Eligibility">
        <ul className="list-disc pl-6">
          <li>Crossing non-recoverable morphology thresholds</li>
          <li>Path-dependent drift without reset pathway</li>
          <li>Loss of mapping between morphology and performance</li>
        </ul>

        <p className="text-red-300">
          Once violated, all prior certifications are void.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsifiability Requirement">
        <p>
          Each claim must define a morphology-based kill condition.
        </p>

        <p className="text-red-300">
          Claims without falsifiability are invalid.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Morphology-preserving transformations</p>
        <p><strong>Q:</strong> Material identity</p>
        <p><strong>S:</strong> Morphology trajectory through state space</p>

        <p className="text-red-300">
          Failure: collapse of trajectory into endpoints or averages
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any durability claim not expressed as a function of trajectory over S is invalid.
        </p>

        <p className="text-red-300">
          Properties do not exist independently of trajectory in this regime.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Durability cannot be claimed from where a system is—it can only be
          claimed from how it arrived there. Any framework that ignores
          trajectory exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Trajectory-sovereign · Non-admissible endpoints · Versioned
      </div>
    </main>
  );
}
