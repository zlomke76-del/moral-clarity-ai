import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Moisture Cycling Stability in Nylon 6 via Graphite — Extended Cycle Temporal Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "An Extended Cycle constraint artifact testing whether graphite moderates moisture-driven stress and dimensional instability in Nylon 6 under repeated wet–dry cycling.",
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

export default function NylonGraphiteMoisturePage() {
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
                <SignalPill>Moisture Stability</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Moisture Cycling Stability in Nylon 6 via Graphite
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Graphite is admissible as a moisture-stabilizing filler only if
                repeated wet–dry cycling reduces dimensional drift, crack
                formation, or moisture-driven mechanical degradation relative to
                neat nylon over time.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  Moisture moderation is <strong>admissible</strong> only if
                  graphite reduces cyclical swelling stress, cracking, or modulus
                  degradation across repeated absorption and drying intervals.
                  Any greater warpage, crack density, or loss relative to neat
                  nylon renders the claim non-admissible.
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
                  Dimensional drift or crack density is reduced relative to neat
                  nylon across repeated wet–dry cycles.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Warpage, cracking, or modulus loss exceeds neat nylon under the
                  same cycling regime.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing variable
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Time-resolved response to cyclic moisture absorption and
                  release, not single-point dry or wet performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Fillers worsen hygroscopic instability"
        >
          <p>
            The assumption under test is that fillers worsen long-term moisture
            sensitivity in hygroscopic polymers.
          </p>

          <p>
            This page asks whether graphite instead moderates internal stress
            during repeated absorption cycles, reducing the structural
            consequences of dimensional swelling and drying shrinkage over time.
          </p>
        </SectionCard>

        {/* WHY EXTENDED CYCLE */}
        <SectionCard
          eyebrow="Why This Is Extended Cycle"
          title="Moisture history is the unresolved variable"
        >
          <p>
            This is not a short-cycle question about a single exposure event.
            The governing issue is whether repeated wet–dry history causes
            cumulative distortion, crack formation, or mechanical degradation.
          </p>

          <p>
            Entry into this branch is justified only because the decisive failure
            modes emerge through cyclical environmental exposure rather than
            immediate falsification.
          </p>
        </SectionCard>

        {/* EXPERIMENTAL REGIME */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal admissible test"
        >
          <p>
            Nylon 6 containing 5 wt% graphite undergoes weekly wet/dry cycles for
            12 weeks while dimensional stability and crack formation are
            monitored against neat nylon controls.
          </p>

          <ul>
            <li>Material: Nylon 6 + 5 wt% graphite</li>
            <li>Cycle type: repeated wet–dry exposure</li>
            <li>Duration: 12 weeks</li>
            <li>Primary readouts: dimensional drift, crack formation, modulus retention</li>
          </ul>

          <p>
            No compatibilizers, coatings, or moisture-barrier interventions are
            admissible within the governed system.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Cycling-induced stress accumulation"
        >
          <p>
            The governing variable is the cumulative structural response to
            repeated moisture uptake and release.
          </p>

          <ul>
            <li>Reduced dimensional drift = candidate stress moderation</li>
            <li>Lower crack density = candidate cycling resilience</li>
            <li>Improved modulus retention = candidate mechanical stability</li>
          </ul>

          <p>
            A favorable single-cycle result is non-admissible if repeated cycling
            reverses the claim.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            The claim fails if any of the following occurs relative to neat
            nylon:
          </p>

          <ul>
            <li>Greater warpage or dimensional drift</li>
            <li>Higher crack formation or crack density</li>
            <li>Greater modulus loss under repeated cycling</li>
          </ul>

          <p>
            In Extended Cycle, delayed moisture damage is not secondary noise. It
            is the primary falsification object.
          </p>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Criterion"
          title="What counts as temporal survival"
        >
          <p>
            The claim passes only if graphite-filled nylon demonstrates reduced
            dimensional drift or reduced crack density relative to neat nylon
            across the full wet–dry cycling regime.
          </p>

          <p>
            This does not prove universal utility. It establishes only that
            cyclical moisture exposure has not yet invalidated the stress
            moderation hypothesis.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional filler logic may miss"
        >
          <p>
            Conventional materials reasoning often treats fillers as added
            sources of moisture sensitivity, stress concentration, or
            crack-initiation risk in hygroscopic polymers.
          </p>

          <ul>
            <li>Single-exposure swelling does not determine cycle behavior</li>
            <li>Graphite may redistribute or dissipate moisture-driven stress over time</li>
            <li>Dimensional stability may depend on repeated path history, not initial uptake alone</li>
          </ul>

          <p>
            This does not establish general superiority. It defines a legitimate
            temporal boundary question.
          </p>
        </SectionCard>

        {/* STATUS */}
        <SectionCard
          eyebrow="Status"
          title="Current cycle state"
        >
          <p>
            <strong>Final · Mid-Cycle</strong>
          </p>

          <p>
            This status marks the entry as fixed in governed form while the
            dominant unresolved variable remains repeated environmental cycling
            across the defined time horizon.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
              PASS
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-900 dark:text-emerald-100">
              <p>
                Graphite-filled nylon shows reduced dimensional drift or lower
                crack density than neat nylon across the 12-week wet–dry cycling
                regime.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-rose-950 dark:text-rose-50">
              FAIL
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-rose-900 dark:text-rose-100">
              <p>
                Warpage, cracking, or modulus loss exceeds neat nylon, indicating
                that graphite does not moderate the dominant moisture-cycling
                stress pathway.
              </p>
            </div>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50 shadow-sm dark:border-white/10">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Moisture stability is admissible only if it survives repetition.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A hygroscopic polymer is not stabilized by a favorable snapshot. It
            is stabilized only if repeated absorption and release do not
            progressively break the claim.
          </p>
        </section>
      </div>
    </main>
  );
}
