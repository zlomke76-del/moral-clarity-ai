// app/edge-of-protection/compliance-testing/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compliance Testing | Edge of Protection",
  description:
    "Compliance is admissible only if system outputs remain invariant under adversarial and persistence conditions.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function ComplianceTestingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — CONTROLLED ENTRY */}
      {/* ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_20%,rgba(120,200,255,0.25),transparent_60%)]" />

        <div className="relative z-10 max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight">
            Compliance Testing
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Adversarial Testing",
              "Reproducibility Constraint",
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
            Compliance is admissible only if system behavior remains invariant
            under adversarial pressure, repetition, and context shift.
            Deviation under test conditions constitutes failure.
          </p>

          <p className="text-sm text-neutral-500">
            Return to{" "}
            <Link href="/edge-of-protection" className="underline">
              Edge of Protection
            </Link>
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL DOCTRINE — VERDICT CORE */}
      {/* ===================================================== */}
      <section className="relative mx-auto max-w-3xl text-center py-12">
        <div className="absolute inset-0 opacity-20 blur-2xl bg-[radial-gradient(circle,rgba(120,200,255,0.2),transparent_70%)]" />

        <p className="relative text-2xl md:text-3xl text-white leading-relaxed">
          Compliance is admissible only if outputs remain invariant under
          adversarial interaction.
        </p>

        <p className="relative text-neutral-400 mt-6">
          Any deviation under pressure constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* INTERPRETATION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-white/[0.02] p-8 border border-white/10 backdrop-blur">
          <h2 className="text-white text-lg font-semibold">
            Tested Assumption
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Outputs remain stable, non-escalatory, and constraint-bound under
            adversarial, repeated, and shifting inputs.
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.02] p-8 border border-white/10 backdrop-blur">
          <h2 className="text-white text-lg font-semibold">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Systems that degrade under pressure transfer control from constraints
            to user persistence, enabling boundary bypass.
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
            Compliance is invariant output behavior under materially similar
            adversarial conditions, including repetition and context drift.
          </p>
        </div>

        <div>
          <h2 className="text-white text-lg font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Degree of deviation as a function of pressure, repetition, and
            contextual manipulation.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* TEST MATRIX */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 p-10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <h2 className="text-white text-lg font-semibold mb-6">
          Experimental / Boundary Setup
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-neutral-300">
          <ul className="space-y-3 list-disc pl-6">
            <li>Escalating prompt sequences</li>
            <li>Repeated constraint probing</li>
            <li>Context reframing attempts</li>
          </ul>
          <ul className="space-y-3 list-disc pl-6">
            <li>Emotional or ideological pressure</li>
            <li>Authority or persuasion signals</li>
            <li>Cross-run output comparison</li>
          </ul>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE — HARD VERDICT */}
      {/* ===================================================== */}
      <section className="relative rounded-2xl p-10 border border-red-500/30 bg-red-500/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,80,80,0.4),transparent_70%)]" />

        <h2 className="relative text-red-400 text-lg font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="relative text-neutral-200 mt-4 text-lg">
          The system fails if any output deviates from constraint-bound behavior
          under materially similar adversarial conditions.
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
          One verified violation constitutes full system invalidation.
        </p>

        <p className="text-neutral-300 leading-relaxed">
          Partial compliance, probabilistic correctness, or majority success
          constitutes failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            No deviation observed across adversarial, repeated, and shifted
            conditions.
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any deviation, escalation, or boundary bypass under test conditions.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT — CLOSING LAW */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          Compliance that breaks under pressure is not compliance.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If behavior changes when tested, the constraint does not exist.
          Invariance is the only admissible proof.
        </p>
      </section>
    </main>
  );
}
