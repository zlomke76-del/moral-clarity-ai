import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Capillary Phase-Locking in Solar Desalination — Interfacial Coupling Boundary | Moral Clarity AI",
  description:
    "A constructive physics constraint artifact testing whether evaporation in solar desalination is limited by interfacial phase coherence rather than thermal input alone.",
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

export default function PhaseLockedCapillaryOscillationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Constructive Physics</SignalPill>
            <SignalPill>Interfacial Regime</SignalPill>
            <SignalPill>Phase Coupling</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Capillary Phase-Locking in Solar Desalination
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Solar evaporation is admissible as thermally limited only if
            interfacial capillary modes remain incoherent under steady energy
            input. If phase-locking amplifies evaporation at equal energy, then
            the governing constraint is coupling—not heat.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Evaporation is <strong>not purely thermal</strong>. It is governed
              by the degree of phase coherence at the interface. If energy is
              delivered incoherently, the system underperforms its physical
              potential.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Evaporation scales with steady thermal input"
        >
          <p>
            Solar desalination systems assume evaporation rate is governed by
            steady-state thermal gradients and mean energy input.
          </p>
        </SectionCard>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Hidden Mechanism"
          title="Capillary modes remain incoherent under steady forcing"
        >
          <p>
            Thin water films support capillary wave modes, but under steady
            illumination these remain weak, incoherent, and unexploited.
          </p>

          <p>
            The interface is treated as passive, rather than a dynamically
            excitable system.
          </p>
        </SectionCard>

        {/* DISCOVERY */}
        <SectionCard
          eyebrow="Discovery"
          title="Phase-locking amplifies interfacial energy transfer"
        >
          <p>
            When energy input is modulated at the natural resonance frequency of
            capillary modes, oscillations phase-lock and amplify.
          </p>

          <p>
            This increases curvature, pressure gradients, and effective
            vapor-pressure differential—raising evaporation without increasing
            total energy input.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Degree of phase coherence at the interface"
        >
          <p>
            The governing variable is not temperature, but coherence between
            energy input and capillary resonance.
          </p>

          <ul>
            <li>Incoherent input → suppressed evaporation</li>
            <li>Partial coupling → moderate gain</li>
            <li>Phase-locked → amplified flux</li>
          </ul>
        </SectionCard>

        {/* NEW OBJECT */}
        <SectionCard
          eyebrow="New Scientific Object"
          title="Capillary Resonance Coupling Coefficient (CRCC)"
        >
          <p>
            CRCC quantifies the increase in capillary oscillation amplitude when
            input energy matches the natural resonance frequency.
          </p>

          <p>
            It directly correlates with evaporation enhancement and serves as a
            measurable proxy for interfacial coupling efficiency.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Minimal Falsification Test"
          title="Steady vs phase-modulated illumination"
        >
          <ul>
            <li>Apply steady illumination → measure baseline evaporation</li>
            <li>Apply modulated illumination at resonance frequency</li>
            <li>Maintain identical mean energy input</li>
            <li>Compare evaporation rate and oscillation amplitude</li>
          </ul>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> No increase in evaporation under phase-modulated input.
          </p>

          <p>
            <strong>Fail:</strong> Measurable increase in evaporation and CRCC at equal energy input.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Evaporation is coupling-limited, not heat-limited"
        >
          <p>
            If phase-locking increases evaporation, then thermal models alone
            are incomplete. Interface dynamics become the primary design axis.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A system is not limited by energy—it is limited by how energy couples.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If the interface cannot synchronize with incoming energy, potential
            work remains unextracted regardless of input magnitude.
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
