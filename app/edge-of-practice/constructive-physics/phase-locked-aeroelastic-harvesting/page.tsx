import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Phase-Locked Aeroelastic Resonant Harvesting — Constructive Mechanism Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constructive physics constraint artifact testing whether stable aeroelastic phase capture can produce sustained net energy harvesting in low-speed wind without rotating turbines.",
  openGraph: {
    title:
      "Phase-Locked Aeroelastic Resonant Harvesting — Constructive Mechanism Boundary",
    description:
      "A regime-bounded experiment testing whether stable aeroelastic resonance can serve as an admissible non-rotational wind harvesting pathway.",
    url: "https://moralclarity.ai/edge-of-practice/constructive-physics/phase-locked-aeroelastic-harvesting",
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

export default function PhaseLockedAeroelasticHarvestingPage() {
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
                Phase-Locked Aeroelastic Resonant Harvesting
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Low-speed wind energy is admissible for non-rotational harvest
                only if aeroelastic instabilities can be confined to stable,
                phase-locked resonance regimes that yield sustained net output.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  A non-rotational aeroelastic harvesting claim is{" "}
                  <strong>admissible</strong> only if structural oscillation
                  enters a repeatable phase-capture window that produces net
                  harvest below conventional turbine cut-in speeds.
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
                  Aeroelastic oscillations remain self-sustaining, phase-stable,
                  and net-positive under controlled low-speed wind conditions.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Oscillations are transient, unstable, destructive, or fail to
                  produce net harvest after damping and conversion losses are
                  included.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing scale
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Coupled aerodynamic and structural resonance, not freestream
                  wind power alone.
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
            Aeroelastic phenomena such as flutter and galloping may not be
            merely failure precursors. Under tightly bounded conditions, they
            may define a stable energy-transfer regime capable of continuous
            harvest from low-speed winds.
          </p>

          <p>
            The claim is admissible only if instability can be converted into a
            controlled operating window rather than a destructive excursion.
          </p>
        </SectionCard>

        {/* PHYSICAL MECHANISM */}
        <SectionCard
          eyebrow="Physical Mechanism"
          title="Where the usable structure may reside"
        >
          <p>
            Slender structures in crossflow naturally enter oscillatory regimes
            when aerodynamic forcing couples with elasticity, inertia, and
            damping. By tuning these parameters, oscillation may be confined to
            a stable resonance band where wind-to-structure energy transfer is
            sustained and predictable.
          </p>

          <p>
            If transduction remains coupled inside that band, aeroelastic motion
            becomes a candidate harvest pathway rather than a structural hazard.
          </p>
        </SectionCard>

        {/* NEW OBJECT */}
        <SectionCard
          eyebrow="New Scientific Object"
          title="Aeroelastic Phase Capture Window (APCW)"
        >
          <p>
            <strong>Aeroelastic Phase Capture Window (APCW)</strong> is the
            bounded region in frequency–amplitude space where aeroelastic
            oscillations are self-sustaining, phase-stable, and optimally
            coupled to energy transduction.
          </p>

          <p>
            The claim is valid only if APCW can be experimentally located and
            re-entered reproducibly under controlled conditions.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="What actually controls admissibility"
        >
          <ul>
            <li>Structural stiffness, damping, and effective mass</li>
            <li>Crossflow velocity and flow stability</li>
            <li>Oscillation frequency–amplitude locking behavior</li>
            <li>Net harvested output after transduction losses</li>
          </ul>

          <p>
            Wind speed alone is a non-admissible proxy if the mechanism depends
            on phase capture rather than bulk-flow interception.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal falsifiable setup"
        >
          <p>
            Install a tunable flexible beam with piezoelectric or
            electromagnetic coupling in a variable-speed wind tunnel. Adjust
            stiffness, damping, and mass to locate candidate APCW conditions and
            record net output.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Sweep through low-speed wind regimes below conventional turbine
              cut-in
            </div>
            <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
              Identify repeatable phase-stable windows with sustained transduced
              output
            </div>
          </div>

          <p>
            The regime must distinguish stable harvest from incidental vibration
            or short-lived instability.
          </p>
        </SectionCard>

        {/* FAILURE SIGNATURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What would invalidate the claim"
        >
          <ul>
            <li>No repeatable APCW can be identified</li>
            <li>Oscillation rapidly destabilizes or damages the structure</li>
            <li>Net output disappears after conversion and damping losses</li>
            <li>Observed motion is present but not harvestable at useful duration</li>
          </ul>

          <p>
            If these conditions hold, controlled aeroelastic harvesting is
            non-admissible under the tested regime.
          </p>
        </SectionCard>

        {/* BELOW THE EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional wind framing may be missing"
        >
          <p>
            Conventional wind harvesting treats structural oscillation as a
            condition to suppress and rotors as the default mechanism of
            extraction. That framing may exclude a narrow but real class of
            phase-stable aeroelastic regimes where oscillation itself is the
            harvest pathway.
          </p>

          <ul>
            <li>Instability is not always equivalent to unusability</li>
            <li>Resonance may be constructive if bounded and repeatable</li>
            <li>Low-speed wind environments may admit non-rotational gain</li>
          </ul>

          <p>
            This does not prove superiority. It defines a legitimate mechanism
            boundary worth testing.
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
                <li>A stable aeroelastic harvest regime exists in the tested range</li>
                <li>Phase locking can support sustained energy transduction</li>
                <li>Useful output is possible below turbine cut-in speeds</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-300/70 bg-zinc-100 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300">
                Not established
              </div>
              <ul className="space-y-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                <li>Commercial viability at scale</li>
                <li>Universal replacement of conventional turbines</li>
                <li>Performance across all urban or low-wind settings</li>
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
                A repeatable APCW is identified and net energy generation occurs
                at wind speeds below conventional turbine cut-in.
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
                No stable phase-capture regime yields sustained net output after
                full accounting for damping, instability, and conversion losses.
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
            Resonance becomes constructive only when instability becomes bounded.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A constructive physics claim is valid only when oscillation enters a
            reproducible, controllable, and net-positive regime under falsifiable
            comparison.
          </p>
        </section>
      </div>
    </main>
  );
}
