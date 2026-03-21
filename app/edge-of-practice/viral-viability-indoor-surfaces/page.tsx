import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Temporal Persistence of Viral Viability — Surface Decay Boundary | Moral Clarity AI",
  description:
    "A bounded falsification framework testing whether assumed short decay windows for viral viability on indoor surfaces hold under realistic environmental conditions.",
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

function SignalPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function ViralViabilityIndoorSurfaces() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Short-Cycle Falsification</SignalPill>
            <SignalPill>Temporal Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Temporal Persistence of Viral Viability on Indoor Surfaces
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Surface contamination is admissible as short-lived only if viral
            infectivity reliably decays within assumed time windows under
            ordinary indoor conditions. If persistence exceeds these windows,
            temporal decay assumptions are invalid.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Safety assumptions fail when time is underestimated.  
              If viability persists longer than assumed, risk is misclassified.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Viral viability decays rapidly on surfaces"
        >
          <p>
            The governing assumption is that viruses deposited on common indoor
            materials lose infectivity within a short, predictable time window.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Structural Failure"
          title="Decay is surface- and condition-dependent"
        >
          <p>
            Viral persistence may vary significantly across material type,
            humidity, temperature, and micro-environmental conditions.
          </p>

          <p>
            This creates divergence between assumed decay timelines and actual
            viability duration.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Persistence window under real conditions"
        >
          <p>
            The governing variable is not initial contamination but the duration
            over which infectious viability remains detectable.
          </p>

          <ul>
            <li>Short persistence → assumption holds</li>
            <li>Extended persistence → assumption fails</li>
          </ul>
        </SectionCard>

        {/* BOUNDARY */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> No detectable infectivity beyond the assumed
            short window (e.g., ≤24 hours).
          </p>

          <p>
            <strong>Fail:</strong> Detectable infectivity persists beyond that
            window on any surface under ordinary conditions.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Time is a variable, not a constant"
        >
          <p>
            Surface safety cannot be defined by fixed decay timelines. It must
            account for variability across materials and environments.
          </p>
        </SectionCard>

        {/* SCOPE */}
        <SectionCard
          eyebrow="Scope Limitation"
          title="What this does and does not claim"
        >
          <ul>
            <li>Does evaluate persistence duration under defined conditions</li>
            <li>Does not define transmission risk</li>
            <li>Does not establish policy or behavioral recommendations</li>
            <li>Does not generalize across all pathogens or environments</li>
          </ul>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A risk is not gone because time has passed—it is gone when viability is gone.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Time-based assumptions are proxies. Only measured loss of viability
            defines true decay.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
