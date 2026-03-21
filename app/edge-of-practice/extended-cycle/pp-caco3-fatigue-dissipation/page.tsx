import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Fatigue Energy Dissipation in PP via Untreated CaCO₃ — Extended Cycle Temporal Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "An Extended Cycle constraint artifact testing whether untreated calcium carbonate improves polypropylene fatigue resistance through crack deflection and energy dissipation under cyclic loading.",
  robots: { index: true, follow: true },
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
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
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
        : "border-zinc-300/70 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function PPCaCO3FatiguePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Extended Cycle</SignalPill>
                <SignalPill tone="pass">Temporal Boundary</SignalPill>
                <SignalPill>Fatigue Dissipation</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Fatigue Energy Dissipation in PP via Untreated CaCO₃
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Calcium carbonate is admissible as a fatigue-stabilizing inclusion
                only if cyclic loading results in delayed crack initiation through
                energy dissipation and crack deflection rather than accelerated
                brittle failure.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  Fatigue resistance is <strong>admissible</strong> only if
                  repeated cyclic loading delays crack initiation through
                  cumulative energy dissipation. Earlier crack formation or
                  reduced cycle life renders the claim non-admissible.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Boundary Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Valid only if
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Cycles to crack initiation increase meaningfully relative to
                  neat polypropylene under identical loading.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Crack initiation occurs earlier or fatigue life decreases,
                  indicating accelerated damage accumulation.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing variable
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Cycles-to-failure and crack initiation timing under repeated
                  low-strain loading.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Mineral fillers reduce fatigue life"
        >
          <p>
            The assumption under test is that mineral fillers uniformly reduce
            fatigue life in polypropylene by increasing brittleness and
            accelerating crack formation.
          </p>

          <p>
            This page asks whether untreated calcium carbonate instead redistributes
            cyclic stress through crack deflection and localized energy
            dissipation, delaying failure over extended loading history.
          </p>
        </SectionCard>

        {/* WHY IT MATTERS */}
        <SectionCard
          eyebrow="Why This Matters"
          title="Fatigue dominates real-world failure"
        >
          <p>
            Commodity plastics are typically evaluated under static tensile or
            impact conditions, while real-world failure is governed by repeated
            sub-critical loading.
          </p>

          <p>
            Fatigue behavior is often inferred rather than directly measured,
            leaving a major failure domain structurally under-characterized.
          </p>
        </SectionCard>

        {/* WHY EXTENDED CYCLE */}
        <SectionCard
          eyebrow="Why This Is Extended Cycle"
          title="Damage accumulates, not appears"
        >
          <p>
            This is not a short-cycle strength question. The governing issue is
            whether repeated low-strain loading accumulates damage or dissipates
            it over time.
          </p>

          <p>
            Entry into this branch is justified because fatigue failure emerges
            only after large numbers of cycles, not immediate loading events.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal admissible test"
        >
          <p>
            Injection mold polypropylene containing 15 wt% untreated calcium
            carbonate and subject samples to low-strain cyclic flexural fatigue.
          </p>

          <ul>
            <li>Material: PP + 15 wt% untreated CaCO₃</li>
            <li>Mode: cyclic flexural fatigue</li>
            <li>Range: 10⁵–10⁶ cycles</li>
            <li>Primary readout: cycles to crack initiation</li>
          </ul>

          <p>
            No compatibilizers, coatings, or surface treatments are admissible.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Cycle-resolved crack initiation"
        >
          <p>
            The governing variable is the number of cycles required for crack
            initiation relative to neat polypropylene.
          </p>

          <ul>
            <li>Delayed initiation = candidate energy dissipation</li>
            <li>Earlier initiation = accelerated failure pathway</li>
            <li>No change = non-admissible improvement</li>
          </ul>

          <p>
            Static strength or stiffness changes are non-admissible if fatigue
            behavior does not improve.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <ul>
            <li>Earlier crack initiation than neat PP</li>
            <li>Reduced total fatigue life</li>
          </ul>

          <p>
            In Extended Cycle, early fatigue failure is the decisive falsification
            signal.
          </p>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Criterion"
          title="What counts as temporal survival"
        >
          <p>
            The claim passes only if cycles to crack initiation increase by at
            least 30% relative to neat polypropylene.
          </p>

          <p>
            This threshold establishes meaningful delay, not marginal variation.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional filler logic may miss"
        >
          <ul>
            <li>Brittleness is not the only governing fatigue mechanism</li>
            <li>Particle interfaces may deflect or arrest cracks</li>
            <li>Energy dissipation pathways may emerge only under cyclic loading</li>
          </ul>

          <p>
            This does not prove universal improvement. It defines a valid fatigue
            boundary question.
          </p>
        </SectionCard>

        {/* STATUS */}
        <SectionCard eyebrow="Status" title="Current cycle state">
          <p>
            <strong>Final · Mid-Cycle</strong>
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-900">PASS</h2>
            <p className="mt-4 text-sm">
              ≥30% increase in cycles to crack initiation relative to neat PP.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-900">FAIL</h2>
            <p className="mt-4 text-sm">
              Earlier crack initiation or reduced fatigue life.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50">
          <p className="text-2xl font-semibold">
            Fatigue resistance is admissible only if it survives repetition.
          </p>
          <p className="mt-4 text-zinc-300">
            A material is not fatigue-resistant because it is strong once. It is
            fatigue-resistant only if repeated loading does not progressively
            break the claim.
          </p>
        </section>
      </div>
    </main>
  );
}
