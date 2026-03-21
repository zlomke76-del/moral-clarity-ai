import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "TPU Segmental Network Decoupling — Property Separability Collapse Test | Moral Clarity AI",
  description:
    "A short-cycle falsification testing whether mechanically indistinguishable TPU systems can diverge in transport behavior due to reset-resistant segmental network reconfiguration.",
  robots: {
    index: true,
    follow: true,
  },
};

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

function SignalPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function TPUSegmentalNetworkDecouplingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Short-Cycle Falsification</SignalPill>
            <SignalPill>Hidden-State Divergence</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            TPU Segmental Network Decoupling
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            A material is admissible as property-separable only if identical
            mechanical performance guarantees equivalence of transport behavior.
            If transport diverges while mechanics remain matched, separability is
            invalid.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              If two materials behave the same mechanically but differently
              functionally, then the governing state is hidden.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Mechanical equivalence guarantees functional equivalence"
        >
          <p>
            Industry assumes that passing tensile, modulus, and elongation
            thresholds certifies equivalence across transport and barrier
            performance.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Structural Failure"
          title="Segmental networks decouple observables"
        >
          <p>
            Hydrogen-bonded soft–hard segment topology can reconfigure under
            sub-yield conditioning without altering bulk mechanical signatures.
          </p>

          <p>
            This creates hidden-state divergence: identical macroscopic response,
            different molecular transport pathways.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Segmental network topology"
        >
          <p>
            The governing variable is the internal segmental hydrogen-bond
            network and its history-dependent configuration.
          </p>

          <ul>
            <li>Mechanics → bulk averaged response</li>
            <li>Transport → pathway-sensitive to microstructure</li>
          </ul>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Minimal Falsification"
          title="Mechanical equivalence, transport divergence"
        >
          <ul>
            <li>Induce history-dependent states (humidity, strain, cycling)</li>
            <li>Filter by strict mechanical indistinguishability</li>
            <li>Measure WVTR / OTR</li>
            <li>Validate with DMA (tan δ shift / broadening)</li>
          </ul>

          <p>
            Only specimens passing mechanical equivalence are admissible for
            transport comparison.
          </p>
        </SectionCard>

        {/* FAILURE CONDITION */}
        <SectionCard
          eyebrow="Failure Signature"
          title="Separability collapse"
        >
          <ul>
            <li>≥30% transport divergence (WVTR / OTR)</li>
            <li>≥5 °C Tg shift or ≥20% tan δ broadening</li>
            <li>No mechanical differentiation</li>
            <li>Persistence after reset anneal</li>
          </ul>

          <p>
            This constitutes a categorical break: properties no longer track
            together.
          </p>
        </SectionCard>

        {/* CRITICAL INSIGHT */}
        <SectionCard
          eyebrow="Critical Insight"
          title="Reset resistance proves structural change"
        >
          <p>
            If divergence survives thermal anneal, the system is not temporarily
            perturbed—it has transitioned into a new metastable configuration.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Properties are not intrinsically coupled"
        >
          <p>
            Mechanical and transport properties are not guaranteed to co-vary.
            They are projections of different aspects of internal structure.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Matching outputs do not imply matching states.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If different internal structures produce identical mechanical
            behavior, then mechanical testing cannot certify functional
            equivalence.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          <Link href="/edge-of-practice">
            ← Back to Edge of Practice Index
          </Link>
        </p>

      </div>
    </main>
  );
}
