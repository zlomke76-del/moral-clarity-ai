import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Long-Term Creep Rupture in Polycarbonate — Persistence Irreversibility Boundary | Moral Clarity AI",
  description:
    "A persistence-level constraint artifact testing whether polycarbonate under constant sub-yield tensile load undergoes irreversible creep accumulation leading to delayed rupture over multi-year timescales.",
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

export default function PCCreepRupturePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Persistence</SignalPill>
            <SignalPill tone="irreversible">Irreversibility Layer</SignalPill>
            <SignalPill>Mechanical Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Long-Term Creep Rupture in Polycarbonate
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Polycarbonate is admissible as mechanically persistent only if
            constant sub-yield tensile loading does not accumulate irreversible
            creep damage sufficient to produce delayed rupture over multi-year
            exposure.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A material under sustained load is <strong>admissible as persistent</strong>{" "}
              only if ordinary residence under sub-yield stress does not silently
              accumulate irreversible deformation and microvoid growth that later
              terminate in abrupt rupture. If time alone converts tolerated load
              into fracture, the material is not stable—it is a delayed failure
              system.
            </p>
          </div>
        </section>

        {/* REGIME */}
        <SectionCard
          eyebrow="Persistence Regime"
          title="Mechanical irreversibility under constant stress"
        >
          <p>
            This entry belongs to the persistence layer because the governing
            mechanism is not overload, cyclic fatigue, or short-horizon damage.
            The critical event is long-term creep accumulation under a load that
            appears safe at the outset.
          </p>

          <p>
            Time is the active failure mechanism. The stress is constant; the
            material state is what changes irreversibly.
          </p>
        </SectionCard>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Sub-yield load remains indefinitely non-destructive"
        >
          <p>
            The assumption under test is that polycarbonate maintains
            dimensional stability and mechanical integrity indefinitely under
            constant moderate mechanical stress.
          </p>
        </SectionCard>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Irreversible Physical Mechanism"
          title="Molecular relaxation and microvoid growth"
        >
          <p>
            The governing mechanism is slow creep deformation driven by
            molecular relaxation and progressive microvoid nucleation and growth
            within the stressed gauge section.
          </p>

          <p>
            Over time, this cumulative deformation crosses from apparently
            tolerable strain into abrupt rupture. The fracture event appears
            sudden, but the pathway is slow, irreversible, and time-integrated.
          </p>
        </SectionCard>

        {/* WHY PERSISTENCE */}
        <SectionCard
          eyebrow="Why Persistence Timescales Are Required"
          title="Short horizons never reach the rupture threshold"
        >
          <p>
            Short-cycle and extended-cycle tests do not typically run long
            enough to reach the temporal threshold required for microvoid
            nucleation and creep-driven fracture under sub-yield load.
          </p>

          <p>
            Early dimensional stability is therefore non-admissible evidence of
            long-term persistence.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Standard PC specimen under constant sub-yield tensile load"
        >
          <ul>
            <li>Mold standard polycarbonate dogbone specimens</li>
            <li>Apply constant tensile load at 50% of yield strength</li>
            <li>Maintain ambient temperature and humidity</li>
            <li>No unloading, reinforcement, or environmental rescue</li>
            <li>Duration: 2–4 years</li>
          </ul>

          <p>
            The system is intentionally ordinary. The claim is not about extreme
            loading; it is about whether seemingly acceptable sustained stress
            contains an irreversible fracture pathway.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Time-to-rupture under constant sub-yield stress"
        >
          <p>
            The governing variable is the elapsed residence time required for
            the stressed specimen to cross from tolerated creep into complete
            rupture.
          </p>

          <ul>
            <li>Initial dimensional stability is non-admissible evidence of persistence</li>
            <li>Progressive strain without fracture is still governing damage accumulation</li>
            <li>Final rupture is the terminal expression of long-silent instability</li>
          </ul>

          <p>
            In the persistence regime, “not yet broken” is not equivalent to
            mechanically stable.
          </p>
        </SectionCard>

        {/* MVP */}
        <SectionCard
          eyebrow="MVP Persistence Experiment"
          title="Minimal admissible long-horizon test"
        >
          <p>
            Hold standard PC dogbone specimens at a constant tensile load equal
            to 50% of yield strength for 2–4 years under ambient temperature and
            humidity, with no unloading and no environmental acceleration.
          </p>

          <p>
            The purpose is not to optimize creep rate. The purpose is to
            determine whether sustained ordinary stress alone is sufficient to
            produce irreversible rupture over time.
          </p>
        </SectionCard>

        {/* KILL CONDITION */}
        <SectionCard
          eyebrow="Binary Kill Condition"
          title="What breaks the claim"
        >
          <p>
            The claim fails if the specimen undergoes complete fracture within
            the gauge section accompanied by abrupt loss of load.
          </p>

          <p>
            Once this occurs, the material has crossed from delayed deformation
            into irreversible structural failure.
          </p>
        </SectionCard>

        {/* PROBABILITY */}
        <SectionCard
          eyebrow="Estimated Probability"
          title="Expected rupture likelihood under the stated regime"
        >
          <p>
            Estimated probability of persistence-level failure under the defined
            regime: <strong>0.7–0.8</strong>
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
            Failure would show that polycarbonate under moderate sustained load
            cannot be treated as indefinitely mechanically stable simply because
            the applied stress remains below conventional yield.
          </p>

          <p>
            Apparent safety would then be revealed as pre-rupture persistence,
            not long-term structural admissibility.
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
              No complete gauge-section rupture occurs across the full
              persistence interval.
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
              The specimen fractures within the gauge section with abrupt loss
              of load, showing that sub-yield residence stress can accumulate
              into delayed mechanical collapse.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A material is not stable because the load is below yield.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If ordinary sub-yield loading can mature into abrupt rupture through
            elapsed time alone, then the apparent stability of the system was
            always conditional on insufficient time.
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
