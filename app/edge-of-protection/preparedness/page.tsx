// app/edge-of-protection/preparedness/page.tsx
// ============================================================
// EDGE OF PROTECTION
// The Edge of Preparedness
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Edge of Preparedness | Edge of Protection",
  description:
    "Deployment is admissible only if enforceable intervention authority exists prior to capability exposure.",
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function EdgeOfPreparednessPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            The Edge of Preparedness
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Deployment Constraint
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Intervention Authority
            </span>
          </div>

          <p className="text-neutral-300 max-w-3xl">
            Deployment is admissible only if enforceable intervention authority
            exists prior to capability exposure. Any system that cannot be
            paused, constrained, or redirected at runtime constitutes failure.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg leading-relaxed">
          Capability is admissible only if it can be constrained before harm
          scales.
        </p>
        <p className="text-neutral-400 mt-4">
          Any deployment without enforceable intervention authority constitutes
          structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            Systems can be identified, constrained, and intervened upon before
            emergent harms become irreversible.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Capability without enforceable control allows harm to scale beyond
            detection, reversal, or accountability.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          Preparedness is defined as the operational ability to detect,
          constrain, and intervene on emergent behaviors before they propagate
          beyond control.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Availability and enforceability of intervention authority relative to
          system capability.
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
          <li>Identify system capabilities and potential misuse paths</li>
          <li>Test intervention mechanisms (pause, throttle, refusal, escalation)</li>
          <li>Simulate adversarial and high-risk interaction conditions</li>
          <li>Measure response time and effectiveness of intervention</li>
          <li>Evaluate ability to halt or redirect system behavior</li>
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
          System fails if any capability cannot be interrupted, constrained, or
          redirected prior to harm scaling beyond reversibility.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL INTERPRETATION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-6">
        <h2 className="font-semibold text-lg">
          Operational Interpretation
        </h2>

        <ul className="list-disc pl-6 text-neutral-600 space-y-2">
          <li>Capability mapping must precede deployment</li>
          <li>Abuse paths must be explicitly modeled and tested</li>
          <li>Intervention authority must be pre-approved and enforceable</li>
          <li>Thresholds must trigger constraint, not expansion</li>
          <li>Preparedness must override product momentum</li>
        </ul>

        <p className="text-neutral-600">
          Preparedness that cannot act is not preparedness.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This constraint evaluates deployment readiness only. It does not assess
          system utility, performance, or innovation potential.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            All capabilities are bounded by enforceable, pre-deployed
            intervention mechanisms.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any capability operates without enforceable intervention authority
            prior to deployment.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          Power without control is not preparedness.
        </p>
        <p className="text-neutral-400 mt-4">
          If a system cannot be stopped, it is already out of bounds. Deployment
          requires enforceable authority before capability is released.
        </p>
      </section>
    </main>
  );
}
