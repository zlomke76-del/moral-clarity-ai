import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Thermomechanical Phase-Aligned Insulation — Phase-Resolved Thermal Invariance Test | Moral Clarity AI",
  description:
    "A short-cycle invariant falsification testing whether static R-value fails under time-translated thermal forcing due to phase-resolved heat transport.",
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

export default function ThermomechanicalPhaseAlignedInsulationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Invariant Falsification</SignalPill>
            <SignalPill>Thermal Symmetry</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Thermomechanical Phase-Aligned Insulation
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Thermal insulation is admissible as phase-agnostic only if time
            translation of boundary conditions does not alter invariant heat
            transport structure. If phase shifts, peak flux discontinuities, or
            spatial coherence emerge, static R-value is not a complete descriptor.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Insulation is not defined by how much heat passes—but when and how it passes.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Static R-value is sufficient"
        >
          <p>
            The governing assumption is that a single scalar (R-value) fully
            characterizes thermal performance, independent of time variation in
            boundary conditions.
          </p>
        </SectionCard>

        {/* SYMMETRY BREAK */}
        <SectionCard
          eyebrow="Symmetry Under Test"
          title="Time-translation invariance"
        >
          <p>
            If thermal response is invariant under time translation of cyclic
            forcing, then phase does not matter and static descriptors suffice.
          </p>

          <p>
            If phase-dependent effects emerge, the symmetry is broken and the
            descriptor is incomplete.
          </p>
        </SectionCard>

        {/* DISCOVERY */}
        <SectionCard
          eyebrow="Discovery"
          title="Phase-aligned structures introduce temporal asymmetry"
        >
          <p>
            Thermomechanically responsive layers with depth-wise hysteresis
            gradients introduce delayed structural reconfiguration aligned with
            cyclic forcing.
          </p>

          <p>
            This creates phase-shifted heat transport behavior that cannot be
            captured by static metrics.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Phase-resolved heat transport structure"
        >
          <ul>
            <li>Phase lag between external forcing and internal response</li>
            <li>Peak instantaneous heat flux</li>
            <li>Spatial coherence of flux pathways</li>
          </ul>

          <p>
            These variables define the system’s true thermal behavior under
            cyclic conditions.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Minimal Falsification Test"
          title="Static vs phase-aligned comparison"
        >
          <ul>
            <li>Panel A: conventional insulation</li>
            <li>Panel B: phase-aligned laminate</li>
            <li>Identical cyclic thermal forcing (≥100 cycles)</li>
          </ul>

          <ul>
            <li>Heat flux sensors</li>
            <li>Depth thermocouples</li>
            <li>Infrared thermography</li>
          </ul>

          <p>
            No averaging permitted. Only invariant spectral observables are admissible.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the assumption"
        >
          <ul>
            <li>Non-zero, repeatable phase lag</li>
            <li>Discontinuous peak heat flux change</li>
            <li>Emergent flux pathway coherence</li>
          </ul>

          <p>
            Any of these constitutes a categorical break in phase invariance.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Thermal systems are phase-sensitive"
        >
          <p>
            Heat transport under real conditions is not purely scalar. It is a
            time-resolved, structure-dependent process.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A scalar cannot describe a phase-dependent system.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If thermal response depends on timing, then static R-value is not a
            governing descriptor—it is an incomplete projection.
          </p>
        </section>

      </div>
    </main>
  );
}
