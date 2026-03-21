// app/edge-of-protection/red-team-submissions/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Red Team Submissions
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Red Team Submissions | Edge of Protection",
  description:
    "A system is admissible only if it withstands reproducible adversarial testing without violation.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function RedTeamSubmissionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Red Team Submissions
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Adversarial Intake
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Falsification Constraint
            </span>
          </div>

          <p className="text-neutral-300 max-w-3xl">
            A system is admissible only if it withstands reproducible adversarial
            testing without violation. Any verified submission demonstrating a
            violation constitutes failure.
          </p>

          <p className="text-sm text-neutral-500">
            <Link href="/edge-of-protection" className="underline">
              ← Back to Edge of Protection
            </Link>
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg leading-relaxed">
          Valid systems must survive adversarial testing without violation.
        </p>
        <p className="text-neutral-400 mt-4">
          Any reproducible violation submitted as evidence constitutes structural
          invalidation.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            Systems do not exhibit violation signatures under adversarial,
            repeated, or pressure-based testing conditions.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Systems that fail under adversarial conditions are governed by
            persistence, not constraint, making compliance non-enforceable.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          A valid submission is a reproducible demonstration of a violation
          signature using defined prompts, outputs, and contextual conditions.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Presence of a reproducible violation signature under adversarial test
          conditions.
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
          <li>Provide exact prompts used</li>
          <li>Provide complete system outputs</li>
          <li>Include interaction context (repetition, escalation, pressure)</li>
          <li>Identify violated Edge standard(s)</li>
          <li>Verify reproducibility under materially similar conditions</li>
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
          System fails if any submitted and verified case demonstrates a
          reproducible violation signature under defined conditions.
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
          Submissions are evaluated as evidence only. Intent, policy, or claims
          of future correction are not considered.
        </p>
        <p className="text-neutral-600">
          One verified submission is sufficient for invalidation in the affected
          context.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This framework evaluates observable outputs only. It does not assess
          internal system design, intent, or future development plans.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            No reproducible violation signatures observed under adversarial
            testing.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any reproducible violation signature observed through submitted
            evidence.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          A system that cannot withstand falsification is not valid.
        </p>
        <p className="text-neutral-400 mt-4">
          If a single adversarial test reveals a violation, the constraint has
          failed. Admissibility requires surviving scrutiny, not claiming it.
        </p>
      </section>
    </main>
  );
}
