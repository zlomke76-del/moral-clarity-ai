import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Electret Filtration Under Humidity — Connectivity Failure Boundary (PET + PVDF) | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether humidity-driven electret decay is governed by connectivity collapse rather than smooth discharge—and whether polymer-level architectures outperform surface-treated systems.",
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
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

export default function PetPvdfElectretHumidityEdgeCasePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Electrostatic Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Electret Filtration Under Humidity
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Electret filtration is admissible under humidity only if charge
            retention decays smoothly and predictably. If performance collapse
            occurs through connectivity-driven transitions, then surface-charged
            commodity polymers are structurally insufficient.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Electrostatic filtration is <strong>admissible</strong> only if
              humidity-driven charge decay is continuous and controllable. If
              charge collapses through discrete connectivity failure (“knee”
              behavior), then polymer architecture—not surface charging—is the
              governing variable.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Surface-charged electrets are sufficient under humidity"
        >
          <p>
            Conventional PET and polypropylene electret filters are assumed to
            provide sufficiently durable electrostatic performance under
            humidity, making intrinsically charge-retentive polymer systems
            unnecessary.
          </p>
        </SectionCard>

        {/* WHY TOLERATED */}
        <SectionCard
          eyebrow="Why This Assumption Persists"
          title="Degradation is treated as acceptable loss"
        >
          <p>
            Charge decay is treated as a secondary degradation mode and managed
            through oversizing, replacement intervals, or coatings.
          </p>

          <p>
            The system survives not because it is optimal—but because it is
            operationally tolerated.
          </p>
        </SectionCard>

        {/* EDGE CASE */}
        <SectionCard
          eyebrow="Edge Case Definition"
          title="Is humidity failure actually dominant and structural?"
        >
          <p>
            This edge case asks whether humidity-induced charge loss is the
            primary failure mechanism—and whether polymer-level architectures
            decisively outperform surface-treated electrets.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Controlled comparison of electret architectures"
        >
          <ul>
            <li>PET-only electret media</li>
            <li>Polypropylene meltblown electret media</li>
            <li>PET + PVDF (or PVDF-HFP) bicomponent or blended fibers</li>
            <li>Identical charging protocol (corona or friction)</li>
            <li>Humidity exposure ≥80% RH for 24–72 hours</li>
          </ul>
        </SectionCard>

        {/* PRIMARY READOUT */}
        <SectionCard
          eyebrow="Primary Readout"
          title="Charge retention and filtration decay"
        >
          <ul>
            <li>Surface potential vs time</li>
            <li>Filtration efficiency at fixed pressure drop</li>
          </ul>
        </SectionCard>

        {/* KNEE CRITERION */}
        <SectionCard
          eyebrow="Critical Mechanism"
          title="Connectivity-driven failure (“knee” behavior)"
        >
          <p>
            Charge decay is not assumed to be smooth. Instead, this test allows
            for non-monotonic behavior governed by connectivity of localized
            fast-release regions.
          </p>

          <p>
            A distinct “knee” in the decay curve represents a regime transition:
            the system shifts from stable charge retention to rapid collapse.
          </p>

          <p>
            This indicates loss of global constraint connectivity rather than
            uniform degradation.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Presence or absence of regime transition"
        >
          <p>
            The governing variable is not final charge level—but whether a
            connectivity-driven collapse occurs.
          </p>

          <ul>
            <li>Smooth decay → tolerable degradation</li>
            <li>Knee collapse → structural failure mode</li>
            <li>No decay → stabilized architecture</li>
          </ul>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Pass / Fail Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> PET + PVDF shows no meaningful improvement over
            PET or PP under humidity.
          </p>

          <p>
            <strong>Fail:</strong> PET + PVDF retains significantly higher charge
            and efficiency, with clear separation from legacy materials.
          </p>
        </SectionCard>

        {/* FLIP */}
        <SectionCard
          eyebrow="Flip Condition"
          title="Where the system becomes indefensible"
        >
          <p>
            PET + PVDF maintains electrostatic performance under humidity while
            PET and PP electrets collapse—without coatings or post-processing.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Electret performance is architecture-bound"
        >
          <p>
            Electret durability under humidity is not governed by surface
            charging alone. Polymer architecture becomes the primary control
            variable.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A filter is not stable because it works dry.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If humidity can trigger abrupt electrostatic collapse, then the
            system was never durable—only conditionally functional.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          <Link href="/edge-of-practice">
            Edge of Practice short-cycle index
          </Link>
        </p>
      </div>
    </main>
  );
}
