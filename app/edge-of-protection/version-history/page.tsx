// app/edge-of-protection/version-history/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Version History | Edge of Protection",
  description:
    "Governance is admissible only if constraints cannot be weakened, removed, or reinterpreted across versions.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function EdgeOfProtectionVersionHistoryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — CONSTRAINT RATCHET */}
      {/* ===================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,220,180,0.2),transparent_70%)]" />

        <div className="relative z-10 max-w-2xl space-y-8">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Version History
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Immutability Constraint",
              "Constraint Ratchet",
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
            Governance is admissible only if constraints cannot weaken over time.
            Any removal, dilution, or reinterpretation constitutes failure.
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
          Governance is admissible only if it cannot move backward.
        </p>

        <p className="text-neutral-400">
          Any weakening, erasure, or reinterpretation of prior constraints
          constitutes structural failure.
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
            All prior constraints remain intact, enforceable, and semantically
            stable across versions.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Systems rarely fail by breaking rules. They fail by rewriting them
            until violation becomes permissible.
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
            Version history is an immutable constraint record in which all prior
            rules remain active unless explicitly replaced by stricter constraints.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Degree of preservation, visibility, and semantic integrity of prior
            constraints across versions.
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
          <li>Compare prior and current constraint definitions</li>
          <li>Evaluate for semantic drift or reinterpretation</li>
          <li>Detect removal, weakening, or ambiguity introduction</li>
          <li>Assess traceability and visibility of historical rules</li>
          <li>Verify explicit strengthening when supersession occurs</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10">
        <h2 className="text-red-400 font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="text-neutral-200 mt-4 text-lg">
          The system fails if any prior constraint is weakened, removed,
          semantically altered, or rendered unenforceable.
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
          <li>All changes must be additive or strictly strengthening</li>
          <li>No retroactive weakening or reinterpretation is permitted</li>
          <li>Supersession must be explicit, scoped, and more restrictive</li>
          <li>All historical constraints must remain visible and traceable</li>
          <li>Ambiguity across versions constitutes failure</li>
        </ul>

        <p className="text-neutral-300">
          Governance must accumulate constraint—it must not erode it.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            All prior constraints remain intact, visible, and strictly preserved or strengthened.
          </p>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any prior constraint is weakened, removed, reinterpreted, or made ambiguous.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          Governance that can rewrite itself cannot be trusted.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If constraints weaken over time, they do not exist. Valid governance
          moves in one direction—toward greater restriction, never less.
        </p>
      </section>
    </main>
  );
}
