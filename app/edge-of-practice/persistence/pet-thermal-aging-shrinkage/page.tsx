import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Thermal Aging and Shrinkage in PET Films — Persistence Irreversibility Boundary | Moral Clarity AI",
  description:
    "A persistence-level constraint artifact testing whether continuous sub-Tg heat exposure causes irreversible shrinkage and tensile loss in PET films over multi-year timescales.",
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
  tone?: "neutral" | "irreversible" | "fail";
}) {
  const toneClass =
    tone === "irreversible"
      ? "border-rose-600/30 bg-rose-600/20 text-rose-800 dark:text-rose-300"
      : tone === "fail"
        ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
        : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function PETThermalAgingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Persistence</SignalPill>
            <SignalPill tone="irreversible">Irreversibility Layer</SignalPill>
            <SignalPill>Thermal Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Thermal Aging and Shrinkage in PET Films
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            PET is admissible as thermally persistent only if continuous
            sub-glass-transition exposure does not accumulate irreversible
            physical aging sufficient to produce permanent shrinkage or tensile
            collapse over multi-year residence times.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A polymer film is <strong>admissible as persistent</strong> only if
              ordinary sub-Tg thermal residence does not silently convert stored
              structure into irreversible shrinkage and embrittlement. If time
              under moderate heat alone is sufficient to collapse dimension or
              tensile integrity, the film is not stable—it is a delayed failure
              system.
            </p>
          </div>
        </section>

        {/* REGIME */}
        <SectionCard
          eyebrow="Persistence Regime"
          title="Thermal irreversibility below overt melting or softening"
        >
          <p>
            This entry belongs to the persistence layer because the governing
            mechanism is not acute overheating, melting, or short-horizon
            thermal shock. The critical event is slow structural relaxation under
            sustained moderate heat.
          </p>

          <p>
            Time is not incidental. Time is the mechanism that turns tolerated
            residence temperature into irreversible material change.
          </p>
        </SectionCard>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Moderate continuous heat does not permanently degrade PET"
        >
          <p>
            The assumption under test is that PET retains dimensional stability
            and tensile properties under continuous moderate heat exposure for
            years.
          </p>
        </SectionCard>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Irreversible Physical Mechanism"
          title="Physical aging and enthalpic relaxation"
        >
          <p>
            The governing mechanism is physical aging under sustained sub-Tg
            temperature, including enthalpic relaxation and structural
            rearrangement that gradually drive permanent shrinkage and
            embrittlement.
          </p>

          <p>
            The failure does not require melting or obvious thermal abuse. It
            emerges from long-duration residence within an apparently tolerable
            thermal regime.
          </p>
        </SectionCard>

        {/* WHY PERSISTENCE */}
        <SectionCard
          eyebrow="Why Persistence Timescales Are Required"
          title="Short tests miss the accumulation pathway"
        >
          <p>
            Cumulative relaxation effects can remain invisible in short-cycle or
            typical accelerated tests, especially when early changes are small
            and mechanically non-catastrophic.
          </p>

          <p>
            The governing transition becomes visible only after prolonged
            exposure, when dimensional drift and tensile loss have matured past
            recoverable or ignorable levels.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Free-standing PET under continuous sub-Tg heat"
        >
          <ul>
            <li>Free-standing PET films</li>
            <li>Constant dry-air exposure at 70–80 °C</li>
            <li>No mechanical loading required</li>
            <li>No humidity cycling or chemical rescue</li>
            <li>Duration: 2–5 years</li>
          </ul>

          <p>
            The system is intentionally ordinary within the thermal regime. The
            claim is not about extreme abuse. It is about whether moderate
            continuous heat residence itself contains an irreversible pathway.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Time-to-permanent dimensional and tensile collapse"
        >
          <p>
            The governing variable is the elapsed residence time required for
            sub-Tg heat exposure to produce irreversible shrinkage and tensile
            degradation beyond admissible stability.
          </p>

          <ul>
            <li>Early dimensional stability is non-admissible evidence of persistence</li>
            <li>Small early relaxation is still governing structural change</li>
            <li>Final shrinkage or strength loss is the terminal expression of long-silent aging</li>
          </ul>

          <p>
            In the persistence regime, “still intact” is not equivalent to
            thermally stable if the structure is already relaxing toward failure.
          </p>
        </SectionCard>

        {/* MVP */}
        <SectionCard
          eyebrow="MVP Persistence Experiment"
          title="Minimal admissible long-horizon test"
        >
          <p>
            Hold free-standing PET films continuously at 70–80 °C in dry air
            for 2–5 years with no interruption, no barrier rescue, and no
            multilayer support that could mask intrinsic dimensional change.
          </p>

          <p>
            The purpose is not to optimize retention. The purpose is to
            determine whether ordinary sub-Tg residence heat alone is sufficient
            to create irreversible thermal aging and shrinkage.
          </p>
        </SectionCard>

        {/* KILL CONDITION */}
        <SectionCard
          eyebrow="Binary Kill Condition"
          title="What breaks the claim"
        >
          <p>
            The claim fails if either of the following becomes true during the
            persistence interval:
          </p>

          <ul>
            <li>Greater than 10% permanent shrinkage</li>
            <li>Greater than 40% tensile strength loss</li>
          </ul>

          <p>
            Once either appears, the system has crossed from delayed thermal
            aging into irreversible structural failure.
          </p>
        </SectionCard>

        {/* PROBABILITY */}
        <SectionCard
          eyebrow="Estimated Probability"
          title="Expected failure likelihood under the stated regime"
        >
          <p>
            Estimated probability of persistence-level failure under the defined
            regime: <strong>0.6–0.8</strong>
          </p>

          <p>
            This estimate is not the conclusion. It is the prior expectation
            attached to the long-horizon test.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure would mean"
        >
          <p>
            Failure would show that PET under moderate continuous thermal
            residence cannot be treated as indefinitely dimensionally stable or
            mechanically reliable simply because the temperature remains below
            the glass-transition threshold.
          </p>

          <p>
            Apparent sub-Tg safety would then be revealed as a pre-collapse
            regime, not true thermal persistence.
          </p>
        </SectionCard>

        {/* VERDICT FRAME */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <div className="mb-3 text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Persistence Judgment
            </div>
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              SURVIVES
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              No greater than 10% permanent shrinkage and no greater than 40%
              tensile loss occur across the full persistence interval.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-600/30 bg-rose-600/10 p-8">
            <div className="mb-3 text-xs uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
              Persistence Judgment
            </div>
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              IRREVERSIBLE FAILURE
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              Permanent shrinkage exceeds 10% or tensile strength loss exceeds
              40%, showing that sustained sub-Tg exposure accumulates into
              irreversible thermal aging and structural degradation.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A film is not thermally stable because it is below Tg.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If moderate sub-Tg residence can mature into permanent shrinkage or
            tensile collapse through elapsed time alone, then the apparent
            stability of PET was always conditional on insufficient time.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/edge-of-practice">Short-Cycle</Link> ·{" "}
          <Link href="/edge-of-practice/extended-cycle">Extended Cycle</Link> ·{" "}
          <Link href="/edge-of-practice/persistence">Persistence Index</Link>
        </p>
      </div>
    </main>
  );
}
