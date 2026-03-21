import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Surface Scratch Resistance in Polycarbonate via PMMA Dispersion — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether low-level PMMA dispersion in polycarbonate produces durable surface scratch resistance without coatings, compatibilizers, or chemical modification.",
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
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function PCPMMAScratchResistancePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Surface Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Surface Scratch Resistance in Polycarbonate via Low-Level PMMA Dispersion
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Polycarbonate surface durability is admissible as coating-free only
            if low-level PMMA dispersion produces measurable abrasion resistance
            gains without optical degradation, phase instability, or loss of bulk
            performance.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Surface hardening is <strong>admissible without coatings</strong>{" "}
              only if physically dispersed PMMA creates a stable, optically
              acceptable surface phase that measurably reduces abrasion. If
              clarity degrades, domains destabilize, or abrasion resistance does
              not improve, coating-free durability is non-admissible.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Scratch resistance requires coatings or chemistry"
        >
          <p>
            The civilizational assumption under test is that improving scratch
            resistance in transparent polycarbonate requires surface coatings,
            chemical hardening, or specialty additives, and cannot be achieved
            through simple physical blending.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Durability is outsourced to surface treatments"
        >
          <p>
            Polycarbonate is widely used for impact resistance in electronics,
            automotive interiors, glazing, and medical devices, yet surface
            scratching remains a dominant failure mode.
          </p>

          <p>
            Current solutions rely on coatings or multi-step treatments that add
            cost, complexity, and long-term failure risk through wear,
            delamination, or environmental degradation.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Bulk-dispersed PMMA without surface treatment"
        >
          <ul>
            <li>Matrix: polycarbonate</li>
            <li>Dispersed phase: ~10 wt% PMMA</li>
            <li>No compatibilizers, coatings, or post-processing</li>
            <li>Standard twin-screw extrusion + injection molding</li>
          </ul>

          <p>
            The system is constrained to physical dispersion alone. Any chemical
            or coating-based reinforcement invalidates the test.
          </p>
        </SectionCard>

        {/* HYPOTHESIS */}
        <SectionCard
          eyebrow="Mechanism Hypothesis"
          title="Surface migration of harder PMMA microdomains"
        >
          <p>
            The governing hypothesis is that PMMA preferentially migrates toward
            the polycarbonate surface during melt processing, forming discrete,
            mechanically harder microdomains.
          </p>

          <p>
            These domains increase scratch resistance through physical surface
            reinforcement without altering bulk mechanical behavior.
          </p>
        </SectionCard>

        {/* PROTOCOL */}
        <SectionCard
          eyebrow="Minimal Test Protocol"
          title="Abrasion performance under controlled conditions"
        >
          <ul>
            <li>
              <strong>Material:</strong> PC + ~10 wt% PMMA plaques
            </li>
            <li>
              <strong>Control:</strong> Neat polycarbonate plaques
            </li>
            <li>
              <strong>Stability check:</strong> 72-hour exposure at 40°C / 75% RH
            </li>
            <li>
              <strong>Functional test:</strong> Taber abrasion (1000 cycles)
            </li>
            <li>
              <strong>Readout:</strong> haze increase or mass loss
            </li>
          </ul>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Abrasion reduction with preserved optical and phase stability"
        >
          <p>
            The governing variable is the coexistence of:
          </p>

          <ul>
            <li>≥50% reduction in abrasion-induced haze or mass loss</li>
            <li>No visible phase separation or surface blooming</li>
            <li>No optical clarity degradation relative to neat PC</li>
          </ul>

          <p>
            Improvement without stability is non-admissible. Stability without
            improvement is non-admissible.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <ul>
            <li>Surface blooming or phase separation after humidity exposure</li>
            <li>Loss of optical clarity relative to neat polycarbonate</li>
            <li>Less than 50% reduction in abrasion damage</li>
          </ul>

          <p>
            If any of these occur, coating-free surface durability is not
            achieved under the tested conditions.
          </p>
        </SectionCard>

        {/* WHAT BREAKS IF FALSE */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Coating dependence remains structurally required"
        >
          <p>
            If the assumption holds and the claim fails, then surface durability
            in transparent polymers remains dependent on coatings or chemical
            modification.
          </p>
        </SectionCard>

        {/* WHAT CHANGES IF TRUE */}
        <SectionCard
          eyebrow="What Changes If It Holds"
          title="Surface durability becomes a bulk-process outcome"
        >
          <p>
            If the claim holds, scratch resistance becomes achievable through
            standard processing and physical morphology alone, eliminating the
            need for coatings.
          </p>

          <p>
            The surface is no longer a separate engineered layer—it becomes an
            emergent property of bulk processing.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              Abrasion resistance improves ≥50% with no optical or phase
              instability.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              No meaningful abrasion improvement, or optical / phase stability is
              compromised.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A surface is admissible without coating only if it forms itself.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Scratch resistance is not proven because hardness was added—it is
            proven only if the surface reorganizes into a stable, functional
            state through processing alone.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
