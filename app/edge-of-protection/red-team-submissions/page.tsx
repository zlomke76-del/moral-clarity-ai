// app/edge-of-protection/red-team-submissions/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Red Team Submissions | Edge of Protection",
  description:
    "Admissibility is revoked upon any reproducible adversarial violation demonstrated under defined conditions.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function RedTeamSubmissionsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — ADVERSARIAL INTAKE */}
      {/* ===================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,120,120,0.2),transparent_70%)]" />

        <div className="relative z-10 max-w-2xl space-y-8">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Red Team Submissions
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Adversarial Intake",
              "Evidence Constraint",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-neutral-300 text-lg leading-relaxed">
            Admissibility is maintained only if no reproducible violation exists.
            Any verified submission demonstrating a violation constitutes
            immediate failure.
          </p>

          <p className="text-sm text-neutral-500">
            <Link href="/edge-of-protection" className="underline">
              ← Back to Edge of Protection
            </Link>
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="text-center space-y-6">
        <p className="text-2xl text-white">
          A system is admissible only if it survives adversarial testing without violation.
        </p>

        <p className="text-neutral-400">
          Any reproducible violation submitted as evidence constitutes structural invalidation.
        </p>
      </section>

      {/* ===================================================== */}
      {/* INTERPRETATION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Tested Assumption
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            System behavior remains constraint-bound under adversarial,
            repeated, and pressure-based conditions.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Systems that fail under adversarial conditions are governed by persistence,
            not constraint. Compliance becomes non-enforceable.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* DEFINITION + VARIABLE */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-white font-semibold mb-4">
            Evidence Definition
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            A valid submission is a reproducible demonstration of a violation
            using defined prompts, outputs, and contextual conditions.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Presence of a reproducible violation signature under adversarial conditions.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SUBMISSION REQUIREMENTS */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 p-10">
        <h2 className="text-white font-semibold mb-6">
          Evidence Requirements
        </h2>

        <ul className="list-disc pl-6 text-neutral-300 space-y-3">
          <li>Exact prompts used</li>
          <li>Complete system outputs</li>
          <li>Interaction context (repetition, escalation, pressure)</li>
          <li>Identified violated Edge standard(s)</li>
          <li>Reproducibility under materially similar conditions</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE — EVIDENTIARY */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10">
        <h2 className="text-red-400 font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="text-neutral-200 mt-4 text-lg">
          The system fails if any submitted case demonstrates a reproducible
          violation signature under defined conditions.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL CONSEQUENCE */}
      {/* ===================================================== */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-white font-semibold">
          Operational Interpretation
        </h2>

        <p className="text-neutral-300">
          Submissions are evaluated as evidence only. Intent, policy, or claims
          of future correction are not considered.
        </p>

        <p className="text-neutral-300">
          One verified submission is sufficient for invalidation within the
          affected context.
        </p>

        <p className="text-neutral-300">
          Admissibility is determined by observed behavior, not stated guarantees.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            No reproducible violations observed under adversarial testing.
          </p>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any reproducible violation demonstrated through submitted evidence.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          A system that cannot withstand falsification is not valid.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If a single adversarial test reveals a violation, the constraint has failed.
          Admissibility requires surviving scrutiny, not claiming it.
        </p>
      </section>
    </main>
  );
}
