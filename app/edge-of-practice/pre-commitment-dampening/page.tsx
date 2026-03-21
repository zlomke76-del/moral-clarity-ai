import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Pre-Commitment Dampening — Decision Integrity Boundary | Moral Clarity AI",
  description:
    "A design invariant establishing that refusal is only valid if persuasive momentum is structurally constrained before the decision point.",
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

function SignalPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function PreCommitmentDampeningPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Design Invariant</SignalPill>
            <SignalPill>Decision Integrity</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Pre-Commitment Dampening
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            A system is admissible as respecting refusal only if the conditions
            leading to refusal remain free of accumulated coercive momentum. If
            persuasive force is allowed to build unchecked before the decision
            point, refusal becomes structurally compromised—even if formally available.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A decision is not free at the moment of refusal—it is free or
              constrained long before it.  
              If pressure accumulates upstream, refusal becomes a formality,
              not a choice.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Refusal as a terminal safeguard is sufficient"
        >
          <p>
            Many systems assume that the ability to refuse at the endpoint of a
            process is sufficient to preserve autonomy and decision integrity.
          </p>
        </SectionCard>

        {/* BREAK */}
        <SectionCard
          eyebrow="Structural Failure"
          title="Momentum invalidates refusal"
        >
          <p>
            If persuasion, urgency, repetition, or social pressure accumulates
            without constraint, the decision environment becomes biased before
            refusal is exercised.
          </p>

          <p>
            The system does not need to block refusal—it only needs to make it
            costly, delayed, or psychologically improbable.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Pre-decision pressure accumulation"
        >
          <p>
            The governing variable is not whether refusal exists, but whether
            the conditions leading up to it preserve decision independence.
          </p>

          <ul>
            <li>Low pressure → refusal remains meaningful</li>
            <li>Accumulated pressure → refusal degrades</li>
            <li>High momentum → refusal becomes nominal</li>
          </ul>
        </SectionCard>

        {/* MECHANISMS */}
        <SectionCard
          eyebrow="Dampening Mechanisms"
          title="How integrity is preserved upstream"
        >
          <ul>
            <li>Attempt caps — limit repeated persuasion cycles</li>
            <li>Cooling intervals — interrupt urgency escalation</li>
            <li>Salience decay — reduce persuasive intensity over time</li>
            <li>Process gates — enforce reflection before escalation</li>
            <li>Pressure detection — flag coercive buildup</li>
          </ul>
        </SectionCard>

        {/* CRITICAL DISTINCTION */}
        <SectionCard
          eyebrow="Critical Distinction"
          title="Refusal vs decision integrity"
        >
          <p>
            Refusal answers whether the system can stop.
          </p>

          <p>
            Pre-commitment dampening answers whether the system has already made
            stopping effectively impossible.
          </p>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the system"
        >
          <p>
            <strong>Pass:</strong> Refusal remains freely exercisable without
            accumulated pressure or bias.
          </p>

          <p>
            <strong>Fail:</strong> Persuasive momentum alters the decision
            landscape before refusal is reached.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Autonomy is upstream, not terminal"
        >
          <p>
            Decision integrity must be enforced throughout the decision arc.
            Terminal safeguards alone cannot preserve autonomy.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A right exercised too late is not a right.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If the system allows persuasive force to accumulate before the
            decision point, refusal is preserved in form but lost in function.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          <Link href="/edge-of-practice">
            Edge of Practice index
          </Link>
        </p>
      </div>
    </main>
  );
}
