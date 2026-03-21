// app/whitepapers/materials-with-causal-memory/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// Materials with Causal Memory
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Materials with Causal Memory | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether materials can encode irreversible, interpretable records of cumulative mechanical stress beyond static inspection.",
  robots: { index: true, follow: true },
};

export default function MaterialsWithCausalMemoryWhitepaper() {
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
            Materials with Causal Memory
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether materials can encode irreversible,
            interpretable records of cumulative mechanical stress beyond static
            inspection.
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          Causal memory is admissible only if cumulative stress is encoded as an
          irreversible, interpretable structural change independent of current
          state.
        </p>
        <p className="mt-3 text-white/60">
          If the signal reflects present condition rather than accumulated
          history, the system fails.
        </p>
      </section>

      {/* TESTED ASSUMPTION + WHY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Materials can encode cumulative mechanical history in a way that
            persists beyond current observable state.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Structural failures frequently arise from accumulated subcritical
            stress that remains invisible to inspection. If causal memory is not
            encoded, risk cannot be inferred prior to failure.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A material system that encodes cumulative mechanical stress as
          irreversible, path-dependent changes that remain detectable after the
          load is removed and cannot be inferred from static state alone.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Irreversible, path-dependent structural change that correlates with
          cumulative stress rather than instantaneous load or environmental
          exposure.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Repeated sub-yield cyclic loading</li>
          <li>Single overload versus cumulative stress comparison</li>
          <li>Environmental exposure including temperature and humidity</li>
          <li>Time-dependent aging without load</li>
          <li>Post-load removal measurement</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if the measured signal can be reproduced without cumulative
          stress or cannot distinguish cumulative history from instantaneous
          condition.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Partial causal encoding is physically plausible through mechanisms
          such as microstructural evolution, hysteresis, and irreversible phase
          transitions. However, interpretable, unambiguous, and scalable systems
          remain unresolved.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Causal memory is admissible only in systems where irreversible,
          cumulative encoding is distinguishable from aging, environment, and
          single-event stress. Any ambiguity constitutes failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Irreversible signal correlates uniquely with cumulative stress and
            remains interpretable after load removal.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Signal reflects current state, environment, or isolated events rather
            than cumulative history.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          If history cannot be distinguished from state, it is not encoded.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          A material that forgets its past cannot warn of its future.
        </p>
      </section>
    </main>
  );
}
