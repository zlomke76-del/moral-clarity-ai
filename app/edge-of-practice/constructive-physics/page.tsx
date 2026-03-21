import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Constructive Physics — Positive-Sum Mechanism Index | Edge of Practice — Moral Clarity AI",
  description:
    "A curated Edge of Practice index of constructive, regime-bounded physics experiments focused on underexploited interface, gradient, and resonance mechanisms.",
  openGraph: {
    title: "Constructive Physics — Positive-Sum Mechanism Index",
    description:
      "Short-cycle constructive experiments exploring overlooked physical structure for energy, water, and environmental systems.",
    url: "https://moralclarity.ai/edge-of-practice/constructive-physics",
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
        Founding Experiment
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

export default function ConstructivePhysicsIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="pass">Constructive Branch</SignalPill>
                <SignalPill>Positive-Sum Physics</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Constructive Physics
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                A disciplined index of constructive, positive-sum experiments
                seeking usable function from underexploited physical structure at
                interfaces, gradients, and resonant regimes.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  A constructive mechanism is admissible only if it reveals
                  additional usable structure from reality without relying on
                  speculative narrative, centralized orchestration, or
                  non-falsifiable performance claims.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Index Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Focus
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Latent energy, water, and environmental performance from
                  overlooked physical regimes.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Valid only if
                </div>
                <p className="text-sm leading-6 text-emerald-100">
                  Mechanisms remain regime-bounded, binary-testable, and rooted
                  in observable physical structure.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Not this
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Not policy, not behavior change, not centralized control, and
                  not speculative invention detached from testable physics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT THIS BRANCH IS */}
        <SectionCard
          eyebrow="Branch Definition"
          title="Constructive, not corrective"
        >
          <p>
            This branch of Edge of Practice does not begin from failure,
            irreversibility, or hidden harm. It begins from the possibility that
            reality still contains accessible, underused structure that can
            increase capability if properly identified.
          </p>

          <p>
            The governing question is not “what is breaking?” but “what usable
            structure remains ignored?”
          </p>
        </SectionCard>

        {/* ADMISSIBILITY */}
        <SectionCard
          eyebrow="Admissibility Boundary"
          title="What qualifies as constructive physics"
        >
          <ul>
            <li>Interface- or gradient-driven mechanism</li>
            <li>Observable physical coupling, not narrative optimism</li>
            <li>Binary or sharply falsifiable experimental structure</li>
            <li>Passive or low-maintenance deployment potential</li>
            <li>No dependence on centralized control for core function</li>
          </ul>

          <p>
            If a proposed mechanism cannot be reduced to a regime-bounded,
            falsifiable physical claim, it does not belong in this index.
          </p>
        </SectionCard>

        {/* WHAT IS EXCLUDED */}
        <SectionCard
          eyebrow="Non-Admissible Additions"
          title="What this section excludes"
        >
          <ul>
            <li>Speculative performance stories without a governing variable</li>
            <li>General futurism not tied to measurable mechanism</li>
            <li>Optimization language standing in for physical proof</li>
            <li>Claims that require broad coordination to function at all</li>
            <li>Metaphorical “energy” concepts detached from real regimes</li>
          </ul>

          <p>
            Constructive does not mean vague. Positive-sum does not mean
            unconstrained.
          </p>
        </SectionCard>

        {/* DEFINING CHARACTERISTICS */}
        <SectionCard
          eyebrow="Defining Characteristics"
          title="Shared grammar across the index"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Constructive, not corrective
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Interface- and gradient-driven
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Binary, falsifiable experiments
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Passive or low-maintenance orientation
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              No turbines, batteries, or central orchestration required
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Built from observable underexploited structure
            </div>
          </div>
        </SectionCard>

        {/* FOUNDING EXPERIMENTS */}
        <section className="space-y-4">
          <div className="px-1">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Founding Experiments
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Initial mechanism set
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <ExperimentCard
              href="/edge-of-practice/constructive-physics/boundary-layer-vorticity-harvesting"
              title="Boundary-Layer Vorticity Harvesting for Turbine-Free Wind Energy"
              description="Harvests rotational kinetic energy from turbulent boundary layers using compliant oscillators rather than bulk-flow turbines."
            />

            <ExperimentCard
              href="/edge-of-practice/constructive-physics/phase-locked-aeroelastic-resonance"
              title="Phase-Locked Aeroelastic Resonant Harvesting"
              description="Explores stable aeroelastic resonance windows to extract energy from low-velocity winds without rotational machinery."
            />

            <ExperimentCard
              href="/edge-of-practice/constructive-physics/thermal-wind-rectification"
              title="Thermal–Wind Coupled Rectification for Directional Work"
              description="Tests whether diurnal thermal gradients and stochastic wind can be rectified into consistent mechanical or electrical output."
            />
          </div>
        </section>

        {/* RELATION TO EOP */}
        <SectionCard
          eyebrow="Relation to Edge of Practice"
          title="A constructive branch inside a constraint-first system"
        >
          <p>
            Constructive Physics is a specialized branch within{" "}
            <Link href="/edge-of-practice">Edge of Practice</Link>. Where much of
            Edge of Practice identifies irreversibility, inadmissibility, and
            failure boundaries, this branch focuses on constructive mechanisms
            that increase capability by aligning engineering with overlooked
            physical structure.
          </p>

          <p>
            The standard remains the same: regime bounds, falsifiability, and
            epistemic discipline. The difference is directional. These entries
            search for admissible gains, not merely exposed limits.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50 shadow-sm dark:border-white/10">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Constructive claims must still answer to reality.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Positive-sum mechanism discovery is valid only when the mechanism is
            observable, bounded, and testable. Reality may still have gifts to
            give—but only where structure can survive scrutiny.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          All experiments are fixed at publication. Revisions occur only through
          explicit versioning to preserve epistemic continuity.
        </p>
      </div>
    </main>
  );
}
