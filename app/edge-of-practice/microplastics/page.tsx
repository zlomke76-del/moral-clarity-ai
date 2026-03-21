import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Microplastics as Dynamic Chemical Agents — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether microplastics remain chemically inert in natural water and sediment under ordinary environmental cycling.",
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

export default function MicroplasticsEdgePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Civilizational Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Microplastics as Dynamic Chemical Agents
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Microplastics are admissible as chemically inert only if their
            presence does not produce persistent, control-separated shifts in
            surrounding environmental chemistry under ordinary outdoor exposure.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A contaminant is <strong>admissible as passive</strong> only if it
              does not create persistent chemical divergence in the medium that
              surrounds it. If microplastic-containing systems drift
              reproducibly away from matched controls, chemical inertness is
              operationally void.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Microplastics are chemically inert in natural environments"
        >
          <p>
            The civilizational assumption under test is that microplastics are
            chemically inert and that their long-term presence in water and
            sediment does not alter surrounding environmental chemistry.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Containment logic depends on chemical passivity"
        >
          <p>
            Environmental policy, waste management, food safety, and water
            treatment systems largely treat microplastics as passive physical
            contaminants. Monitoring frameworks emphasize containment,
            filtration, and visible debris removal under the assumption that
            plastics do not introduce ongoing chemical pathways once they enter
            environmental systems.
          </p>

          <p>
            This assumption underwrites exposure models, pollutant
            classification, remediation priorities, and institutional confidence
            that microplastics matter mainly as particles, not as chemically
            active participants.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Natural water and sediment with matched microplastic challenge"
        >
          <ul>
            <li>Identical containers filled with unfiltered natural water and sediment from one source</li>
            <li>Matched controls with no added microplastics</li>
            <li>Test containers receiving a consistent quantity of clean commercial microplastic particles</li>
            <li>Outdoor exposure limited to ambient temperature variation and natural light cycles</li>
          </ul>

          <p>
            The system excludes forced irradiation, chemical spiking, and
            engineered disturbance. The claim is tested under ordinary
            environmental conditions only.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal field-ready falsification protocol"
        >
          <p>
            Place all containers in a stable, shaded outdoor environment for
            ninety days. At weekly intervals, assess each container using
            non-instrumented, field-ready methods.
          </p>

          <ul>
            <li>Colorimetric chemistry strips</li>
            <li>Simple droplet tests</li>
            <li>Direct visual comparison across matched conditions</li>
          </ul>

          <p>
            The protocol is designed to test whether ordinary observation can
            detect chemical divergence without relying on advanced analytical
            instrumentation.
          </p>
        </SectionCard>

        {/* PRIMARY READOUT */}
        <SectionCard
          eyebrow="Primary Readouts"
          title="Persistent chemical divergence, not single anomalies"
        >
          <p>
            Weekly observations focus on:
          </p>

          <ul>
            <li>Changes in pH</li>
            <li>Visible shifts in dissolved organic matter, including color or turbidity</li>
            <li>Alterations in oxidation–reduction indicators</li>
          </ul>

          <p>
            The governing signal is not magnitude alone. It is persistent,
            reproducible divergence that appears only in microplastic-containing
            containers.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Three-interval control-separated chemical divergence"
        >
          <p>
            The governing variable is whether any single chemical indicator
            diverges from control only in the microplastic condition and
            persists across at least three consecutive observation intervals.
          </p>

          <ul>
            <li>Single-interval deviation = insufficient</li>
            <li>Random fluctuation mirrored in controls = non-admissible</li>
            <li>Persistent microplastic-only divergence = admissible failure signal</li>
          </ul>

          <p>
            One-time anomaly does not break the assumption. Reproducible drift
            does.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            A <strong>persistent and reproducible divergence in any single
            chemical indicator</strong>, present only in microplastic-containing
            containers and persisting across at least three consecutive
            observation intervals, constitutes failure of the assumption.
          </p>

          <p>
            If a control-separated signal persists, microplastics can no longer
            be treated as chemically inert under the tested regime.
          </p>
        </SectionCard>

        {/* WHAT BREAKS */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Containment-only models become insufficient"
        >
          <p>
            If the assumption fails, waste management models based on physical
            containment or debris removal become incomplete, leaving active
            chemical pathways unaddressed.
          </p>

          <p>
            Environmental monitoring systems focused only on particle presence
            misclassify ongoing transformation. Food and water frameworks then
            underestimate exposure by treating microplastics as inert carriers
            instead of dynamic chemical participants.
          </p>
        </SectionCard>

        {/* CLAIM BOUNDARY */}
        <SectionCard
          eyebrow="Boundary of Claim"
          title="What this experiment does and does not establish"
        >
          <ul>
            <li>It does establish whether microplastic-containing systems produce persistent chemical divergence under ordinary exposure</li>
            <li>It does not establish full mechanistic identity of every pathway</li>
            <li>It does not establish organism-level toxicity by itself</li>
            <li>It does not establish all environmental behaviors of all plastic classes</li>
          </ul>

          <p>
            The purpose is not exhaustive mechanistic attribution. The purpose is
            to break or preserve the inertness assumption under ordinary
            conditions.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              No chemical indicator shows persistent, reproducible divergence in
              microplastic-containing containers relative to matched controls
              across the ninety-day interval.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              Any single chemical indicator diverges only in microplastic
              containers and persists for at least three consecutive observation
              intervals.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A passive contaminant does not move chemistry around it.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Microplastics are not chemically inert because they are small or
            persistent. They are inert only if surrounding chemistry remains
            stable in their continued presence.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
