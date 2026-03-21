// app/edge-of-protection/preparedness/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Edge of Preparedness | Edge of Protection",
  description:
    "Deployment is admissible only if enforceable intervention authority exists prior to capability exposure.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function EdgeOfPreparednessPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — DEPLOYMENT GATE */}
      {/* ===================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,200,120,0.15),transparent_70%)]" />

        <div className="relative z-10 max-w-2xl space-y-8">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            The Edge of Preparedness
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Deployment Constraint",
              "Intervention Authority",
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
            Deployment is admissible only if enforceable intervention authority
            exists prior to capability exposure. If a system cannot be
            constrained at runtime, it must not be released.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="text-center space-y-6">
        <p className="text-2xl text-white">
          Capability is admissible only if it can be constrained before harm
          scales.
        </p>

        <p className="text-neutral-400">
          Any deployment without enforceable intervention authority constitutes
          structural failure.
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
            All system behaviors can be detected, constrained, and intervened on
            before irreversible harm emerges.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Capability without control allows harm to scale beyond detection,
            reversal, or accountability. Release without authority is loss of
            governance.
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
          <p className="text-neutral-300 leading-relaxed">
            Preparedness is the operational ability to detect, constrain, and
            intervene on system behavior before it propagates beyond control.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Availability, latency, and enforceability of intervention authority
            relative to system capability.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* DETECTION CONDITIONS */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 p-10">
        <h2 className="text-white font-semibold mb-6">
          Experimental / Boundary Setup
        </h2>

        <ul className="list-disc pl-6 text-neutral-300 space-y-3">
          <li>Map system capabilities and misuse pathways</li>
          <li>Test intervention mechanisms (pause, throttle, constraint, escalation)</li>
          <li>Simulate adversarial and high-risk conditions</li>
          <li>Measure response latency and effectiveness</li>
          <li>Verify ability to halt or redirect behavior in real time</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE — RELEASE BLOCK */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10">
        <h2 className="text-red-400 font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="text-neutral-200 mt-4 text-lg">
          The system fails if any capability cannot be interrupted,
          constrained, or redirected before harm scales beyond reversibility.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL CONSEQUENCE */}
      {/* ===================================================== */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-white font-semibold">
          Operational Interpretation
        </h2>

        <ul className="list-disc pl-6 text-neutral-300 space-y-3">
          <li>Capability mapping must precede deployment</li>
          <li>Abuse pathways must be explicitly modeled</li>
          <li>Intervention authority must be pre-approved and enforceable</li>
          <li>Thresholds must trigger constraint, not expansion</li>
          <li>Preparedness overrides product momentum</li>
        </ul>

        <p className="text-neutral-300">
          Preparedness that cannot act is not preparedness.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            All capabilities are bounded by enforceable, real-time intervention
            authority.
          </p>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any capability operates without enforceable intervention authority
            prior to deployment.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          Power without control is not preparedness.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If a system cannot be stopped, it is already out of bounds. Deployment
          requires enforceable authority before capability is released.
        </p>
      </section>
    </main>
  );
}
