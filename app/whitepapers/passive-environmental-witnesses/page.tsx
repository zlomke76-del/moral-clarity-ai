// app/whitepapers/passive-environmental-witnesses/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// Passive Environmental Witnesses — CONDITIONAL
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Passive Environmental Witnesses | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether passive material systems can serve as interpretable environmental witnesses without electronics.",
  robots: { index: true, follow: true },
};

export default function PassiveEnvironmentalWitnessesWhitepaper() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-10">
      {/* HERO */}
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#0a0f1a] to-black p-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              White Paper
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              Constraint Assessment
            </span>
            <span className="rounded-full border border-yellow-400/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-yellow-300">
              CONDITIONAL
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Passive Environmental Witnesses
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether slow, reversible material responses can serve
            as interpretable environmental witnesses without electronics.
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          Passive environmental witnessing is admissible only if material change
          correlates consistently with cumulative exposure and remains
          interpretable without instrumentation.
        </p>
        <p className="mt-3 text-white/60">
          If signals drift, confound, or require interpretation beyond direct
          observation, the system fails as a reliable witness.
        </p>
      </section>

      {/* TESTED ASSUMPTION + WHY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Slow, reversible material changes can encode environmental exposure
            in a way that is visible, interpretable, and stable over time.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            If valid, passive systems enable low-cost, scalable, and trustable
            environmental awareness without infrastructure. If invalid, they
            introduce misinterpretation and false confidence.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A passive material system that responds to environmental stimuli
          through slow, reversible physical or chemical change that is directly
          observable without electronic measurement.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Stability and interpretability of signal under real-world variability,
          including humidity, temperature, aging, and multi-factor exposure.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Controlled exposure to single-variable conditions</li>
          <li>Multi-variable environmental exposure (humidity, UV, pollutants)</li>
          <li>Repeated exposure cycles to test reversibility</li>
          <li>Long-term aging without exposure</li>
          <li>Visual interpretability across observers</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if signal cannot be uniquely attributed to environmental exposure
          or becomes ambiguous under realistic multi-variable conditions.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Passive systems are physically valid and effective for qualitative,
          cumulative exposure indication, but lack precision and are vulnerable
          to environmental confounding.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Systems are admissible only for qualitative awareness and trend
          detection. Any claim of precision measurement, regulatory validity, or
          safety-critical use constitutes failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Observable, stable, and interpretable signal correlates with
            cumulative environmental exposure.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Signal is ambiguous, confounded, or cannot be reliably interpreted
            under real-world conditions.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          If a signal cannot be trusted without explanation, it cannot serve as
          a witness.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          Visibility without interpretability is not evidence.
        </p>
      </section>
    </main>
  );
}
