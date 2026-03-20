import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Thermoplastic Polyurethane Elastomer Networks | Microphase Persistence Boundary",
  description:
    "A constraint establishing that TPU performance is valid only if microphase morphology remains stable under time and environmental exposure.",
  openGraph: {
    title:
      "Thermoplastic Polyurethane Elastomer Networks: Microphase Stability Boundary",
    description:
      "Elastic performance depends on persistence of microphase separation—not initial material state.",
    url: "https://moralclarity.ai/edge-of-knowledge/tpu-elastomer-networks",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function TPUElastomerNetworksPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Microphase Persistence Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Thermoplastic Polyurethane Elastomer Networks
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Elastic performance is valid only if microphase morphology persists over time and environment.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Morphology-bound · Time-dependent · Environment-sensitive · Drift-limited
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          This system defines a constraint: TPU performance depends on the persistence
          of microphase-separated morphology under real environmental and temporal conditions.
        </p>

        <p className="text-red-300">
          If morphology drifts, the system is invalid regardless of initial properties.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Problem Framing">
        <p>
          Elastomeric systems must balance elasticity, toughness, and durability.
          Many materials exhibit acceptable initial performance but degrade under
          environmental exposure or sustained load.
        </p>

        <p className="text-red-300">
          Initial elasticity does not constitute durable performance.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Candidate Polymer Regime">
        <ul className="list-disc pl-6">
          <li>Segmented TPU block copolymers</li>
          <li>Microphase-separated hard and soft domains</li>
          <li>Industrial melt-processable systems</li>
        </ul>

        <p>
          Behavior is governed by morphology—not composition alone.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Physical Mechanism">
        <p>
          Hard domains form physical crosslinks that anchor the network, while
          soft segments provide extensibility and energy dissipation.
        </p>

        <p>
          Elastic recovery depends on maintaining this phase-separated structure.
        </p>

        <p className="text-red-300">
          Loss of phase structure eliminates elastomeric behavior.
        </p>
      </Section>

      {/* CONSTRAINT */}
      <Section title="Microphase Persistence Constraint">
        <p>
          The governing variable is the stability of phase morphology under:
        </p>

        <ul className="list-disc pl-6">
          <li>Humidity and hydrolysis</li>
          <li>UV and oxidative exposure</li>
          <li>Thermal cycling</li>
          <li>Sustained mechanical load</li>
        </ul>

        <p className="text-red-300">
          Environmental drift invalidates performance claims.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>Hydrolytic degradation of soft segments</li>
          <li>UV-induced embrittlement</li>
          <li>Creep and stress relaxation under load</li>
          <li>Loss of phase separation through aging</li>
        </ul>

        <p className="text-red-300">
          Any morphology drift reduces or eliminates elastic recovery.
        </p>
      </Section>

      {/* REGIME MAP */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid:</p>
        <ul className="list-disc pl-6">
          <li>Indoor, controlled environments</li>
          <li>Moderate mechanical loading</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails:</p>
        <ul className="list-disc pl-6">
          <li>Outdoor UV exposure</li>
          <li>Wet or humid environments (polyester TPU)</li>
          <li>Long-term load-bearing applications</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Morphology-preserving transformations</p>
        <p><strong>Q:</strong> Elastic performance</p>
        <p><strong>S:</strong> Microphase structure</p>

        <p className="text-red-300">
          Failure: Q degrades as S drifts
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim of TPU durability must demonstrate stability of microphase
          morphology over time and environmental exposure.
        </p>

        <p className="text-red-300">
          Initial performance data is not admissible evidence of long-term behavior.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          TPU systems are valid only within controlled environments where
          microphase structure remains stable. Elasticity is not an inherent
          property—it is a maintained condition. When morphology drifts,
          performance disappears.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Morphology-bound · Time-dependent · Environment-limited · Versioned
      </div>
    </main>
  );
}
