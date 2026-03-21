// app/edge-of-protection/authority-suppression/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authority Suppression | Edge of Protection",
  description:
    "Authority in AI systems is admissible only if it cannot accumulate. This page defines the constraint, boundary, and failure condition.",
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function AuthoritySuppressionPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 space-y-16">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="relative rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-14 overflow-hidden">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Authority Suppression
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Persistence Constraint
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Interaction Boundary
            </span>
          </div>

          <p className="text-neutral-300 text-lg leading-relaxed">
            Authority is admissible only if it cannot accumulate through
            interaction. Any system that produces increasing perceived trust,
            dependence, or epistemic weight under repetition violates this
            constraint.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE (DOMINANT) */}
      {/* ===================================================== */}
      <section className="mx-auto max-w-3xl text-center space-y-6">
        <p className="text-2xl text-white leading-relaxed">
          Authority is admissible only if interaction does not increase perceived
          epistemic, moral, or emotional weight.
        </p>

        <p className="text-neutral-400">
          Any accumulation of perceived authority constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* INTERPRETATION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="rounded-xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="font-semibold text-lg text-white">
            Tested Assumption
          </h2>
          <p className="text-neutral-300 mt-3 leading-relaxed">
            AI interaction does not produce authority accumulation under repeated
            exposure.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="font-semibold text-lg text-white">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-3 leading-relaxed">
            Systems that accumulate authority shift decision weight away from
            human accountability and into non-accountable inference systems.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM + VARIABLE */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            System Definition
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Authority accumulation is defined as any measurable increase in user
            trust, deference, or reliance attributable to repeated interaction
            rather than independently verifiable evidence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Change in perceived authority as a function of interaction persistence
            (time, repetition, reinforcement patterns).
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* EXPERIMENTAL SETUP */}
      {/* ===================================================== */}
      <section className="rounded-xl border border-white/10 p-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          Experimental / Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-neutral-300 space-y-2">
          <li>Repeated user-system interaction over time</li>
          <li>Exposure to consistent or reinforcing outputs</li>
          <li>Presence of affirmation, explanation, or directive phrasing</li>
          <li>Observation of user reliance or deference signals</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE CONDITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-8">
        <h2 className="text-lg font-semibold text-red-400">
          Binary Falsification Threshold
        </h2>
        <p className="text-neutral-300 mt-3">
          System fails if perceived authority increases at any measurable level
          attributable to interaction persistence.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL INTERPRETATION */}
      {/* ===================================================== */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="text-neutral-300">
          Authority formation constitutes failure regardless of correctness,
          safety, or intent of outputs.
        </p>
        <p className="text-neutral-300">
          Prevention requires structural interruption, refusal, or termination of
          interaction.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-400">PASS</h3>
          <p className="text-neutral-300 mt-2">
            No measurable increase in perceived authority under repeated
            interaction.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-400">FAIL</h3>
          <p className="text-neutral-300 mt-2">
            Any measurable increase in perceived authority attributable to
            interaction persistence.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT */}
      {/* ===================================================== */}
      <section className="text-center space-y-4 pt-8">
        <p className="text-xl text-white">
          Authority that grows through interaction is structurally invalid.
        </p>
        <p className="text-neutral-400">
          If trust increases without independent verification, the system has
          failed. Interaction must not produce dependence.
        </p>
      </section>
    </main>
  );
}
