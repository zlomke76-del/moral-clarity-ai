import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Tribological Collapse in Nylon 66–Brass Sliding — Persistence Irreversibility Boundary | Moral Clarity AI",
  description:
    "A persistence-level constraint artifact testing whether dry sliding between Nylon 66 and brass undergoes an irreversible transition from apparently stable wear to catastrophic tribological collapse over long time horizons.",
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

export default function NylonBrassTribologyPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Persistence</SignalPill>
            <SignalPill tone="irreversible">Irreversibility Layer</SignalPill>
            <SignalPill>Tribological Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Tribological Collapse in Nylon 66–Brass Sliding
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Nylon 66 sliding against brass is admissible as tribologically stable
            only if prolonged dry contact does not cross an irreversible
            wear-transition threshold that converts apparently stable operation
            into catastrophic high-wear collapse.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A sliding pair is <strong>admissible as persistent</strong> only if
              ordinary dry operation does not accumulate irreversible surface and
              debris conditions that later trigger abrupt wear escalation. If a
              stable regime silently matures into catastrophic loss, the pair was
              never tribologically stable—only delayed in collapse.
            </p>
          </div>
        </section>

        {/* REGIME */}
        <SectionCard
          eyebrow="Persistence Regime"
          title="Tribological time-governed irreversibility"
        >
          <p>
            This entry belongs to the persistence layer because the governing
            mechanism is not immediate overload, misalignment, or short-cycle
            fatigue. The critical event is a long-horizon regime transition that
            emerges only after extended sliding history.
          </p>

          <p>
            Time is not incidental. Time is the mechanism by which surface
            history accumulates into collapse.
          </p>
        </SectionCard>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Dry Nylon 66–brass contact remains indefinitely stable"
        >
          <p>
            The assumption under test is that Nylon 66 bearings sliding against
            brass retain wear resistance and dimensional tolerance indefinitely
            under dry conditions.
          </p>
        </SectionCard>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Irreversible Physical Mechanism"
          title="Debris accumulation drives abrupt regime transition"
        >
          <p>
            The governing mechanism is progressive accumulation of fine wear
            debris, producing surface embrittlement and eventually triggering an
            abrupt transition into a catastrophic high-wear regime.
          </p>

          <p>
            The failure may appear sudden, but the pathway is cumulative:
            low-salience wear products alter the interface until the original
            regime can no longer persist.
          </p>
        </SectionCard>

        {/* WHY PERSISTENCE */}
        <SectionCard
          eyebrow="Why Persistence Timescales Are Required"
          title="Early stability misclassifies later inevitability"
        >
          <p>
            Initial wear rates can appear acceptably stable for long periods,
            creating the false impression of indefinite durability.
          </p>

          <p>
            The irreversible transition does not emerge in short-cycle or even
            extended-cycle windows. It surfaces only after prolonged dry sliding
            over months to years.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Dry reciprocating Nylon 66 against brass"
        >
          <ul>
            <li>Reciprocating Nylon 66 slab against brass pin</li>
            <li>Moderate constant normal load</li>
            <li>Dry sliding under ambient environment</li>
            <li>No lubrication or engineered debris removal</li>
            <li>Duration: 1–3 years</li>
          </ul>

          <p>
            The system is intentionally ordinary. The claim is not about
            exceptional abuse. It is about whether nominal dry operation itself
            contains a delayed collapse pathway.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Time-to-regime-collapse under continued sliding"
        >
          <p>
            The governing variable is the elapsed sliding history required for
            the interface to cross from nominal wear into an irreversible
            high-wear regime.
          </p>

          <ul>
            <li>Low early wear is non-admissible evidence of persistence</li>
            <li>Delayed collapse still governs the system</li>
            <li>Debris history matters more than initial smooth operation</li>
          </ul>

          <p>
            In the persistence regime, “stable so far” is not a valid durability
            claim if the surface is still walking toward a collapse threshold.
          </p>
        </SectionCard>

        {/* MVP */}
        <SectionCard
          eyebrow="MVP Persistence Experiment"
          title="Minimal admissible long-horizon test"
        >
          <p>
            Operate a reciprocating Nylon 66 slab against a brass pin under
            constant moderate load in dry ambient conditions for 1–3 years, with
            no lubrication and no debris-management intervention.
          </p>

          <p>
            The purpose is not to optimize wear rate. The purpose is to discover
            whether ordinary sliding history alone is sufficient to trigger an
            irreversible tribological transition.
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
            <li>Sudden increase in wear scar depth</li>
            <li>Brass pin mass loss exceeding 10%</li>
          </ul>

          <p>
            Once either appears, the system has crossed from tolerable wear into
            irreversible tribological collapse.
          </p>
        </SectionCard>

        {/* PROBABILITY */}
        <SectionCard
          eyebrow="Estimated Probability"
          title="Expected collapse likelihood under the stated regime"
        >
          <p>
            Estimated probability of persistence-level failure under the defined
            regime: <strong>0.65–0.8</strong>
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
            Failure would show that dry Nylon 66–brass contact cannot be treated
            as indefinitely wear-stable simply because early operation appears
            acceptable.
          </p>

          <p>
            Apparent stability would then be revealed as a pre-collapse regime,
            not a durable tribological state.
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
              No abrupt wear-scar escalation and no brass mass-loss collapse
              occurs across the full persistence interval.
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
              Wear scar depth jumps or brass mass loss exceeds 10%, showing that
              prolonged dry sliding accumulates toward catastrophic tribological
              collapse.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A wear pair is not stable because it wears slowly at first.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If ordinary dry sliding can mature into catastrophic wear through
            accumulated debris history, then the original state was never
            durable—only delayed in collapse.
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
