// ------------------------------------------------------------
// Edge of Insurability — Canonical Entry
// Upgraded to Constraint-Bound Admissibility Framework
// App Router | Next.js 16 SAFE
// ------------------------------------------------------------

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Edge of Insurability",
  description:
    "A system is admissible only if risk is transferable through independently auditable control evidence.",
  openGraph: {
    title: "The Edge of Insurability",
    description:
      "Insurability defines the binary boundary where systems become economically accountable through provable risk control.",
    type: "article",
  },
};

export default function EdgeOfInsurabilityPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            The Edge of Insurability
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              Edge Framework
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              Economic Boundary
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              Risk Transfer Constraint
            </span>
          </div>

          <p className="max-w-3xl text-neutral-300">
            A system is admissible only if risk can be transferred through
            independently auditable control evidence. Absent proof, coverage does
            not attach, and economic accountability fails.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-lg text-white leading-relaxed">
          Insurability is admissible only if risk is provably controllable.
        </p>
        <p className="mt-4 text-neutral-400">
          Any system that cannot demonstrate auditable control evidence
          constitutes structural economic failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION / WHY THIS MATTERS */}
      {/* ===================================================== */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Tested Assumption</h2>
          <p className="mt-2 text-neutral-600">
            AI systems can demonstrate independently verifiable control over
            risk sufficient for underwriting and coverage.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Why This Matters</h2>
          <p className="mt-2 text-neutral-600">
            Systems that cannot transfer risk remain economically unbounded,
            preventing accountability, scaling, and market integration.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">System Definition</h2>
        <p className="text-neutral-600">
          Insurability is defined as the ability of a system to transfer
          financial risk through independently auditable evidence of governance,
          control, and operational discipline.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Governing Variable</h2>
        <p className="text-neutral-600">
          Presence of independently verifiable control evidence sufficient to
          satisfy underwriting requirements for risk transfer.
        </p>
      </section>

      {/* ===================================================== */}
      {/* EXPERIMENTAL / BOUNDARY SETUP */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          Experimental / Boundary Setup
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-600">
          <li>Evaluate existence of documented control frameworks</li>
          <li>Test auditability and third-party verifiability of controls</li>
          <li>Assess traceability of decisions, actions, and failures</li>
          <li>Verify enforcement of governance at runtime</li>
          <li>Determine insurer acceptance or rejection of risk transfer</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* BINARY FALSIFICATION THRESHOLD */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          Binary Falsification Threshold
        </h2>
        <p className="text-neutral-600">
          System fails if risk cannot be transferred due to absence of
          independently auditable control evidence.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL INTERPRETATION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          Operational Interpretation
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-neutral-600">
          <li>Capability is not admissible evidence</li>
          <li>Performance does not substitute for control</li>
          <li>Intent and internal assurance carry no weight</li>
          <li>All governance must be externally auditable</li>
          <li>Coverage is binary: attached or absent</li>
        </ul>

        <p className="text-neutral-600">
          Governance that cannot be proven is treated as nonexistent.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This constraint evaluates economic accountability only. It does not
          assess technical performance, ethical intent, or regulatory posture.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="mt-2 text-neutral-600">
            Risk is transferable through independently auditable control
            evidence accepted by insurers.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="mt-2 text-neutral-600">
            Risk cannot be transferred due to missing, unverifiable, or
            insufficient control evidence.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-lg text-white">
          If risk cannot be transferred, accountability does not exist.
        </p>
        <p className="mt-4 text-neutral-400">
          Systems without insurability remain experimental. Economic reality
          begins only where risk is provably controlled and accepted.
        </p>
      </section>
    </main>
  );
}
