import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Wear Stability in HDPE via Untreated Talc — Extended Cycle Temporal Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "An Extended Cycle constraint artifact testing whether untreated talc platelets induce self-stabilizing low-shear behavior in HDPE under prolonged sliding exposure.",
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

export default function HDPETalcWearPage() {
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
                <SignalPill>Tribological Stability</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Wear Stability in HDPE via Untreated Talc
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Untreated talc is admissible as a wear-stabilizing filler only if
                prolonged sliding produces a stable or decreasing friction regime
                rather than progressive drag, debris growth, or delayed
                tribological breakdown.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  Wear stabilization is <strong>admissible</strong> only if
                  untreated talc induces a self-stabilizing low-shear regime over
                  time. Any sustained friction rise or excess debris relative to
                  neat HDPE renders the claim non-admissible.
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
                  Friction remains stable or decreases after extended sliding and
                  wear debris does not exceed neat HDPE.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Friction drifts upward, debris accumulates, or delayed wear
                  instability emerges under repeated cycles.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing variable
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Time-resolved tribological behavior under repeated sliding, not
                  initial friction alone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Untreated fillers worsen long-horizon wear"
        >
          <p>
            The assumption under test is that unmodified fillers degrade
            long-term friction and wear behavior in polyethylene.
          </p>

          <p>
            This page asks whether untreated talc platelets instead create a
            self-stabilizing low-shear regime that appears only after extended
            sliding exposure.
          </p>
        </SectionCard>

        {/* EXTENDED-CYCLE ROLE */}
        <SectionCard
          eyebrow="Why This Is Extended Cycle"
          title="Time is the unresolved variable"
        >
          <p>
            This is not a short-cycle claim about immediate friction reduction.
            The decisive question is whether repeated contact reorganizes the
            tribological interface into a stable wear state or exposes delayed
            failure.
          </p>

          <p>
            Entry into this branch is justified only because the candidate
            mechanism requires accumulated sliding history to resolve.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal admissible test"
        >
          <p>
            Mold HDPE containing 10 wt% untreated talc and subject samples to
            continuous pin-on-disk sliding over a 2–4 week interval.
          </p>

          <ul>
            <li>Material: HDPE + 10 wt% untreated talc</li>
            <li>Test mode: continuous pin-on-disk sliding</li>
            <li>Duration: 2–4 weeks</li>
            <li>Primary tracked variable: friction coefficient drift over time</li>
          </ul>

          <p>
            The system must remain materially unchanged across the test. No
            coatings, compatibilizers, or rescue interventions are admissible.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Temporal friction stability"
        >
          <p>
            The governing variable is the direction and stability of friction
            coefficient evolution under repeated sliding cycles.
          </p>

          <ul>
            <li>Stable or decreasing coefficient = candidate self-stabilization</li>
            <li>Increasing coefficient = delayed failure trajectory</li>
            <li>Debris accumulation beyond control = boundary breach</li>
          </ul>

          <p>
            Initial friction values are non-admissible if they do not persist
            across cycle history.
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
            <li>Friction coefficient increases over time</li>
            <li>Debris accumulation exceeds neat HDPE</li>
          </ul>

          <p>
            A delayed rise in friction is not a minor deviation. In Extended
            Cycle, it is the primary falsification object.
          </p>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Criterion"
          title="What counts as temporal survival"
        >
          <p>
            The claim passes only if friction remains stable or decreases after
            at least 10
            <sup>4</sup> sliding cycles.
          </p>

          <p>
            This is not a performance claim. It is only evidence that repeated
            sliding has not yet invalidated the stabilizing hypothesis.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional filler logic may miss"
        >
          <p>
            Conventional materials logic often treats untreated fillers as
            uniformly detrimental to long-horizon wear due to poor interface
            control and abrasive risk.
          </p>

          <ul>
            <li>Early drag does not determine long-cycle behavior</li>
            <li>Platelet orientation may create emergent shear planes over time</li>
            <li>Temporal interface reorganization may matter more than initial dispersion theory</li>
          </ul>

          <p>
            This does not prove broad utility. It defines a legitimate temporal
            boundary question.
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
            This status marks the entry as fixed in its current governed form
            while the dominant unresolved variable remains cumulative sliding
            exposure.
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
                Friction remains stable or decreases after ≥10
                <sup>4</sup> cycles and debris does not exceed neat HDPE.
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
                Friction rises over time or debris accumulation exceeds neat
                HDPE, indicating delayed tribological breakdown.
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
            Low wear is admissible only if it survives repetition.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Tribological stability is not established by a favorable starting
            point. It is established only if repeated sliding does not reverse
            the claim.
          </p>
        </section>
      </div>
    </main>
  );
}
