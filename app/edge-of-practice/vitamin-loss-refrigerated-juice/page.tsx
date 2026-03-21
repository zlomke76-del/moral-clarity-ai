import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Vitamin Loss in Refrigerated Juice — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether fresh juice remains nutritionally stable under ordinary home refrigeration over a 48-hour storage window.",
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
  tone?: "neutral" | "fail" | "pass";
}) {
  const toneClass =
    tone === "fail"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function VitaminLossJuice() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Food Stability Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Vitamin Content Loss in Home-Stored Fresh Juices
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Fresh juice is admissible as nutritionally stable under short-term
            refrigeration only if key vitamins do not materially degrade across a
            normal household storage window.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Refrigeration preserves food only if it preserves the property
              being relied upon. If nutritional value falls materially during
              ordinary cold storage, freshness and nutritional stability are not
              equivalent.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Short-term refrigeration preserves most vitamin value"
        >
          <p>
            The hidden assumption under test is that fresh juice retains most of
            its vitamin content during short-term refrigeration.
          </p>
        </SectionCard>

        {/* WHY THIS MATTERS */}
        <SectionCard
          eyebrow="Why This Matters"
          title="Cold storage is often treated as nutritionally neutral"
        >
          <p>
            Consumers commonly assume that refrigeration slows spoilage without
            meaningfully changing nutritional value across one to two days of
            storage.
          </p>

          <p>
            If that assumption fails, freshness advice and consumer expectations
            become misaligned with actual nutrient retention.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Fresh juice under ordinary household refrigeration"
        >
          <ul>
            <li>Fresh juice in sealed food-grade containers</li>
            <li>Storage temperature: 4 °C ±1 °C</li>
            <li>Storage duration: 48 hours</li>
            <li>No freezing, heating, or preservative intervention</li>
          </ul>

          <p>
            The system is intentionally ordinary. The question is not optimal
            preservation chemistry, but whether standard household cold storage
            preserves nutritional content sufficiently to justify the assumption.
          </p>
        </SectionCard>

        {/* VITAMINS */}
        <SectionCard
          eyebrow="Vitamins Tested"
          title="Short-window nutrient stability markers"
        >
          <ul>
            <li>Vitamin C (ascorbic acid)</li>
            <li>Vitamin B6 (pyridoxine)</li>
          </ul>

          <p>
            These vitamins act as direct nutrient stability markers rather than
            broad proxies for all nutritional components.
          </p>
        </SectionCard>

        {/* METHODS */}
        <SectionCard
          eyebrow="Assay Readouts"
          title="Direct quantification of nutrient loss"
        >
          <ul>
            <li>Vitamin C: DCPIP titration</li>
            <li>Vitamin B6: colorimetric assay</li>
          </ul>

          <p>
            The experiment rises or falls on measured concentration change, not
            taste, color, or freshness perception.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Percent nutrient loss across the storage window"
        >
          <p>
            The governing variable is the percent loss of each measured vitamin
            after 48 hours of refrigerated storage.
          </p>

          <ul>
            <li>Low loss = assumption may hold</li>
            <li>Material loss = assumption fails</li>
          </ul>

          <p>
            Refrigeration quality is non-admissible as a nutritional claim if
            the underlying vitamins have already declined past the defined
            threshold.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Binary Falsification Threshold"
          title="What breaks the assumption"
        >
          <p>
            Loss of 20% or more for either vitamin within 48 hours constitutes
            failure of the assumption.
          </p>

          <p>
            The threshold is intentionally binary: the question is not whether
            some degradation occurs, but whether the degradation is large enough
            to invalidate the claim of short-term nutritional stability.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure would mean"
        >
          <p>
            Failure would show that ordinary home refrigeration cannot be
            assumed to preserve the nutritional profile of fresh juice across a
            typical short storage period.
          </p>

          <p>
            In that case, storage advice based on freshness alone would be
            nutritionally incomplete.
          </p>
        </SectionCard>

        {/* SCOPE */}
        <SectionCard
          eyebrow="Boundary of Claim"
          title="What this does and does not establish"
        >
          <ul>
            <li>It does establish whether selected vitamins remain materially stable over 48 hours</li>
            <li>It does not establish full nutritional collapse</li>
            <li>It does not establish spoilage or microbial safety</li>
            <li>It does not generalize across all juice types without direct testing</li>
          </ul>

          <p>
            This is a nutrient-retention boundary test, not a complete food
            quality model.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              Both tested vitamins remain below 20% loss after 48 hours of
              refrigerated storage.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              Either vitamin declines by 20% or more within the 48-hour storage
              window.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Cold storage is not nutritional preservation unless nutrients remain.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A refrigerated juice is not nutritionally equivalent to fresh juice
            because it still looks fresh. It is equivalent only if the measured
            nutrients remain within the claimed stability boundary.
          </p>
        </section>
      </div>
    </main>
  );
}
