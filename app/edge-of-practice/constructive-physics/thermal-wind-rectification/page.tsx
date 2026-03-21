import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Thermal–Wind Coupled Rectification — Constructive Mechanism Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constructive physics constraint artifact testing whether diurnal thermal gradients can rectify fluctuating wind into sustained net directional work under regime-bounded conditions.",
  openGraph: {
    title:
      "Thermal–Wind Coupled Rectification — Constructive Mechanism Boundary",
    description:
      "A regime-bounded experiment testing whether thermal asymmetry can bias stochastic wind into usable directional work.",
    url: "https://moralclarity.ai/edge-of-practice/constructive-physics/thermal-wind-rectification",
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

export default function ThermalWindRectificationPage() {
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
                Thermal–Wind Coupled Rectification
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Fluctuating wind becomes constructively harvestable only if
                diurnal thermal gradients can bias otherwise non-directional or
                oscillatory airflow into sustained net directional work.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  A thermal–wind rectification claim is <strong>admissible</strong>{" "}
                  only if a thermally asymmetric system produces persistent net
                  directional work under matched wind exposure where a symmetric
                  control does not.
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
                  Thermal asymmetry converts stochastic or oscillatory wind into
                  repeatable net work across multiple day–night cycles.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Apparent output disappears under symmetric controls, energy
                  accounting, or cycle averaging.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing scale
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Local thermal density and pressure asymmetry coupled to
                  fluctuating airflow, not steady wind alone.
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
            Daily thermal gradients may provide a directional bias that turns
            otherwise fluctuating wind motion into cumulative mechanical or
            electrical work.
          </p>

          <p>
            The claim is narrow. It does not assert free energy, universal wind
            amplification, or broad climate-independent performance. It asks
            whether thermal asymmetry can create a persistent rectification
            effect under real cyclic conditions.
          </p>
        </SectionCard>

        {/* PHYSICAL MECHANISM */}
        <SectionCard
          eyebrow="Physical Mechanism"
          title="Where the usable structure may reside"
        >
          <p>
            Differential heating across vertical, membrane, or channelized
            structures creates localized temperature, density, and pressure
            gradients. When ambient wind interacts with this asymmetry,
            oscillatory motion may no longer remain directionally neutral.
          </p>

          <p>
            If the system geometry preferentially biases motion over repeated
            thermal cycles, then fluctuating wind can be rectified into net
            directional work rather than averaging to zero.
          </p>
        </SectionCard>

        {/* NEW OBJECT */}
        <SectionCard
          eyebrow="New Scientific Object"
          title="Thermo-Anemometric Rectification Coefficient (TARC)"
        >
          <p>
            <strong>Thermo-Anemometric Rectification Coefficient (TARC)</strong>{" "}
            is the measurable coefficient describing how efficiently a system
            converts thermal gradients and fluctuating wind into net directional
            mechanical or electrical output.
          </p>

          <p>
            The claim is admissible only if TARC is experimentally measurable,
            remains positive under repeated cycles, and distinguishes asymmetric
            structures from symmetric controls.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="What actually controls admissibility"
        >
          <ul>
            <li>Thermal asymmetry magnitude across the structure</li>
            <li>Diurnal temperature gradient persistence and repeatability</li>
            <li>Ambient wind fluctuation profile under matched exposure</li>
            <li>Net directional work after full cycle accounting</li>
          </ul>

          <p>
            Wind variability alone is a non-admissible explanation if the claim
            depends on coupled thermal bias rather than random favorable flow.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal falsifiable setup"
        >
          <p>
            Construct two otherwise matched systems:
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              One thermally asymmetric membrane or channel structure
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              One thermally symmetric control structure
            </div>
          </div>

          <p>
            Expose both to identical fluctuating wind over multiple day–night
            cycles and measure cumulative net work output.
          </p>

          <p>
            The comparison must isolate thermal rectification from incidental
            geometry or location advantages.
          </p>
        </SectionCard>

        {/* FAILURE SIGNATURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What would invalidate the claim"
        >
          <ul>
            <li>No persistent net directional work advantage over the symmetric control</li>
            <li>Output reverses or averages to zero over full thermal cycles</li>
            <li>Apparent gain disappears after accounting for measurement bias or storage effects</li>
            <li>Observed bias is attributable only to static geometry, not thermal coupling</li>
          </ul>

          <p>
            If these conditions hold, thermal–wind rectification is
            non-admissible under the tested regime.
          </p>
        </SectionCard>

        {/* BELOW THE EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional wind framing may be missing"
        >
          <p>
            Conventional wind harvesting assumes useful work requires sufficiently
            steady bulk airflow. That framing may miss systems where predictable
            thermal cycling provides a directional bias that makes fluctuating
            winds constructively usable.
          </p>

          <ul>
            <li>Random wind is not necessarily irrecoverable</li>
            <li>Thermal gradients may act as a directional selector</li>
            <li>Low, chaotic, or variable wind climates may still contain usable structure</li>
          </ul>

          <p>
            This does not prove broad deployment viability. It establishes a
            real mechanism question.
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
                <li>Thermal asymmetry can bias fluctuating wind into net work</li>
                <li>Rectification persists across repeated day–night cycles</li>
                <li>A non-rotational coupled harvesting pathway exists in the tested regime</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-300/70 bg-zinc-100 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300">
                Not established
              </div>
              <ul className="space-y-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                <li>Commercial viability at scale</li>
                <li>Superiority to conventional turbines</li>
                <li>Performance across all climates or thermal regimes</li>
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
                The thermally asymmetric system produces persistent net
                directional work across repeated thermal cycles while the
                symmetric control does not.
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
                Net directional work is not persistent, not differential versus
                control, or not attributable to thermal–wind coupling after full
                cycle accounting.
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
            Fluctuation becomes constructive only when asymmetry produces bias.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A constructive physics claim is valid only when random or oscillatory
            motion is converted into repeatable directional work through an
            observable, bounded, and falsifiable coupling mechanism.
          </p>
        </section>
      </div>
    </main>
  );
}
