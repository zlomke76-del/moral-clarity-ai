import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Hydration-Mediated Aerosol Capture — Interface Regime Shift in PP Systems | Moral Clarity AI",
  description:
    "A short-cycle falsification testing whether aerosol capture in polypropylene systems transitions from electrostatic to hydration-mediated mechanisms under humidity.",
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

function SignalPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function PPPVPHydrationCapturePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Short-Cycle Falsification</SignalPill>
            <SignalPill>Interface Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Hydration-Mediated Aerosol Capture in Polypropylene Systems
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Aerosol capture in polypropylene is admissible as electrostatic only
            if humidity does not induce a dominant alternative mechanism. If
            hydration-mediated interactions exceed electrostatic capture under
            realistic conditions, the governing regime shifts from charge to
            interface physics.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Filtration is not governed by charge alone.  
              If humidity can create a stable interfacial hydration layer, then
              capture becomes a surface-mediated interaction—not an electrostatic one.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Electrostatic capture dominates filtration behavior"
        >
          <p>
            Polypropylene filtration systems assume electrostatic interactions
            remain the dominant capture mechanism across operating environments.
          </p>
        </SectionCard>

        {/* BREAK */}
        <SectionCard
          eyebrow="Hidden Failure Mode"
          title="Humidity collapses electrostatic dominance"
        >
          <p>
            In humid environments, electrostatic charge decays, reducing capture
            efficiency and exposing alternative interaction pathways.
          </p>
        </SectionCard>

        {/* DISCOVERY */}
        <SectionCard
          eyebrow="Discovery"
          title="Hydration layers create a new capture regime"
        >
          <p>
            Trace polar components (e.g., PVP) localize at the fiber interface
            and stabilize hydration shells under humidity.
          </p>

          <p>
            These shells increase local polarity and enable dipolar and
            hydrogen-bond-mediated capture mechanisms independent of charge.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Interfacial hydration stability"
        >
          <p>
            The governing variable is not charge retention, but the persistence
            of a hydration-mediated interface.
          </p>

          <ul>
            <li>Dry → electrostatic regime</li>
            <li>Moderate humidity → mixed regime</li>
            <li>High humidity → hydration-dominant regime</li>
          </ul>
        </SectionCard>

        {/* CRITICAL GATE */}
        <SectionCard
          eyebrow="Critical Gate"
          title="Non-leaching constraint"
        >
          <p>
            The hydration mechanism is admissible only if the polar component
            remains interface-bound.
          </p>

          <p>
            Any measurable leaching invalidates the system, reducing it to a
            transient effect.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Minimal Falsification Test"
          title="Humidity-dependent performance divergence"
        >
          <ul>
            <li>Compare PP vs PP+PVP under identical airflow</li>
            <li>Test at 30%, 60%, 80% RH</li>
            <li>Measure capture efficiency at fixed pressure drop</li>
          </ul>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> No improvement under humidity conditions.
          </p>

          <p>
            <strong>Fail:</strong> ≥15% efficiency increase at 60% RH without
            electrostatic contribution.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Filtration is regime-dependent"
        >
          <p>
            Filtration performance cannot be treated as a single-mechanism
            system. It transitions between electrostatic and hydration-mediated
            regimes depending on environmental conditions.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A system is not defined by how it works in ideal conditions.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If the governing mechanism changes with environment, then the system
            was never single-mode—it was conditionally interpreted.
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
