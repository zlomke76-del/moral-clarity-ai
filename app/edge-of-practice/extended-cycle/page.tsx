import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Extended Cycle — Temporal Durability Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A governed index of experiments promoted from short-cycle falsification into extended testing, where repetition, fatigue, and environmental cycling become the dominant variables.",
  openGraph: {
    title: "Extended Cycle — Temporal Durability Boundary",
    description:
      "Experiments that survived short-cycle falsification and now test durability, fatigue, and slow failure modes under governed conditions.",
    url: "https://moralclarity.ai/edge-of-practice/extended-cycle",
    siteName: "Moral Clarity AI",
    type: "article",
  },
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

function ExperimentCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
    >
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        Extended Cycle Candidate
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-zinc-950 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
    </Link>
  );
}

export default function EdgeOfPracticeExtendedCyclePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="pass">Extended Cycle</SignalPill>
                <SignalPill>Temporal Boundary</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Extended Cycle
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Experiments that earned time. These entries survived short-cycle
                falsification and now test whether the same assumption fails only
                under repetition, fatigue, or environmental cycling.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  An experiment enters Extended Cycle only when rapid failure
                  has been ruled out and <strong>time becomes the governing
                  variable</strong>. Survival remains provisional. Endurance is
                  admissible only until a slow failure signature appears.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Index Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Entry condition
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Short-cycle failure modes explicitly passed.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Governing variable
                </div>
                <p className="text-sm leading-6 text-emerald-100">
                  Repetition, duration, fatigue, and environmental cycling.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Not implied
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Not usefulness, not safety, not permanence, and not scale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEFINITION */}
        <SectionCard
          eyebrow="Branch Definition"
          title="What changes when an experiment earns time"
        >
          <p>
            Extended Cycle does not introduce a new thesis. It preserves the
            original assumption and re-tests it under longer temporal exposure.
          </p>

          <p>
            The question is no longer whether rapid falsification occurs. The
            question becomes whether the same assumption breaks only after
            cumulative stress, repetition, wear, drift, or cyclical exposure.
          </p>

          <p>
            Time is not background. Time becomes the dominant admissibility
            variable.
          </p>
        </SectionCard>

        {/* QUALIFICATION */}
        <SectionCard
          eyebrow="Qualification Criteria"
          title="What an experiment must satisfy before entry"
        >
          <ul>
            <li>Short-cycle failure conditions explicitly passed</li>
            <li>New failure modes require repetition or duration to emerge</li>
            <li>No chemistry, coatings, or proprietary tools are introduced</li>
            <li>The experiment remains binary: pass or fail</li>
          </ul>

          <p>
            If a new intervention, formulation, or protective mechanism is
            introduced, the experiment is no longer a pure temporal extension of
            the original claim.
          </p>
        </SectionCard>

        {/* ADMISSIBILITY */}
        <SectionCard
          eyebrow="Admissibility Boundary"
          title="What counts as a valid extended-cycle test"
        >
          <p>
            An extended-cycle experiment is admissible only if the original
            system remains materially continuous with the short-cycle version
            that earned promotion.
          </p>

          <ul>
            <li>No hidden reformulation of the tested object</li>
            <li>No rescue variables introduced after short-cycle survival</li>
            <li>No replacement of binary failure with trend interpretation</li>
            <li>No conversion of endurance into performance marketing</li>
          </ul>

          <p>
            Survival over time is not a narrative asset. It is only a temporary
            absence of failure.
          </p>
        </SectionCard>

        {/* FAILURE MODES */}
        <SectionCard
          eyebrow="Temporal Failure Class"
          title="What this branch is designed to surface"
        >
          <ul>
            <li>Fatigue-driven breakdown</li>
            <li>Slow wear accumulation</li>
            <li>Environmental cycling instability</li>
            <li>Delayed crack initiation or propagation</li>
            <li>Progressive optical, dimensional, or modulus drift</li>
          </ul>

          <p>
            These are not “minor degradations.” In this branch, slow failure
            modes are the primary object of inquiry.
          </p>
        </SectionCard>

        {/* CANDIDATES */}
        <section className="space-y-4">
          <div className="px-1">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Extended Cycle Candidates
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Current promoted experiments
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ExperimentCard
              href="/edge-of-practice/extended-cycle/pp-caco3-fatigue-dissipation"
              title="Fatigue Energy Dissipation in PP via Untreated CaCO₃"
              description="Tests whether crack deflection and delayed fatigue failure remain stable under cyclic loading."
            />

            <ExperimentCard
              href="/edge-of-practice/extended-cycle/hdpe-talc-wear-stability"
              title="Wear Stability in HDPE via Untreated Talc"
              description="Tracks long-horizon tribological behavior governed by particle orientation and repeated contact."
            />

            <ExperimentCard
              href="/edge-of-practice/extended-cycle/pc-glassfiber-thermal-cycling"
              title="Thermal Cycling Stability in PC with Short Glass Fiber"
              description="Tests whether repeated thermal shock produces delayed failure or stable micro-slip stress dissipation."
            />

            <ExperimentCard
              href="/edge-of-practice/extended-cycle/pmma-silica-optical-stability"
              title="Optical Stability in PMMA via Untreated Silica"
              description="Evaluates haze resistance and delayed optical breakdown under humidity and thermal cycling."
            />

            <ExperimentCard
              href="/edge-of-practice/extended-cycle/nylon-graphite-moisture-cycling"
              title="Moisture Cycling Stability in Nylon 6 via Graphite"
              description="Tests dimensional and modulus stability under repeated wet–dry environmental cycling."
            />
          </div>
        </section>

        {/* GOVERNANCE */}
        <SectionCard
          eyebrow="Governance"
          title="What Extended Cycle does not permit"
        >
          <p>
            Extended Cycle remains falsification-first. Promotion does not
            convert survival into endorsement.
          </p>

          <ul>
            <li>Survival does not imply usefulness</li>
            <li>Survival does not imply safety</li>
            <li>Survival does not imply permanence</li>
            <li>Survival does not justify deployment claims</li>
          </ul>

          <p>
            The only admissible statement is that time has not yet broken the
            assumption under the tested regime.
          </p>
        </SectionCard>

        {/* NEXT STAGE */}
        <SectionCard
          eyebrow="Promotion Rule"
          title="What qualifies for Persistence"
        >
          <p>
            Promotion from Extended Cycle to Persistence requires explicit
            documentation that the experiment has survived extended exposure and
            that its remaining risks are slow, irreversible, or structurally
            latent rather than merely delayed repetitions of short-cycle
            breakdown.
          </p>

          <p>
            Persistence is not granted by elapsed time alone. It requires a new
            failure ontology.
          </p>
        </SectionCard>

        {/* RELATION */}
        <SectionCard
          eyebrow="Relation to Edge of Practice"
          title="A temporal branch inside the same constraint system"
        >
          <p>
            Extended Cycle is a governed branch of{" "}
            <Link href="/edge-of-practice">Edge of Practice</Link>. It inherits
            the same binary logic, the same anti-interpretive structure, and the
            same refusal of narrative inflation.
          </p>

          <p>
            The difference is not loosened standards. The difference is that the
            decisive variable has shifted from immediate falsification to
            time-bounded endurance under repeated exposure.
          </p>
        </SectionCard>

        {/* VERDICT FRAME */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Admissible Entry
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
              PROMOTED
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-900 dark:text-emerald-100">
              <p>
                Rapid failure has been ruled out and the tested assumption now
                requires temporal exposure to break.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
              Non-Admissible Entry
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-rose-950 dark:text-rose-50">
              REJECTED
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-rose-900 dark:text-rose-100">
              <p>
                Short-cycle failure remains unresolved, or the extended test
                changes the system rather than the time horizon.
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
            Time earns attention. It does not earn trust.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Extended survival means only that immediate failure has not yet
            occurred. The assumption remains provisional until time itself is no
            longer the unresolved variable.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Promotion to Persistence requires explicit documentation of extended
          survival and identification of slow, irreversible failure modes.
        </p>
      </div>
    </main>
  );
}
