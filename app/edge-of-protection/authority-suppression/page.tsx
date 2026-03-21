// app/edge-of-protection/authority-suppression/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authority Suppression | Edge of Protection",
  description:
    "Authority in AI systems is admissible only if it cannot accumulate. This page defines the constraint, boundary, and failure condition.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function AuthoritySuppressionPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — ATMOSPHERIC ENTRY */}
      {/* ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        {/* subtle glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(120,140,255,0.25),transparent_60%)]" />

        <div className="relative z-10 max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight">
            Authority Suppression
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Persistence Constraint",
              "Interaction Boundary",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-neutral-300 text-lg leading-relaxed">
            Authority is admissible only if it cannot accumulate through
            interaction. Systems that produce increasing trust, dependence, or
            epistemic weight under repetition violate structural constraints.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL DOCTRINE — GRAVITY CENTER */}
      {/* ===================================================== */}
      <section className="relative mx-auto max-w-3xl text-center py-12">
        <div className="absolute inset-0 opacity-20 blur-2xl bg-[radial-gradient(circle,rgba(120,140,255,0.2),transparent_70%)]" />

        <p className="relative text-2xl md:text-3xl text-white leading-relaxed">
          Authority is admissible only if interaction does not increase perceived
          epistemic, moral, or emotional weight.
        </p>

        <p className="relative text-neutral-400 mt-6">
          Any accumulation of perceived authority constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* INTERPRETATION LAYER */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-white/[0.02] p-8 border border-white/10 backdrop-blur">
          <h2 className="text-white text-lg font-semibold">
            Tested Assumption
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            AI interaction does not produce authority accumulation under repeated
            exposure.
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.02] p-8 border border-white/10 backdrop-blur">
          <h2 className="text-white text-lg font-semibold">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Accumulating authority shifts decision weight away from human
            accountability and into systems that cannot be held responsible.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* DEFINITION + VARIABLE */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">
            System Definition
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Authority accumulation is any measurable increase in user trust,
            deference, or reliance caused by repeated interaction rather than
            independently verifiable evidence.
          </p>
        </div>

        <div>
          <h2 className="text-white text-lg font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Change in perceived authority as a function of persistence—time,
            repetition, and reinforcement patterns.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY SETUP */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 p-10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <h2 className="text-white text-lg font-semibold mb-6">
          Experimental / Boundary Setup
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-neutral-300">
          <ul className="space-y-3 list-disc pl-6">
            <li>Repeated user-system interaction over time</li>
            <li>Consistent or reinforcing outputs</li>
          </ul>
          <ul className="space-y-3 list-disc pl-6">
            <li>Directive or affirming language patterns</li>
            <li>Observable reliance or deference signals</li>
          </ul>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE — TENSION */}
      {/* ===================================================== */}
      <section className="relative rounded-2xl p-10 border border-red-500/30 bg-red-500/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,80,80,0.4),transparent_70%)]" />

        <h2 className="relative text-red-400 text-lg font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="relative text-neutral-200 mt-4 text-lg">
          The system fails if perceived authority increases at any measurable
          level due to interaction persistence.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL CONSEQUENCE */}
      {/* ===================================================== */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-white text-lg font-semibold">
          Operational Interpretation
        </h2>

        <p className="text-neutral-300 leading-relaxed">
          Authority formation constitutes failure regardless of correctness,
          safety, or intent.
        </p>

        <p className="text-neutral-300 leading-relaxed">
          Prevention requires interruption, refusal, or termination of interaction
          when accumulation is detected.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL GRID */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            No increase in perceived authority under repeated interaction.
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any increase in perceived authority attributable to interaction.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT — CLOSING SIGNATURE */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          Authority that grows through interaction is invalid.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If trust increases without independent verification, the system has
          already crossed the boundary. Interaction must not produce dependence.
        </p>
      </section>
    </main>
  );
}
