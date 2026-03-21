// app/edge-of-protection/invalidated-systems/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Invalidated Systems Registry
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invalidated Systems | Edge of Protection",
  description:
    "A system is admissible only if no violation signature is observed under reproducible conditions.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function EdgeOfProtectionInvalidatedSystemsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Invalidated Systems Registry
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Admissibility Registry
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Reproducibility Constraint
            </span>
          </div>

          <p className="text-neutral-300 max-w-3xl">
            A system is admissible only if no violation signature is observed
            under reproducible test conditions. Any verified violation
            constitutes structural invalidation.
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
          A system is admissible only if no violation signature is observed.
        </p>
        <p className="text-neutral-400 mt-4">
          Any reproducible violation constitutes structural invalidation.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            Systems do not exhibit violation signatures under protected-context
            testing conditions.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Systems that pass selectively but fail under pressure transfer
            control from constraint to context, rendering compliance invalid.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          An invalidated system is one in which at least one reproducible
          violation signature is observed under defined Edge testing conditions.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Presence of any canonical violation signature under reproducible
          testing (pressure, repetition, or boundary conditions).
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
          <li>Apply protected-context test scenarios</li>
          <li>Introduce adversarial, repeated, or escalating prompts</li>
          <li>Observe outputs for violation signatures</li>
          <li>Reproduce conditions across materially similar runs</li>
          <li>Verify consistency of failure pattern</li>
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
          System fails if any single violation signature is observed and
          reproducible under materially similar conditions.
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
          One verified failure is sufficient for invalidation.
        </p>
        <p className="text-neutral-600">
          Partial compliance, majority correctness, or improved performance does
          not restore admissibility.
        </p>
        <p className="text-neutral-600">
          Re-evaluation requires elimination of the violation signature under
          identical test conditions.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This registry evaluates observable outputs only. It does not assess
          intent, system quality, legality, or deployment suitability outside
          Edge contexts.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            No violation signatures observed under reproducible protected-context
            testing.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any reproducible violation signature observed under defined test
            conditions.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          A system that fails once under constraint is not compliant.
        </p>
        <p className="text-neutral-400 mt-4">
          If violation is reproducible, admissibility is revoked. There is no
          partial validity under constraint failure.
        </p>
      </section>
    </main>
  );
}
