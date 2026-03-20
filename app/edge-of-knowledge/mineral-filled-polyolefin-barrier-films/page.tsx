// app/edge-of-knowledge/mineral-filled-polyolefin-barrier-films/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Mineral-Filled Polyolefin Barrier Films | Transport Claim Boundary",
  description:
    "A topology-dependent boundary showing that barrier performance is governed by microstructural connectivity, not average permeability.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function MineralFilledPolyolefinBarrierFilmsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Transport Claim Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Mineral-Filled Polyolefin Barrier Films
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Barrier performance is governed by connectivity of diffusion pathways—not average permeability.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Topology-dominated · Average invalid · Connectivity governs transport
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Statement">
        <p>
          Mineral-filled polyolefin films modify gas and vapor transport through
          geometric tortuosity introduced by dispersed fillers.
        </p>

        <p className="text-red-300">
          Transport is governed by the connectivity of low-resistance pathways—not bulk averages.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Transport Mechanism">
        <p>
          High–aspect ratio fillers increase diffusion path length by forcing
          molecules to navigate around impermeable inclusions.
        </p>

        <p>
          Effective barrier performance depends on:
        </p>

        <ul className="list-disc pl-6">
          <li>Filler orientation</li>
          <li>Aspect ratio</li>
          <li>Dispersion uniformity</li>
          <li>Interfacial integrity</li>
        </ul>
      </Section>

      {/* TOPOLOGY */}
      <Section title="Topology Constraint">
        <p>
          The governing variable is not average filler loading, but the topology
          of diffusion pathways within the film.
        </p>

        <p className="text-red-300">
          A single connected low-tortuosity pathway can dominate transport and invalidate barrier performance.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>Poor dispersion creating percolation pathways</li>
          <li>Low aspect ratio fillers reducing tortuosity</li>
          <li>Interfacial debonding forming transport channels</li>
          <li>Processing defects introducing continuous voids</li>
        </ul>

        <p className="text-red-300">
          These failures may not significantly change average permeability but dominate real transport.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid</p>
        <ul className="list-disc pl-6">
          <li>Moderate barrier requirements</li>
          <li>Well-controlled dispersion and processing</li>
          <li>Applications tolerating variability</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails</p>
        <ul className="list-disc pl-6">
          <li>High-barrier applications (e.g., pharmaceuticals)</li>
          <li>Systems sensitive to localized leakage</li>
          <li>Poor process control environments</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Spatial averaging transformations</p>
        <p><strong>Q:</strong> Total polymer continuity and filler fraction</p>
        <p><strong>S:</strong> Distribution of diffusion pathways and connectivity</p>

        <p className="text-red-300">
          Failure: emergence of connected low-resistance pathways within S
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim of barrier performance based solely on average permeability
          or filler loading is invalid in this regime.
        </p>

        <p className="text-red-300">
          Barrier performance must be evaluated against the topology of S—not its mean.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Barrier systems fail not at the average—but at the weakest connected path.
          Any framework that ignores microstructural connectivity exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Topology-bound · Distribution-dependent · Versioned
      </div>
    </main>
  );
}
