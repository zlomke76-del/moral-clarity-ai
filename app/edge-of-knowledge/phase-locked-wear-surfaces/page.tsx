// app/edge-of-knowledge/phase-locked-wear-surfaces/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Phase-Locked Wear Surfaces | Sequence Integrity Boundary",
  description:
    "A regime-bounded system where maintenance sequence is irreversibly encoded in material wear, making neglect and deviation physically reconstructable.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function PhaseLockedWearSurfacesPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Sequence Integrity Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Phase-Locked Wear Surfaces
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Maintenance history must be physically reconstructable—not inferred from records.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Sequence encoded · Irreversible · Non-deniable · Reconstruction required
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          Phase-Locked Wear Surfaces define a constraint where maintenance
          sequence and adherence are irreversibly encoded into material state.
        </p>

        <p className="text-red-300">
          If sequence cannot be reconstructed from the surface, the system fails.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Problem Framing">
        <p>
          Conventional systems rely on external records, which can be forged,
          lost, deferred, or ignored.
        </p>

        <p className="text-red-300">
          This creates a gap between actual maintenance history and represented history.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Physical Mechanism">
        <p>
          Controlled, non-reversible wear encodes sequence fidelity:
        </p>

        <ul className="list-disc pl-6">
          <li>Correct maintenance → phase-aligned, predictable wear</li>
          <li>Deviation or omission → asymmetric or accelerated divergence</li>
        </ul>

        <p className="text-red-300">
          Wear becomes a physical record of sequence—not just usage.
        </p>
      </Section>

      {/* SEQUENCE */}
      <Section title="Sequence Integrity Requirement">
        <p>
          Valid systems must satisfy:
        </p>

        <ul className="list-disc pl-6">
          <li>Irreversible encoding of maintenance steps</li>
          <li>Distinct differentiation between correct and incorrect sequences</li>
          <li>Legibility across the full service life</li>
        </ul>

        <p className="text-red-300">
          Ambiguous or non-reconstructable sequences invalidate the system.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Structural Failure Modes">
        <ul className="list-disc pl-6">
          <li>Environmental confounds obscure patterns</li>
          <li>Wear signatures degrade before end-of-life</li>
          <li>Patterns can be repaired, reset, or spoofed</li>
          <li>Independent observers cannot reliably classify states</li>
        </ul>

        <p className="text-red-300">
          If sequence cannot be trusted, accountability collapses.
        </p>
      </Section>

      {/* DISTINCTION */}
      <Section title="Boundary Distinction">
        <p>This system is not:</p>

        <ul className="list-disc pl-6">
          <li>Sensing or monitoring infrastructure</li>
          <li>Predictive maintenance</li>
          <li>Performance enhancement</li>
          <li>Safety assurance</li>
        </ul>

        <p className="text-red-300">
          It encodes history—it does not interpret or act on it.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Criteria">
        <ul className="list-disc pl-6">
          <li>Wear patterns ambiguous between correct and incorrect maintenance</li>
          <li>Sequence cannot be reconstructed from surface state</li>
          <li>Patterns reproducible without correct maintenance</li>
          <li>Evidence can be erased or manipulated</li>
        </ul>

        <p className="text-red-300">
          Non-unique or reversible encoding invalidates the system.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Sequence-preserving transformations</p>
        <p><strong>Q:</strong> Maintenance actions</p>
        <p><strong>S:</strong> Wear state encoding sequence history</p>

        <p className="text-red-300">
          Failure: inability to reconstruct Q from S
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any system claiming maintenance accountability must demonstrate that
          sequence is physically encoded and reconstructable.
        </p>

        <p className="text-red-300">
          External records cannot substitute for encoded history.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Maintenance is not what was recorded—it is what was done. If sequence
          cannot be recovered from material state, accountability remains
          representational and therefore unreliable.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Sequence-bound · Irreversible · Reconstruction-required · Versioned
      </div>
    </main>
  );
}
