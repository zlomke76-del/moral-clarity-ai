import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Spectral Boundary Layer Regime Inversion — Evaporation Constraint Boundary | Moral Clarity AI",
  description:
    "A short-cycle falsification testing whether spectrally structured radiation can invert boundary layer stability and increase evaporation without increasing bulk temperature.",
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

export default function SpectralBoundaryLayerDestabilizationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Constructive Physics</SignalPill>
            <SignalPill>Short-Cycle Falsification</SignalPill>
            <SignalPill>Boundary Layer Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Spectral Boundary Layer Regime Inversion
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Evaporation is admissible as temperature-limited only if boundary
            layer stability remains invariant under changes in spectral energy
            distribution. If spectral structuring can invert stability and
            increase flux at equal temperature, the governing constraint is
            transport—not heat.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Evaporation is not limited by energy—it is limited by removal.  
              If vapor cannot leave the interface, added heat is wasted.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Evaporation is governed by bulk temperature"
        >
          <p>
            Conventional models assume evaporation rate scales primarily with
            surface temperature and available thermal energy.
          </p>
        </SectionCard>

        {/* HIDDEN FAILURE */}
        <SectionCard
          eyebrow="Hidden Constraint"
          title="Boundary layer suppresses vapor transport"
        >
          <p>
            A stabilizing temperature–humidity gradient traps saturated vapor
            near the interface, limiting evaporation through diffusive transport.
          </p>

          <p>
            Additional heating strengthens this stability, reinforcing the
            constraint rather than removing it.
          </p>
        </SectionCard>

        {/* DISCOVERY */}
        <SectionCard
          eyebrow="Discovery"
          title="Spectral gradients invert boundary layer stability"
        >
          <p>
            Selective absorption in water combined with minimal air heating
            creates an inverted temperature gradient near the interface.
          </p>

          <p>
            This inversion destabilizes the boundary layer and initiates
            micro-convective vapor removal.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Boundary layer stability state"
        >
          <p>
            The governing variable is not temperature, but whether the boundary
            layer is stable or unstable.
          </p>

          <ul>
            <li>Stable → diffusion-limited evaporation</li>
            <li>Unstable → convection-enhanced evaporation</li>
          </ul>
        </SectionCard>

        {/* NEW OBJECT */}
        <SectionCard
          eyebrow="New Scientific Object"
          title="Spectral Boundary Layer Destabilization Index (SBDI)"
        >
          <p>
            SBDI quantifies the transition from diffusive to convective
            evaporation regimes under spectrally structured illumination.
          </p>

          <p>
            It encodes the degree of instability induced at the interface.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Minimal Falsification Test"
          title="Equal energy, different spectra"
        >
          <ul>
            <li>Broadband vs spectrally filtered illumination</li>
            <li>Equal total energy input</li>
            <li>Measure evaporation rate and surface temperature</li>
            <li>Detect boundary layer instability via optical or humidity probes</li>
          </ul>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> No increase in evaporation at equal temperature.
          </p>

          <p>
            <strong>Fail:</strong> Increased evaporation with equal or lower
            surface temperature under spectral structuring.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Evaporation is transport-limited"
        >
          <p>
            The limiting factor is not energy input but the ability to remove
            vapor from the interface.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Energy does not produce flux—transport does.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If vapor cannot leave the interface, no amount of added heat will
            increase evaporation. The constraint is not input—it is removal.
          </p>
        </section>

      </div>
    </main>
  );
}
