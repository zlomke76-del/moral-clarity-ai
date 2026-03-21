import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Interfacial Toughening in HDPE via Dispersed LDPE Domains — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether dispersed LDPE domains increase HDPE toughness through morphology alone, without additives, compatibilizers, or chemical modification.",
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
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "fail" | "pass";
}) {
  const toneClass =
    tone === "fail"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

export default function HDPELDPEInterfacialTougheningPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Morphology Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Interfacial Toughening in HDPE via Dispersed LDPE Domains
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            HDPE/LDPE blending is admissible as a toughness mechanism only if
            dispersed LDPE domains measurably increase mechanical energy
            dissipation through morphology alone, without additives,
            compatibilizers, or chemistry changes.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Morphology-driven toughening is <strong>admissible</strong> only if
              commodity polyolefin blending produces a measurable increase in
              toughness or impact energy while maintaining stable dispersed
              morphology. If no gain appears, or if phase separation dominates,
              the claim is non-admissible.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Chemically similar blends only average properties"
        >
          <p>
            The assumption under test is that blending chemically similar
            polyethylenes produces only averaged mechanical behavior and cannot
            meaningfully increase toughness without additives, compatibilizers,
            or chemistry.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Industry defaults to chemistry or geometry"
        >
          <p>
            HDPE is used in structural and impact-prone applications where
            toughness limits performance. Industry typically addresses
            brittleness with additives, copolymers, or geometry changes rather
            than using morphology inside commodity blends as the primary
            dissipation mechanism.
          </p>

          <p>
            If this assumption fails, mechanical enhancement becomes available
            through blend structure alone.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Morphology-only blend regime"
        >
          <ul>
            <li>Matrix: high-density polyethylene</li>
            <li>Dispersed phase: 10–30 wt% low-density polyethylene</li>
            <li>Processing: standard twin-screw melt extrusion</li>
            <li>Specimen formation: compression molding or injection molding</li>
            <li>No compatibilizers, additives, or post-treatment</li>
          </ul>

          <p>
            The system is constrained to commodity processing and morphology
            alone. Any chemical rescue invalidates the test.
          </p>
        </SectionCard>

        {/* HYPOTHESIS */}
        <SectionCard
          eyebrow="Mechanism Hypothesis"
          title="Energy dissipation through dispersed domains"
        >
          <p>
            The governing hypothesis is that LDPE forms dispersed, deformable
            domains inside the HDPE matrix and that these domains act as local
            energy-absorbing inclusions.
          </p>

          <p>
            The claimed gain arises from interfacial slippage and altered
            fracture pathways, not from chemistry and not from simple modulus
            reduction.
          </p>
        </SectionCard>

        {/* PRIMARY MEASUREMENTS */}
        <SectionCard
          eyebrow="Primary Readouts"
          title="Mechanical and morphological evidence"
        >
          <ul>
            <li>Tensile toughness from area under the stress–strain curve</li>
            <li>Instrumented impact energy versus neat HDPE</li>
            <li>Immediate fracture-surface inspection after testing</li>
          </ul>

          <p>
            These readouts must remain directly tied to the claimed toughening
            mechanism. Proxy performance narratives are non-admissible.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Toughness gain with stable dispersed morphology"
        >
          <p>
            The governing variable is the presence of a measurable toughness or
            impact-energy increase relative to neat HDPE while dispersed
            morphology remains stable.
          </p>

          <ul>
            <li>Mechanical gain without morphology collapse = candidate pass</li>
            <li>No gain = non-admissible mechanism</li>
            <li>Macroscopic phase separation = non-admissible structure</li>
          </ul>

          <p>
            Stiffness reduction by itself is not admissible evidence of
            toughening.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            The claim fails if either of the following occurs:
          </p>

          <ul>
            <li>No measurable increase in tensile toughness or impact energy relative to neat HDPE</li>
            <li>Macroscopic phase separation or rapid domain coarsening within 72 hours</li>
          </ul>

          <p>
            If morphology cannot remain stable, morphology cannot serve as the
            governing performance mechanism.
          </p>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Criterion"
          title="What counts as admissible toughening"
        >
          <p>
            The claim passes only if tensile toughness or impact energy
            increases by at least 20% relative to neat HDPE, with stable
            morphology and no visible phase separation.
          </p>

          <p>
            This threshold distinguishes a real mechanical effect from marginal
            variation.
          </p>
        </SectionCard>

        {/* WHAT BREAKS */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Morphology becomes a valid design lever"
        >
          <p>
            If the assumption fails, commodity polyolefin blends can be
            deliberately structured to enhance mechanical performance using
            morphology alone.
          </p>

          <p>
            LDPE is then no longer merely a cost or processing modifier. It
            becomes an admissible mechanical energy-dissipation phase.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              ≥20% increase in tensile toughness or impact energy relative to
              neat HDPE, with stable morphology and no visible phase separation.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              No measurable mechanical gain, or morphology becomes unstable
              through visible separation or rapid domain coarsening.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Morphology is admissible only if it survives measurement.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A blend is not toughened because it is blended. It is toughened only
            if dispersed structure measurably increases energy dissipation
            without collapsing into separation.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
