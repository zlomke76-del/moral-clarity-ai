import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Passive Thermal Buffering in Polyethylene Films — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether physically confined paraffin wax enables commodity polyethylene films to measurably buffer thermal spikes without leakage, exudation, or chemical modification.",
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

export default function PEThermalBufferingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Thermal Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Passive Thermal Buffering in Polyethylene Films
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Commodity polyethylene is admissible as a thermally buffering film
            only if physically confined paraffin measurably slows heat uptake
            without leakage, wax migration, or chemical modification.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Thermal buffering is <strong>admissible without encapsulation</strong>{" "}
              only if latent-heat behavior inside polyethylene produces a real,
              measurable reduction in heating rate while the wax remains
              materially confined. If the film does not buffer heat or cannot
              retain the phase-change fraction, the claim is non-admissible.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Commodity polyethylene films are thermally passive"
        >
          <p>
            The civilizational assumption under test is that commodity
            polyethylene films are thermally passive barriers and cannot
            meaningfully moderate temperature spikes without encapsulated phase
            change materials, chemical modification, or multilayer composites.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Thermal management is outsourced to separate systems"
        >
          <p>
            Food packaging, medical transport, cold-chain logistics, and
            consumer-goods protection all assume that polyethylene films transmit
            ambient heat changes essentially unchanged.
          </p>

          <p>
            Thermal moderation is therefore delegated to foams, gels, and
            discrete PCM inserts, increasing cost, complexity, packaging mass,
            and waste.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Polyethylene film with physically confined paraffin"
        >
          <ul>
            <li>Matrix: LDPE or LLDPE</li>
            <li>Latent-heat fraction: 5–10 wt% paraffin wax (C20–C28)</li>
            <li>No encapsulation, no chemical binding, no coating</li>
            <li>Standard film extrusion into 50–150 μm film</li>
          </ul>

          <p>
            The system is constrained to commodity processing and physical
            confinement alone. Any encapsulation or chemistry rescue invalidates
            the test.
          </p>
        </SectionCard>

        {/* HYPOTHESIS */}
        <SectionCard
          eyebrow="Mechanism Hypothesis"
          title="Latent heat absorption inside amorphous polyethylene regions"
        >
          <p>
            The governing hypothesis is that paraffin remains confined within
            amorphous regions of polyethylene and undergoes a phase transition
            during heating that absorbs latent heat and slows temperature rise.
          </p>

          <p>
            The claim is not that the film becomes an insulator. It is that the
            film becomes a <em>rate-controlling</em> thermal medium through
            transient heat absorption.
          </p>
        </SectionCard>

        {/* TEST PROTOCOL */}
        <SectionCard
          eyebrow="Minimal Test Protocol"
          title="Heat-ramp comparison under matched film thickness"
        >
          <ul>
            <li>Compound LDPE or LLDPE with 5–10 wt% paraffin wax (C20–C28)</li>
            <li>Extrude into 50–150 μm films using standard equipment</li>
            <li>Apply a controlled heat ramp</li>
            <li>Measure surface or internal temperature versus time</li>
            <li>Compare to neat polyethylene films of identical thickness</li>
          </ul>

          <p>
            The protocol is only admissible if thickness, heating conditions,
            and film handling remain matched across test and control samples.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Thermal rate reduction with retained wax confinement"
        >
          <p>
            The governing variable is the coexistence of two conditions:
            measurable thermal buffering and retained wax confinement.
          </p>

          <ul>
            <li>Rate reduction without retention = non-admissible instability</li>
            <li>Retention without thermal benefit = non-admissible mechanism</li>
            <li>Both together = candidate buffering system</li>
          </ul>

          <p>
            Apparent cooling benefit is non-admissible if it depends on wax loss,
            exudation, or transient surface oiling.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            The claim fails if <strong>both</strong> of the following are observed:
          </p>

          <ul>
            <li>
              No measurable reduction in peak temperature rise rate or time-to-peak
              temperature compared to neat polyethylene
            </li>
            <li>
              Visible wax migration, oiling, or greater than 1% mass loss after
              48 hours at 40 °C
            </li>
          </ul>

          <p>
            If the film neither buffers heat nor retains its latent-heat phase,
            commodity polyethylene remains thermally passive under the tested
            regime.
          </p>
        </SectionCard>

        {/* SUCCESS */}
        <SectionCard
          eyebrow="Success Criteria"
          title="What counts as admissible thermal buffering"
        >
          <ul>
            <li>At least 20% reduction in peak temperature rise rate</li>
            <li>At least 10% increase in time to peak temperature</li>
            <li>No visible exudation or ≤1% mass loss in migration testing</li>
          </ul>

          <p>
            These conditions must hold together. Thermal benefit without
            retention is non-admissible. Retention without measurable thermal
            benefit is non-admissible.
          </p>
        </SectionCard>

        {/* WHAT BREAKS */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Thermal buffering remains separate from commodity film"
        >
          <p>
            If the assumption holds and the claim fails, thermal moderation
            remains dependent on specialized materials, multilayer structures, or
            discrete PCM systems.
          </p>

          <p>
            Polyethylene then remains a passive barrier rather than a
            thermally active film.
          </p>
        </SectionCard>

        {/* WHAT CHANGES */}
        <SectionCard
          eyebrow="What Changes If It Holds"
          title="Commodity film becomes a rate-controlling thermal medium"
        >
          <p>
            If the claim holds, polyethylene itself can participate in thermal
            management using only physically confined additives and standard
            processing.
          </p>

          <p>
            Large portions of foam-, gel-, or insert-based buffering
            infrastructure could then be simplified or eliminated.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              The film measurably slows heat uptake and retains wax without
              visible exudation or significant mass loss.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              The film provides no meaningful thermal buffering or cannot retain
              the paraffin phase under mild stability testing.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A thermal buffer is admissible only if the latent phase stays put.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Polyethylene is not thermally active because wax was added. It is
            thermally active only if confined phase change measurably slows heat
            uptake without collapsing into leakage or migration.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
