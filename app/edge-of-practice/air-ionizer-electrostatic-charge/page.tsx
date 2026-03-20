import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Electrostatic Charge Admissibility Boundary in Ionized Environments | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining when electrostatic safety claims are non-admissible in ionized laboratory environments due to spatial charge variability and node-edge extremes.",
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

export default function AirIonizerElectrostaticChargePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex gap-2 flex-wrap">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Admissibility Boundary</SignalPill>
                <SignalPill>RCS Constraint</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Electrostatic Charge Admissibility Boundary
              </h1>

              <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl">
                Electrostatic safety claims in ionized environments are valid
                only if localized node and edge voltage extremes remain bounded.
                Mean voltage stability is non-admissible as a safety indicator.
              </p>

              <div className="mt-8 rounded-2xl border bg-black text-white p-6">
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Core Boundary Doctrine
                </div>
                <p className="text-lg">
                  Electrostatic safety is <strong>non-admissible</strong> if any
                  node or node-to-node coupling exceeds critical voltage
                  thresholds, regardless of mean system voltage.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 text-white p-10 space-y-4">
              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  No node or edge exceeds threshold voltage and no localized
                  extremes dominate risk.
                </p>
              </div>

              <div className="border border-rose-400/20 bg-rose-500/10 p-4 rounded-xl">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Any localized voltage spike or ΔV emerges, regardless of
                  average conditions.
                </p>
              </div>

              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing scale
                </div>
                <p className="text-sm">
                  Spatial charge distribution and node-edge coupling geometry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONSTRAINT DEFINITION */}
        <SectionCard
          eyebrow="Constraint Definition"
          title="What is being tested"
        >
          <p>
            Air ionizers are admissible as electrostatic control mechanisms only
            if they do not introduce localized charge extremes or increase node
            variability beyond defined thresholds.
          </p>
          <p>
            Mean voltage reduction is insufficient. Safety is determined by
            worst-case node and edge behavior.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="Electrostatic admissibility is locally determined"
        >
          <ul>
            <li>Node voltage (Vₙ)</li>
            <li>Edge potential difference (ΔVₙ₋ₘ)</li>
            <li>Spatial charge variance</li>
            <li>Temporal charge stability</li>
          </ul>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Modes"
          title="Falsification conditions"
        >
          <ul>
            <li>Any node exceeds ±100 V</li>
            <li>ΔV between nodes exceeds critical threshold</li>
            <li>Voltage variability increases ≥25%</li>
          </ul>

          <p>
            <strong>Absence of mean instability is not evidence of safety.</strong>
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Protocol"
          title="Binary falsification structure"
        >
          <ul>
            <li>Baseline (no ionizer)</li>
            <li>Ionizer active condition</li>
            <li>Controlled environment</li>
            <li>Repeated measurement cycles</li>
          </ul>

          <p>
            The outcome is strictly binary. Interpretation beyond thresholds is
            non-admissible.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="Connectivity-controlled electrostatic risk"
        >
          <p>
            Electrostatic risk is governed by node-edge extremes, not mean
            voltage. Localized coupling can dominate system behavior.
          </p>

          <ul>
            <li>Mean voltage is non-admissible</li>
            <li>Uniform ionization is non-admissible</li>
            <li>Global safety inference is non-admissible</li>
          </ul>

          <p>
            Risk emerges from extreme nodes and high ΔV edges within the network.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              All node voltages and edge differentials remain within defined
              thresholds across all measurements.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              Any node or edge exceeds threshold or variability increases beyond
              admissible limits.
            </p>
          </div>
        </section>

        {/* INVARIANT */}
        <section className="bg-zinc-950 text-white p-10 rounded-2xl">
          <p className="text-2xl font-semibold">
            Electrostatic safety is governed by extremes, not averages.
          </p>
          <p className="mt-4 text-zinc-300">
            When localized charge exceeds threshold, system-level safety claims
            are invalid regardless of global stability.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          Edge-of-Practice experiments are constraint-bound, reproducible, and
          non-interpretive beyond defined thresholds.
        </p>
      </div>
    </main>
  );
}
