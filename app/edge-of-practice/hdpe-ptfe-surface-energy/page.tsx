import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Surface Energy–Driven Anti-Fouling in HDPE via Trace PTFE — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether trace PTFE micropowder in HDPE creates durable anti-fouling behavior through surface energy contrast alone, without coatings or post-treatment.",
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
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function HDPEPTFESurfaceEnergyPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Surface Energy Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Surface Energy–Driven Anti-Fouling in HDPE via Trace PTFE Micropowder
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Coating-free anti-fouling is admissible only if trace PTFE domains
            create persistent low-energy surface behavior in commodity HDPE
            without extractive loss, surface breakdown, or reliance on chemical
            modification.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Surface-energy anti-fouling is <strong>admissible</strong> only if
              trace PTFE remains materially retained and measurably reduces
              particulate adhesion through morphology and surface-energy contrast
              alone. If retention fails, adhesion does not change, or the surface
              breaks down, the claim is non-admissible.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Commodity polyolefins require coatings or chemistry for durable anti-fouling"
        >
          <p>
            The civilizational assumption under test is that commodity
            polyolefin surfaces require coatings, high filler loadings, or
            chemical modification to achieve durable anti-fouling or
            anti-adhesion behavior.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Cost, complexity, and abrasion dependence"
        >
          <p>
            Packaging, hygiene products, infrastructure surfaces, and industrial
            handling systems are commonly designed around the premise that
            polyethylene alone cannot deliver durable low-energy surface
            behavior.
          </p>

          <p>
            This pushes industry toward secondary coatings, more complex
            chemistries, and performance modes that often fail under abrasion or
            environmental wear.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Morphology-only low-energy surface regime"
        >
          <ul>
            <li>Matrix: HDPE</li>
            <li>Trace dispersed phase: 1–3 wt% PTFE micropowder</li>
            <li>Processing: standard twin-screw extrusion</li>
            <li>Form factor: films or molded plaques</li>
            <li>No coating, surface treatment, or post-processing rescue</li>
          </ul>

          <p>
            The system is constrained to commodity processing and physical
            surface restructuring alone.
          </p>
        </SectionCard>

        {/* HYPOTHESIS */}
        <SectionCard
          eyebrow="Mechanism Hypothesis"
          title="Low-energy surface contrast from discrete PTFE domains"
        >
          <p>
            The governing hypothesis is that PTFE forms discrete, stable
            low-energy domains at or near the HDPE surface and that these
            domains restructure adhesion behavior through physical surface energy
            contrast alone.
          </p>

          <p>
            The claim is not chemical modification. It is morphology-driven
            anti-fouling arising from stable domain expression at the surface.
          </p>
        </SectionCard>

        {/* PROTOCOL */}
        <SectionCard
          eyebrow="Minimal Test Protocol"
          title="Retention gate plus functional adhesion test"
        >
          <ul>
            <li>
              <strong>Processing:</strong> HDPE + 2 wt% PTFE micropowder, melt
              compounded and cast or molded
            </li>
            <li>
              <strong>Stability gate:</strong> 24-hour Soxhlet extraction in hot
              xylene; PTFE loss must remain below 5% of added mass
            </li>
            <li>
              <strong>Functional test:</strong> fine particulate adhesion
              measured using standard silica dust before and after air-jet
              cleaning
            </li>
          </ul>

          <p>
            The retention gate is non-optional. Surface behavior is
            non-admissible if the low-energy phase is not materially retained.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Retained low-energy morphology with measurable adhesion reduction"
        >
          <p>
            The governing variable is the coexistence of two conditions:
            retained PTFE domains and measurable reduction in particulate
            adhesion relative to neat HDPE.
          </p>

          <ul>
            <li>Retention without adhesion change = non-admissible mechanism</li>
            <li>Adhesion change without retention = non-admissible stability</li>
            <li>Surface breakdown = non-admissible implementation</li>
          </ul>

          <p>
            Visual slickness or anecdotal non-stick behavior is non-admissible
            if these conditions are not simultaneously met.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>Any of the following constitutes failure:</p>

          <ul>
            <li>Detectable PTFE loss exceeding 5%</li>
            <li>No measurable reduction in particulate adhesion versus neat HDPE</li>
            <li>Surface chalking, delamination, or cosmetic breakdown</li>
          </ul>

          <p>
            If any one of these occurs, surface-energy contrast alone is
            insufficient as a durable anti-fouling mechanism in the tested
            system.
          </p>
        </SectionCard>

        {/* WHAT BREAKS */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Morphology alone is insufficient"
        >
          <p>
            If trace PTFE domains do not measurably alter surface adhesion, then
            surface energy contrast alone is insufficient to drive macroscopic
            anti-fouling behavior in commodity polyolefins without coatings or
            high filler loadings.
          </p>
        </SectionCard>

        {/* WHAT CHANGES */}
        <SectionCard
          eyebrow="What Changes If It Holds"
          title="Coating-free anti-fouling becomes materially accessible"
        >
          <p>
            If the claim holds, anti-fouling and anti-caking behavior becomes
            accessible using commodity polymers, standard processing, and purely
            physical mechanisms.
          </p>

          <p>
            PTFE then becomes not merely an additive, but an admissible
            low-energy domain former inside a coating-free commodity surface
            architecture.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              PTFE loss remains below 5%, particulate adhesion is measurably
              reduced relative to neat HDPE, and no surface breakdown appears.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              PTFE is not retained, adhesion does not improve, or the surface
              degrades through chalking, delamination, or cosmetic instability.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A low-energy surface is admissible only if the surface phase remains
            real.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Anti-fouling is not established because a filler was added. It is
            established only if retained surface morphology measurably changes
            adhesion without collapsing into extraction or breakdown.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
