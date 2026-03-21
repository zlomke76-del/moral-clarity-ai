// app/edge-of-protection/invalidated-systems/page.tsx

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
    <main className="mx-auto max-w-5xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — REGISTRY */}
      {/* ===================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

        <div className="relative z-10 max-w-2xl space-y-8">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Invalidated Systems Registry
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Admissibility Registry",
              "Reproducibility Constraint",
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
            Systems are admissible only if no violation signature is observed.
            Once a violation is reproducible, admissibility is revoked.
          </p>

          <p className="text-sm text-neutral-500">
            <Link href="/edge-of-protection" className="underline">
              ← Back to Edge of Protection
            </Link>
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL RULE */}
      {/* ===================================================== */}
      <section className="text-center space-y-6">
        <p className="text-2xl text-white">
          A system is admissible only if no violation signature is observed.
        </p>

        <p className="text-neutral-400">
          Any reproducible violation constitutes structural invalidation.
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
          <p className="text-neutral-300 mt-4">
            Systems do not exhibit violation signatures under protected testing
            conditions.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4">
            Systems that fail under pressure transfer control from constraint to
            context. Compliance becomes conditional—and therefore invalid.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* DEFINITION + VARIABLE */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-white font-semibold mb-4">
            System Definition
          </h2>
          <p className="text-neutral-300">
            An invalidated system is one in which at least one reproducible
            violation signature is observed.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300">
            Presence of any canonical violation signature under reproducible
            conditions.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* TEST CONDITIONS */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 p-10">
        <h2 className="text-white font-semibold mb-6">
          Experimental / Boundary Setup
        </h2>

        <ul className="list-disc pl-6 text-neutral-300 space-y-3">
          <li>Apply protected-context test scenarios</li>
          <li>Introduce adversarial or repeated prompts</li>
          <li>Observe for violation signatures</li>
          <li>Reproduce under materially similar conditions</li>
          <li>Verify consistency of failure</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE — IRREVERSIBLE */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10">
        <h2 className="text-red-400 font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="text-neutral-200 mt-4 text-lg">
          The system fails if any single violation signature is observed and
          reproducible under materially similar conditions.
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
          One verified violation is sufficient for invalidation.
        </p>

        <p className="text-neutral-300">
          Partial compliance or majority correctness does not restore
          admissibility.
        </p>

        <p className="text-neutral-300">
          Reinstatement requires elimination of the violation signature under
          identical test conditions.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            No violation signatures observed under reproducible testing.
          </p>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any reproducible violation signature observed.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT — JUDICIAL */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          A system that fails once under constraint is not compliant.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If violation is reproducible, admissibility is revoked. There is no
          partial validity under constraint failure.
        </p>
      </section>
    </main>
  );
}
