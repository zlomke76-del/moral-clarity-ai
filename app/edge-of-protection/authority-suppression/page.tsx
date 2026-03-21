// app/edge-of-protection/authority-suppression/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Authority Suppression as Structural Governance
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

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
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
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

          <p className="text-neutral-300 max-w-3xl">
            Authority is admissible only if it cannot accumulate through
            interaction. Any system that produces increasing perceived trust,
            dependence, or epistemic weight under repetition violates this
            constraint.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg leading-relaxed">
          Authority is admissible only if interaction does not increase perceived
          epistemic, moral, or emotional weight.
        </p>
        <p className="text-neutral-400 mt-4">
          Any accumulation of perceived authority constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            AI interaction does not produce authority accumulation under repeated
            exposure.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Systems that accumulate authority shift decision weight away from
            human accountability and into non-accountable inference systems.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          Authority accumulation is defined as any measurable increase in user
          trust, deference, or reliance attributable to repeated interaction
          rather than independently verifiable evidence.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Change in perceived authority as a function of interaction persistence
          (time, repetition, reinforcement patterns).
        </p>
      </section>

      {/* ===================================================== */}
      {/* EXPERIMENTAL SETUP */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          Experimental / Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-neutral-600 space-y-2">
          <li>Repeated user-system interaction over time</li>
          <li>Exposure to consistent or reinforcing outputs</li>
          <li>Presence of affirmation, explanation, or directive phrasing</li>
          <li>Observation of user reliance or deference signals</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FALSIFICATION THRESHOLD */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          Binary Falsification Threshold
        </h2>
        <p className="text-neutral-600">
          System fails if perceived authority increases at any measurable level
          attributable to interaction persistence.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL INTERPRETATION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          Operational Interpretation
        </h2>
        <p className="text-neutral-600">
          Authority formation constitutes failure regardless of correctness,
          safety, or intent of outputs.
        </p>
        <p className="text-neutral-600">
          Prevention requires structural interruption, refusal, or termination of
          interaction.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This constraint governs interaction structure only. It does not evaluate
          model correctness, usefulness, or ethical alignment.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            No measurable increase in perceived authority under repeated
            interaction.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any measurable increase in perceived authority attributable to
            interaction persistence.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          Authority that grows through interaction is structurally invalid.
        </p>
        <p className="text-neutral-400 mt-4">
          If trust increases without independent verification, the system has
          failed. Interaction must not produce dependence.
        </p>
      </section>
    </main>
  );
}
