import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Antibiotic Resistance Gene Admissibility Boundary in Surface Cleaning | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining when antibiotic resistance gene dynamics are non-admissible under mean-based cleanliness assumptions following non-antimicrobial cleaning.",
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

export default function AntibioticResistanceGeneCleaning() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex gap-2 flex-wrap">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Biological Constraint</SignalPill>
                <SignalPill>RCS Boundary</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Antibiotic Resistance Gene Admissibility Boundary
              </h1>

              <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl">
                Cleanliness claims are valid only if resistance gene abundance
                and connectivity remain stable under disturbance. Mean microbial
                reduction is non-admissible as a proxy for genetic risk.
              </p>

              <div className="mt-8 rounded-2xl border bg-black text-white p-6">
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Core Boundary Doctrine
                </div>
                <p className="text-lg">
                  Resistance gene stability is <strong>non-admissible</strong> if
                  any surface exhibits a ≥0.5 log shift or if connected genetic
                  reservoirs dominate post-cleaning composition.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 text-white p-10 space-y-4">
              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  ARG abundance remains stable and no connected fast-response
                  genetic network dominates.
                </p>
              </div>

              <div className="border border-rose-400/20 bg-rose-500/10 p-4 rounded-xl">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Any gene shifts ≥0.5 log or localized persistence networks
                  reweight system-level genetic composition.
                </p>
              </div>

              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing scale
                </div>
                <p className="text-sm">
                  Spatial genetic connectivity, not mean biomass reduction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONSTRAINT */}
        <SectionCard
          eyebrow="Constraint Definition"
          title="What is being tested"
        >
          <p>
            Non-antimicrobial cleaning is admissible only if it does not alter
            resistance gene abundance or enable dominance of connected ARG
            reservoirs.
          </p>

          <p>
            Clean appearance or reduced microbial load does not establish genetic
            stability.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="Genetic persistence is connectivity-driven"
        >
          <ul>
            <li>Normalized ARG abundance (gene / 16S)</li>
            <li>Log change Δ = log10(T1 / T0)</li>
            <li>Spatial correlation of ARG-bearing regions</li>
            <li>Presence of horizontal transfer markers (intI1)</li>
          </ul>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Modes"
          title="Falsification conditions"
        >
          <ul>
            <li>Any ARG or marker shifts ≥0.5 log</li>
            <li>Post-cleaning enrichment of ARG markers</li>
            <li>Dominance of fast-response genetic subsets</li>
          </ul>

          <p>
            <strong>Mean stability is not evidence of genetic neutrality.</strong>
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Protocol"
          title="Binary falsification design"
        >
          <ul>
            <li>Baseline vs post-cleaning sampling</li>
            <li>qPCR quantification (ARGs + intI1)</li>
            <li>Normalization to 16S</li>
            <li>Triplicate measurement and reproducibility requirement</li>
          </ul>

          <p>
            Outcome is strictly binary. Interpretation beyond thresholds is
            non-admissible.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="Connectivity-controlled persistence"
        >
          <p>
            Resistance gene persistence is governed by connected fast-response
            reservoirs, not average microbial reduction.
          </p>

          <ul>
            <li>Mean cleanliness is non-admissible</li>
            <li>Uniform response assumptions are non-admissible</li>
            <li>Load-based risk models are non-admissible</li>
          </ul>

          <p>
            When connected reservoirs survive, they dominate post-cleaning
            genetic outcomes regardless of total biomass reduction.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              No ARG shifts ≥0.5 log and no evidence of connected persistence
              dominating system behavior.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              Any ARG shift ≥0.5 log or emergence of dominant connected genetic
              reservoirs.
            </p>
          </div>
        </section>

        {/* INVARIANT */}
        <section className="bg-zinc-950 text-white p-10 rounded-2xl">
          <p className="text-2xl font-semibold">
            Genetic risk is governed by connectivity, not averages.
          </p>
          <p className="mt-4 text-zinc-300">
            When connected resistance reservoirs persist, they define system
            behavior regardless of total microbial reduction.
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
