import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Radiative Tension Rectification — Photon-to-Mechanical Boundary Test | Moral Clarity AI",
  description:
    "A short-cycle falsification testing whether mid-infrared photon absorption can be rectified into net mechanical and electrical work without macroscopic gradients.",
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

export default function RadiativeTensionRectificationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Short-Cycle Falsification</SignalPill>
            <SignalPill>Energy Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Radiative Tension Rectification
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Ambient thermal radiation is admissible as a usable energy source
            only if photon-driven molecular motion can be rectified into net
            work without relying on macroscopic temperature gradients or bulk
            flow.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Thermal photons carry energy but not direction.  
              Work is admissible only if a system can impose direction without
              violating equilibrium constraints.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Ambient thermal radiation cannot produce net work without gradients"
        >
          <p>
            Conventional thermodynamics assumes that energy extraction from
            ambient radiation requires a temperature gradient, bulk expansion,
            or macroscopic transport.
          </p>
        </SectionCard>

        {/* CLAIM */}
        <SectionCard
          eyebrow="Proposed Mechanism"
          title="Photon-driven interfacial tension cycles"
        >
          <p>
            Surface-bound molecular monolayers absorb mid-infrared photons and
            undergo reversible conformational changes, generating nanoscale
            tension cycles at an interface.
          </p>

          <p>
            When coupled to a piezoelectric substrate, these oscillations are
            proposed to be rectified into net electrical charge accumulation.
          </p>
        </SectionCard>

        {/* CRITICAL TENSION */}
        <SectionCard
          eyebrow="Critical Boundary"
          title="Rectification vs equilibrium"
        >
          <p>
            The system must demonstrate that oscillatory molecular motion can be
            converted into directional work without relying on hidden gradients,
            asymmetries, or external bias.
          </p>

          <p>
            If the system depends on temperature differentials, spectral bias,
            or external modulation, it does not violate the assumption—it
            reintroduces a gradient through another channel.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Net work under equilibrium conditions"
        >
          <p>
            The governing variable is whether measurable net electrical energy
            accumulates under conditions that are otherwise thermodynamically
            symmetric.
          </p>

          <ul>
            <li>True rectification → net charge accumulation without gradient</li>
            <li>False signal → symmetric oscillation with zero net work</li>
          </ul>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Minimal Falsification Test"
          title="Resonant vs non-resonant comparison"
        >
          <ul>
            <li>Resonant IR illumination vs off-resonance control</li>
            <li>Functionalized vs uncoated substrate</li>
            <li>Measure net charge accumulation over time</li>
          </ul>

          <p>
            The signal must exceed controls and persist across cycles.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Modes"
          title="What invalidates the claim"
        >
          <ul>
            <li>No net charge accumulation</li>
            <li>Signal disappears under symmetric conditions</li>
            <li>Effect attributable to hidden gradients or artifacts</li>
          </ul>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Condition"
          title="What would constitute a real effect"
        >
          <p>
            Repeatable net electrical charge accumulation under resonant
            illumination that cannot be explained by thermal gradients,
            instrumentation bias, or external asymmetry.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Energy extraction channel must be explicit"
        >
          <p>
            If the effect holds, it defines a new interfacial energy conversion
            channel.
          </p>

          <p>
            If it fails, it reinforces that ambient thermal radiation cannot be
            rectified into work without introducing an explicit gradient.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Work requires asymmetry.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If a system claims to extract energy from equilibrium, the burden is
            to identify where asymmetry enters. If it cannot be located, the
            effect is either non-existent or misinterpreted.
          </p>
        </section>

      </div>
    </main>
  );
}
