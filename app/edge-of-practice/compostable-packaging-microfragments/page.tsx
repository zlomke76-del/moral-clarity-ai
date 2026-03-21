import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Compostability Admissibility Boundary — Residual Microfragments in Home Compost | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining when compostability claims are non-admissible under home compost conditions due to residual packaging microfragments.",
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

export default function CompostablePackagingMicrofragments() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Materials Boundary</SignalPill>
                <SignalPill>RCS Constraint</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Compostability Admissibility Boundary
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Compostability claims are valid only if packaging fully exits the
                recoverable fragment spectrum under realistic home compost
                conditions. Residual microfragments render consumer-facing
                disappearance claims non-admissible.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Boundary Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  A packaging item is <strong>non-admissibly compostable</strong>{" "}
                  under home conditions if any recoverable fragment at or above
                  the defined detection threshold remains after the stated
                  consumer timeframe.
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
                  No fragment at or above 1 mm remains after 12 weeks in realistic
                  home compost conditions.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Any recoverable packaging fragment ≥1 mm remains within the
                  screened compost fraction.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing scale
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Residual fragment persistence under consumer-realistic home
                  composting, not label language or average degradation narrative.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Disappearance within consumer time"
        >
          <p>
            Packaging labeled compostable fully disappears in home compost within
            a reasonable consumer timeframe.
          </p>

          <p>
            This claim is admissible only if disappearance is confirmed by
            residual fragment exclusion, not visual impression or partial
            breakdown.
          </p>
        </SectionCard>

        {/* CONDITIONS */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Home-compost boundary conditions"
        >
          <ul>
            <li>Home compost bin under ambient conditions</li>
            <li>12-week composting interval</li>
            <li>Typical moisture and turning frequency</li>
          </ul>

          <p>
            The claim is bounded to realistic household composting. No industrial
            compost assumptions are admissible within this test.
          </p>
        </SectionCard>

        {/* DETECTION */}
        <SectionCard
          eyebrow="Detection Boundary"
          title="Recoverable fragment spectrum"
        >
          <p>
            Compost is dried, sieved through 5 mm and then 1 mm screens, and
            inspected under stereomicroscopy.
          </p>

          <p>
            Any packaging-derived fragment at or above 1 mm is counted as
            persistent.
          </p>

          <p>
            Visual disappearance is non-admissible if recoverable fragments
            remain.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Persistence, not narrative decay"
        >
          <ul>
            <li>Residual fragment presence or absence</li>
            <li>Fragment size threshold: ≥1 mm</li>
            <li>Time-bounded home compost interval: 12 weeks</li>
          </ul>

          <p>
            The governing variable is recoverable persistence. Partial
            disintegration does not override retained material identity at the
            detection threshold.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="Binary falsification condition"
        >
          <p>
            Presence of any packaging fragment ≥1 mm after 12 weeks constitutes
            failure.
          </p>

          <p>
            A single surviving fragment is sufficient to invalidate full
            disappearance under the defined regime.
          </p>

          <p>
            <strong>Absence of gross visibility is not evidence of compostability.</strong>
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="Residual persistence invalidates consumer meaning"
        >
          <p>
            Consumer-facing compostability claims often rely on apparent
            breakdown, texture loss, or partial fragmentation. These are
            non-admissible proxies if material persists within the recoverable
            fragment spectrum.
          </p>

          <ul>
            <li>Surface disappearance is non-admissible</li>
            <li>Average degradation language is non-admissible</li>
            <li>Partial disintegration is non-admissible as full compostability</li>
          </ul>

          <p>
            Compostability, under this boundary, means exit from detectable
            residual fragment form within the stated home-use regime.
          </p>
        </SectionCard>

        {/* CLAIM BOUNDARY */}
        <SectionCard
          eyebrow="Boundary of Claim"
          title="What this test does and does not establish"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Established
              </div>
              <ul className="space-y-2 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
                <li>Whether residual fragments remain at ≥1 mm</li>
                <li>Whether full disappearance occurred within 12 weeks</li>
                <li>Whether the claim holds under home compost conditions</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-300/70 bg-zinc-100 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300">
                Not established
              </div>
              <ul className="space-y-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                <li>Industrial compost performance</li>
                <li>Ecotoxicity or downstream environmental fate</li>
                <li>Policy or compliance conclusions outside the test regime</li>
              </ul>
            </div>
          </div>
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
                No packaging-derived fragment ≥1 mm remains after 12 weeks under
                realistic home compost conditions.
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
                Any packaging-derived fragment ≥1 mm remains after 12 weeks. The
                full home-compost disappearance claim is non-admissible.
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
            Fragment persistence overrides label intent.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If recoverable material remains within the defined fragment spectrum,
            disappearance has not occurred. Compostability claims must resolve to
            residual absence, not optimistic interpretation.
          </p>
        </section>
      </div>
    </main>
  );
}
