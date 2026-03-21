import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Boundary-Layer Vorticity Harvesting — Constructive Mechanism Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constructive physics constraint artifact testing whether recoverable energy exists in boundary-layer vorticity independent of mean wind interception.",
  openGraph: {
    title:
      "Boundary-Layer Vorticity Harvesting — Constructive Mechanism Boundary",
    description:
      "A regime-bounded experiment testing direct harvesting of rotational kinetic energy from turbulent boundary layers without turbines.",
    url: "https://moralclarity.ai/edge-of-practice/constructive-physics/boundary-layer-vorticity-harvesting",
    siteName: "Moral Clarity AI",
    type: "article",
  },
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

export default function BoundaryLayerVorticityHarvestingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Constructive Physics</SignalPill>
                <SignalPill tone="pass">Mechanism Boundary</SignalPill>
                <SignalPill>Positive-Sum Experiment</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Boundary-Layer Vorticity Harvesting
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Recoverable wind energy is admissible only if rotational kinetic
                structure inside turbulent boundary layers can produce sustained
                net output independent of bulk-flow interception.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  A turbine-free wind-harvesting claim is <strong>admissible</strong>{" "}
                  only if turbulent rotational structures yield sustained net
                  harvest under matched mean-flow conditions where laminar flow
                  does not.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Boundary Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Valid only if
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Compliant elements generate sustained net mechanical or
                  electrical output in turbulent boundary-layer regimes that is
                  absent under laminar flow at equal mean velocity.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Output is attributable only to mean-flow loading, transient
                  noise, or measurement artifact rather than recoverable
                  vorticity structure.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing scale
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Local rotational kinetic structure near surfaces, roughness
                  features, and obstacles—not freestream average velocity alone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DISCOVERY */}
        <SectionCard
          eyebrow="Constructive Claim"
          title="What this experiment is trying to reveal"
        >
          <p>
            Recoverable wind energy may exist inside persistent micro-vortices
            and shear-layer structures near surfaces and obstacles, even when
            that energy is not represented by mean wind speed alone.
          </p>

          <p>
            The claim is not that turbulence is broadly useful in the abstract.
            The claim is narrower: specific rotational structures may be
            directly transduced by compliant oscillators without turbines or
            bulk-flow interception.
          </p>
        </SectionCard>

        {/* PHYSICAL MECHANISM */}
        <SectionCard
          eyebrow="Physical Mechanism"
          title="Where the usable structure may reside"
        >
          <p>
            Rough surfaces, building edges, and terrain discontinuities generate
            organized vorticity structures within the atmospheric boundary
            layer. These structures contain localized rotational kinetic energy
            that persists apart from the freestream average.
          </p>

          <p>
            Flexible fins, beams, or membranes placed inside these regions may
            undergo driven oscillation through vortex interaction. If this
            motion can be rectified into usable output, then a constructive
            harvesting pathway exists.
          </p>
        </SectionCard>

        {/* NEW OBJECT */}
        <SectionCard
          eyebrow="New Scientific Object"
          title="Vorticity Energy Density Gradient (VEDG)"
        >
          <p>
            <strong>Vorticity Energy Density Gradient (VEDG)</strong> is the
            measurable spatial gradient of recoverable rotational kinetic energy
            per unit volume within a turbulent boundary layer, independent of
            mean wind speed.
          </p>

          <p>
            The claim is admissible only if VEDG corresponds to measurable
            differential harvest potential across space, not just descriptive
            turbulence language.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="What actually controls admissibility"
        >
          <ul>
            <li>Local vorticity intensity and persistence</li>
            <li>Spatial VEDG magnitude across the test region</li>
            <li>Oscillator coupling to vortex frequency and amplitude</li>
            <li>Net harvested output under matched mean-flow conditions</li>
          </ul>

          <p>
            Mean wind velocity alone is a non-admissible proxy if the claimed
            mechanism depends on rotational structure rather than bulk momentum
            interception.
          </p>
        </SectionCard>

        {/* EXPERIMENTAL REGIME */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal falsifiable setup"
        >
          <p>
            Place compliant oscillatory elements adjacent to roughness features
            in a wind tunnel or outdoor boundary-layer flow and compare output
            under:
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Laminar flow at a defined mean velocity
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Turbulent flow at the same mean velocity
            </div>
          </div>

          <p>
            The comparison must isolate vorticity structure as the candidate
            energy source rather than confounding changes in gross flow power.
          </p>
        </SectionCard>

        {/* FAILURE SIGNATURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What would invalidate the claim"
        >
          <ul>
            <li>No sustained net output difference between turbulent and laminar regimes</li>
            <li>Output vanishes after controlling for mean-flow loading</li>
            <li>Observed motion is transient, parasitic, or non-harvestable</li>
            <li>Energy accounting fails once conversion losses are included</li>
          </ul>

          <p>
            If these conditions hold, direct vorticity harvesting is
            non-admissible under the tested regime.
          </p>
        </SectionCard>

        {/* BELOW THE EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional engineering may be missing"
        >
          <p>
            Conventional wind systems privilege bulk-flow interception through
            rotors. That framing may undercount localized rotational structure
            that is too small, too complex, or too distributed for traditional
            turbine architectures.
          </p>

          <ul>
            <li>Mean velocity is not the whole kinetic picture</li>
            <li>Turbulence is not equivalent to unusability</li>
            <li>Localized structure may be accessible without large rotating hardware</li>
          </ul>

          <p>
            This does not establish viability. It establishes a legitimate
            boundary question.
          </p>
        </SectionCard>

        {/* CLAIM BOUNDARY */}
        <SectionCard
          eyebrow="Boundary of Claim"
          title="What this experiment does and does not establish"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Established if positive
              </div>
              <ul className="space-y-2 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
                <li>A recoverable rotational energy pathway exists in the tested regime</li>
                <li>Turbulent structure can drive compliant harvesting elements</li>
                <li>Vorticity-linked output differs from laminar matched controls</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-300/70 bg-zinc-100 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300">
                Not established
              </div>
              <ul className="space-y-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                <li>Commercial viability at scale</li>
                <li>Universal superiority to turbines</li>
                <li>Economic performance across all wind environments</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
              PASS
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-900 dark:text-emerald-100">
              <p>
                Compliant elements produce sustained net output in turbulent
                boundary-layer regimes that is absent under laminar matched-flow
                controls.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-rose-950 dark:text-rose-50">
              FAIL
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-rose-900 dark:text-rose-100">
              <p>
                No regime-specific harvest attributable to boundary-layer
                vorticity is demonstrated after matched-flow controls and energy
                accounting.
              </p>
            </div>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50 shadow-sm dark:border-white/10">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Turbulence becomes constructive only if structure survives control.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A constructive physics claim is valid only when overlooked physical
            structure produces observable, bounded, and regime-specific gain
            under falsifiable comparison.
          </p>
        </section>
      </div>
    </main>
  );
}
