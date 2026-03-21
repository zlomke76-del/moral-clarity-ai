import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Edge of Practice — Persistence (Irreversibility Layer) | Moral Clarity AI",
  description:
    "Persistence-level experiments testing assumptions that only fail irreversibly over long time horizons, where degradation becomes unavoidable rather than conditional.",
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
  tone?: "neutral" | "irreversible";
}) {
  const toneClass =
    tone === "irreversible"
      ? "border-rose-600/30 bg-rose-600/20 text-rose-800 dark:text-rose-300"
      : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

export default function EdgeOfPracticePersistencePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="irreversible">Irreversibility Layer</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Persistence
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Persistence experiments test assumptions that do not fail quickly,
            but fail inevitably. Time is not a variable here—it is the mechanism
            of failure.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A system is <strong>non-admissible</strong> if failure is guaranteed
              given sufficient time, regardless of initial performance. If time
              alone produces irreversible breakdown, the system is not stable—
              it is delayed failure.
            </p>
          </div>
        </section>

        {/* DEFINITION */}
        <SectionCard
          eyebrow="Definition"
          title="Persistence as inevitable failure domain"
        >
          <p>
            Persistence experiments operate in the regime where short-cycle and
            extended-cycle tests have not produced failure, but degradation
            continues silently.
          </p>

          <p>
            The goal is not to observe whether failure occurs—but to determine
            whether failure is <strong>inevitable</strong> under continued
            exposure.
          </p>
        </SectionCard>

        {/* DISTINCTION */}
        <SectionCard
          eyebrow="What Makes This Different"
          title="Not conditional failure—irreversible outcome"
        >
          <ul>
            <li>Short-cycle: failure is immediate or rapid</li>
            <li>Extended-cycle: failure depends on repetition</li>
            <li>
              <strong>Persistence:</strong> failure emerges from time itself
            </li>
          </ul>

          <p>
            In this regime, performance metrics are misleading. Survival does not
            indicate stability—only that failure has not yet surfaced.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Time-to-irreversible-state"
        >
          <p>
            The governing variable is not stress, load, or environment alone—it
            is the relationship between:
          </p>

          <ul>
            <li>Time under exposure</li>
            <li>Accumulated irreversible change</li>
          </ul>

          <p>
            Once a system crosses a critical threshold, recovery is not degraded
            — it is impossible.
          </p>
        </SectionCard>

        {/* FAILURE SIGNATURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What defines persistence-level failure"
        >
          <ul>
            <li>Degradation accumulates without visible early warning</li>
            <li>Failure appears sudden but is time-integrated</li>
            <li>Recovery cannot restore original state</li>
            <li>Initial performance metrics remain misleading until collapse</li>
          </ul>

          <p>
            These systems do not fail because they were stressed. They fail
            because they existed long enough.
          </p>
        </SectionCard>

        {/* EXPERIMENTS */}
        <SectionCard
          eyebrow="Persistence Experiments"
          title="Irreversibility under long-horizon exposure"
        >
          <ul className="space-y-3">
            <li>
              <Link href="/edge-of-practice/persistence/pc-creep-rupture">
                Long-Term Creep Rupture in Polycarbonate
              </Link>
            </li>
            <li>
              <Link href="/edge-of-practice/persistence/nylon66-brass-tribological-collapse">
                Tribological Collapse in Nylon 66–Brass Sliding
              </Link>
            </li>
            <li>
              <Link href="/edge-of-practice/persistence/pet-thermal-aging-shrinkage">
                Thermal Aging and Shrinkage in PET Films
              </Link>
            </li>
            <li>
              <Link href="/edge-of-practice/persistence/psu-indoor-optical-aging">
                Indoor Optical Aging of Polysulfone
              </Link>
            </li>
            <li>
              <Link href="/edge-of-practice/persistence/abs-indoor-oxidative-cracking">
                Oxidative Microcracking of ABS in Indoor Air
              </Link>
            </li>
          </ul>
        </SectionCard>

        {/* RELATION */}
        <SectionCard
          eyebrow="Relation to Edge of Practice"
          title="Three layers of falsification"
        >
          <ul>
            <li>
              <Link href="/edge-of-practice">Short-Cycle</Link> — immediate failure
            </li>
            <li>
              <Link href="/edge-of-practice/extended-cycle">Extended Cycle</Link>{" "}
              — fatigue and repetition
            </li>
            <li>
              <strong>Persistence</strong> — inevitable long-term breakdown
            </li>
          </ul>

          <p>
            Together, these define whether a system is:
          </p>

          <ul>
            <li>Immediately invalid</li>
            <li>Conditionally valid</li>
            <li>Or fundamentally unstable over time</li>
          </ul>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            If time guarantees failure, performance is irrelevant.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A system that only works temporarily is not stable—it is a delayed
            failure system.
          </p>
        </section>

      </div>
    </main>
  );
}
