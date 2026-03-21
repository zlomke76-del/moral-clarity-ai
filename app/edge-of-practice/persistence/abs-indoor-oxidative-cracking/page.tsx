import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Oxidative Microcracking of ABS in Indoor Air — Persistence Irreversibility Boundary | Moral Clarity AI",
  description:
    "A persistence-level constraint artifact testing whether ordinary indoor atmospheric exposure produces irreversible oxidative microcracking and embrittlement in uncoated ABS over multi-year timescales.",
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

export default function ABSOxidationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Persistence</SignalPill>
            <SignalPill tone="irreversible">Irreversibility Layer</SignalPill>
            <SignalPill>Environmental Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Oxidative Microcracking of ABS in Indoor Air
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Uncoated ABS is admissible as environmentally stable only if
            ordinary indoor atmospheric exposure does not accumulate irreversible
            oxidative damage sufficient to produce visible cracking or brittle
            fracture over multi-year time horizons.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A material is <strong>admissible as persistent</strong> only if
              ordinary exposure does not silently accumulate irreversible damage
              that later manifests as structural cracking or embrittlement. If
              time alone converts routine indoor air into a fracture pathway, the
              material is not stable—it is a delayed failure system.
            </p>
          </div>
        </section>

        {/* REGIME */}
        <SectionCard
          eyebrow="Persistence Regime"
          title="Environmental time-governed degradation"
        >
          <p>
            This entry sits in the persistence layer because the governing
            mechanism is not acute stress, overload, or rapid cycling. The
            mechanism is slow environmental accumulation over years.
          </p>

          <p>
            Time is not a background variable here. Time is the mechanism by
            which failure becomes inevitable.
          </p>
        </SectionCard>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Ordinary indoor air does not catastrophically embrittle uncoated ABS"
        >
          <p>
            The assumption under test is that uncoated ABS does not undergo
            catastrophic cracking or embrittlement under ordinary indoor
            atmospheric exposure.
          </p>
        </SectionCard>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Irreversible Physical Mechanism"
          title="Slow oxidation beneath apparent normalcy"
        >
          <p>
            The governing mechanism is slow oxidation from ozone and ambient
            indoor pollutants, producing cumulative subsurface damage that is not
            operationally obvious at early stages.
          </p>

          <p>
            Over time, this damage crosses from invisible chemical change into
            visible cracking and brittle structural failure. The transition may
            appear sudden, but the failure is time-integrated and irreversible.
          </p>
        </SectionCard>

        {/* WHY PERSISTENCE */}
        <SectionCard
          eyebrow="Why Persistence Timescales Are Required"
          title="Accelerated testing misses the lived exposure pathway"
        >
          <p>
            Accelerated or clean-air testing does not faithfully reproduce the
            low-grade, cumulative pollutant exposure profile encountered in real
            indoor environments.
          </p>

          <p>
            The relevant damage pathway emerges from ordinary exposure
            persistence, not from artificially intensified event conditions.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Uncoated ABS under real indoor atmospheric residence"
        >
          <ul>
            <li>Uncoated ABS bars</li>
            <li>Exposure in ordinary office or urban indoor air</li>
            <li>Ambient temperature and humidity</li>
            <li>No protective coating or intervention</li>
            <li>Duration: 3–5 years</li>
          </ul>

          <p>
            The system is intentionally ordinary. The claim is not about extreme
            environments. It is about whether routine occupancy conditions are
            enough to create irreversible failure.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Time-to-visible crack or brittle transition"
        >
          <p>
            The governing variable is the time required for ordinary indoor
            exposure to produce irreversible structural expression of oxidative
            damage.
          </p>

          <ul>
            <li>Early aesthetic stability is non-admissible evidence of persistence</li>
            <li>Delayed cracking is still governing failure</li>
            <li>Impact brittleness is equivalent to structural collapse of toughness</li>
          </ul>

          <p>
            In the persistence regime, “still looks fine” is not a valid safety
            signal if the failure pathway is continuing below visibility.
          </p>
        </SectionCard>

        {/* MVP */}
        <SectionCard
          eyebrow="MVP Persistence Experiment"
          title="Minimal admissible long-horizon test"
        >
          <p>
            Expose uncoated ABS bars to ordinary indoor air for 3–5 years under
            ambient office or urban indoor conditions, with no engineered
            acceleration and no protective intervention.
          </p>

          <p>
            The purpose is not to optimize lifetime. The purpose is to determine
            whether ordinary residence time alone is sufficient to produce
            irreversible mechanical breakdown.
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
            <li>Visible surface cracking</li>
            <li>Brittle fracture in a standardized impact test</li>
          </ul>

          <p>
            Once either appears, the system has crossed from delayed degradation
            into irreversible structural failure.
          </p>
        </SectionCard>

        {/* PROBABILITY */}
        <SectionCard
          eyebrow="Estimated Probability"
          title="Expected failure likelihood under the stated regime"
        >
          <p>
            Estimated probability of persistence-level failure under the defined
            regime: <strong>0.65–0.8</strong>
          </p>

          <p>
            This estimate is not the conclusion. It is a prior expectation
            attached to the long-horizon test.
          </p>
        </SectionCard>

        {/* WHAT IT MEANS */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure would mean"
        >
          <p>
            Failure would show that ordinary indoor air cannot be treated as a
            chemically benign holding environment for uncoated ABS over long
            timescales.
          </p>

          <p>
            Indoor residence would then be revealed not as neutral storage, but
            as an active degradation regime with delayed fracture consequences.
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
              No visible cracking and no brittle impact transition appear across
              the full persistence interval.
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
              Visible cracking or brittle fracture appears, showing that ordinary
              indoor exposure accumulates irreversible oxidative damage over time.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A stable material does not become brittle simply by remaining indoors.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If ordinary indoor residence is enough to produce delayed cracking,
            then the apparent stability of uncoated ABS was always conditional on
            insufficient elapsed time.
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
