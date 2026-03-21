import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Optical Stability in PMMA via Untreated Silica — Extended Cycle Temporal Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "An Extended Cycle constraint artifact testing whether untreated silica stabilizes optical clarity in PMMA under repeated humidity and temperature cycling.",
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

export default function PMMASilicaOpticalPage() {
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
                <SignalPill>Optical Stability</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Optical Stability in PMMA via Untreated Silica
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Untreated silica is admissible as an optical stabilizing inclusion
                only if repeated humidity and temperature cycling does not drive
                haze growth beyond neat PMMA and instead preserves or improves
                clarity over time.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  Optical stabilization is <strong>admissible</strong> only if
                  untreated silica does not trigger progressive light-scattering
                  instability under environmental cycling. Any haze growth beyond
                  neat PMMA renders the claim non-admissible.
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
                  Haze remains flat or decreases relative to both the initial
                  state and neat PMMA across the defined cycling regime.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Haze progressively rises above neat PMMA baseline, indicating
                  delayed optical breakdown under repeated environmental
                  exposure.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing variable
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Time-resolved optical clarity under humidity and thermal
                  cycling, not initial transparency alone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Nanoparticles inevitably increase haze over time"
        >
          <p>
            The assumption under test is that nanoparticle inclusion inevitably
            degrades optical clarity in transparent polymers as environmental
            cycling proceeds.
          </p>

          <p>
            This page asks whether untreated silica instead stabilizes optical
            performance in PMMA by resisting cycle-driven haze growth over an
            extended exposure window.
          </p>
        </SectionCard>

        {/* WHY EXTENDED CYCLE */}
        <SectionCard
          eyebrow="Why This Is Extended Cycle"
          title="Environmental history is the unresolved variable"
        >
          <p>
            This is not a short-cycle question about initial transmission,
            immediate gloss, or first-pass appearance. The governing issue is
            whether repeated humidity and temperature exposure progressively
            destabilizes optical structure.
          </p>

          <p>
            Entry into this branch is justified only because the decisive failure
            modes emerge through cumulative environmental cycling rather than
            immediate falsification.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal admissible test"
        >
          <p>
            PMMA containing 1–3 wt% untreated silica is subjected to repeated
            humidity and temperature cycling for 8–12 weeks while haze and gloss
            are tracked against neat PMMA.
          </p>

          <ul>
            <li>Material: PMMA + 1–3 wt% untreated silica</li>
            <li>Exposure mode: repeated humidity and temperature cycling</li>
            <li>Duration: 8–12 weeks</li>
            <li>Primary readouts: haze and gloss evolution over time</li>
          </ul>

          <p>
            No surface coatings, compatibilizers, or optical rescue treatments
            are admissible within the governed system.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Cycle-resolved haze stability"
        >
          <p>
            The governing variable is the direction and persistence of haze
            evolution under repeated environmental cycling.
          </p>

          <ul>
            <li>Flat haze = candidate optical stability</li>
            <li>Reduced haze = candidate constructive stabilization</li>
            <li>Progressive haze increase = delayed optical failure</li>
          </ul>

          <p>
            Initial low haze is non-admissible if repeated environmental
            exposure reverses the claim.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            The claim fails if haze progressively increases beyond neat PMMA
            baseline during the environmental cycling interval.
          </p>

          <p>
            In Extended Cycle, delayed clarity loss is not secondary noise. It
            is the primary falsification object.
          </p>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Criterion"
          title="What counts as temporal survival"
        >
          <p>
            The claim passes only if haze remains flat or decreases relative to
            both the initial value and neat PMMA under the full humidity and
            temperature cycling regime.
          </p>

          <p>
            This does not establish universal optical superiority. It establishes
            only that repeated environmental exposure has not yet invalidated the
            stabilization hypothesis.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional nanoparticle logic may miss"
        >
          <p>
            Conventional materials reasoning often treats nanoparticle inclusion
            as an inevitable source of long-horizon haze growth due to
            agglomeration, interfacial scattering, or cycle-induced optical
            mismatch.
          </p>

          <ul>
            <li>Initial transparency does not determine cycling stability</li>
            <li>Environmental history may matter more than static dispersion quality</li>
            <li>Untreated silica may preserve optical order better than expected under repeated exposure</li>
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
            This status marks the entry as fixed in governed form while the
            dominant unresolved variable remains cumulative environmental
            cycling across the defined time horizon.
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
                Haze remains flat or decreases relative to both the initial value
                and neat PMMA across the 8–12 week cycling regime.
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
                Haze progressively rises beyond neat PMMA baseline, indicating
                that untreated silica does not stabilize the dominant
                cycle-driven optical degradation pathway.
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
            Optical clarity is admissible only if it survives cycling.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A transparent polymer is not stabilized by looking clear at the
            start. It is stabilized only if repeated environmental exposure does
            not progressively break the claim.
          </p>
        </section>
      </div>
    </main>
  );
}
