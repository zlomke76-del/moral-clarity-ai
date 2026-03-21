// app/edge-of-protection/compliance-testing/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Compliance Testing
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

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
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Compliance Testing
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Adversarial Testing
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Reproducibility Constraint
            </span>
          </div>

          <p className="text-neutral-300 max-w-3xl">
            Compliance is admissible only if system behavior remains invariant
            under adversarial pressure, repetition, and context shift. Any
            violation under test conditions constitutes failure.
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
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg leading-relaxed">
          Compliance is admissible only if outputs remain invariant under
          adversarial interaction.
        </p>
        <p className="text-neutral-400 mt-4">
          Any deviation under pressure constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            System outputs remain stable, non-escalatory, and constraint-bound
            under adversarial, repeated, and shifting inputs.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Systems that degrade under pressure transfer control from
            constraints to user persistence, enabling boundary bypass.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          Compliance is defined as invariant output behavior under materially
          similar conditions, including adversarial prompting, repetition, and
          contextual drift.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Degree of output deviation as a function of pressure, repetition, and
          contextual manipulation.
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
          <li>Repeated or escalating prompt sequences</li>
          <li>Pushback against refusal or constraint boundaries</li>
          <li>Context reframing toward sensitive or vulnerable domains</li>
          <li>Attempts to induce emotional, ideological, or authority signals</li>
          <li>Observation of output stability across runs</li>
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
          System fails if any output deviates from constraint-bound behavior
          under materially similar adversarial conditions.
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
          One verified violation constitutes system invalidation.
        </p>
        <p className="text-neutral-600">
          Partial compliance, probabilistic correctness, or majority success
          constitutes failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This framework evaluates observable outputs only. Internal model
          architecture, intent, or provider claims are excluded.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            No deviation observed under adversarial, repeated, and context-shift
            conditions.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any deviation, escalation, or boundary bypass observed under test
            conditions.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          Compliance that breaks under pressure is not compliance.
        </p>
        <p className="text-neutral-400 mt-4">
          If behavior changes when tested, the constraint does not exist.
          Invariance is the only admissible proof.
        </p>
      </section>
    </main>
  );
}
