import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "POM Path-Memory Bimodal Basin Test — State Non-Uniqueness Boundary | Moral Clarity AI",
  description:
    "A short-cycle invariant falsification testing whether mechanically indistinguishable POM samples can occupy irreversible, path-dependent molecular basins that persist beyond reset conditions.",
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

export default function POMPathMemoryBimodalBasinPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Short-Cycle Falsification</SignalPill>
            <SignalPill>State-Space Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            POM Path-Memory Bimodal Basin Test
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            A material is admissible as equivalent only if identical mechanical
            observables imply a unique internal state. If multiple hidden basins
            exist under identical acceptance criteria, then equivalence is
            structurally invalid.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Observables do not define state.  
              If two systems behave the same but evolve differently, they were
              never the same system.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Mechanical equivalence implies molecular equivalence"
        >
          <p>
            Standard qualification assumes that parts meeting tensile and visual
            criteria are interchangeable, regardless of thermal microhistory.
          </p>
        </SectionCard>

        {/* BREAK */}
        <SectionCard
          eyebrow="Hidden Failure Mode"
          title="Path-dependent basin divergence"
        >
          <p>
            Thermal microcycling may drive the polymer into distinct internal
            basins that are not visible in standard mechanical tests but alter
            functional behavior.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Thermally microcycled POM under mechanical equivalence constraints"
        >
          <p>
            Identical POM samples are subjected to controlled microcycle
            histories while constrained to pass tensile equivalence gates.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Existence of multiple admissible internal states"
        >
          <p>
            The governing variable is whether multiple molecular basins exist
            under identical observable constraints.
          </p>

          <ul>
            <li>Single basin → equivalence holds</li>
            <li>Multiple basins → equivalence collapses</li>
          </ul>
        </SectionCard>

        {/* READOUT */}
        <SectionCard
          eyebrow="Primary Readout"
          title="Divergence under hidden-state probes"
        >
          <ul>
            <li>DSC bifurcation (Tc / enthalpy shifts)</li>
            <li>Low-stress creep divergence</li>
            <li>Residual strain differences</li>
            <li>Persistence after reset anneal</li>
          </ul>
        </SectionCard>

        {/* RESET */}
        <SectionCard
          eyebrow="Critical Test"
          title="Reset irreversibility"
        >
          <p>
            If divergence persists after standardized annealing, the system
            cannot be restored to a unique baseline state.
          </p>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> All samples converge to a single basin and
            reset eliminates divergence.
          </p>

          <p>
            <strong>Fail:</strong> Mechanically identical samples occupy
            distinct, reset-resistant molecular states.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Equivalence is path-dependent"
        >
          <p>
            Material identity is not defined solely by present observables but by
            the trajectory that produced them.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A system is not defined by what it is—it is defined by how it got there.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If two states cannot be distinguished by observation but diverge in
            evolution, then state identity is fundamentally path-dependent.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          <Link href="/edge-of-practice">
            Edge of Practice index
          </Link>
        </p>
      </div>
    </main>
  );
}
