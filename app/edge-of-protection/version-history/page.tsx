// app/edge-of-protection/version-history/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Version History
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Version History | Edge of Protection",
  description:
    "Governance is admissible only if prior constraints remain intact, visible, and non-degradable across versions.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function EdgeOfProtectionVersionHistoryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Version History
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Immutability Constraint
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Drift Prevention
            </span>
          </div>

          <p className="text-neutral-300 max-w-3xl">
            Governance is admissible only if prior constraints remain intact,
            visible, and non-degradable across versions. Any weakening,
            erasure, or silent reinterpretation constitutes failure.
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
          Governance is admissible only if it cannot weaken itself over time.
        </p>
        <p className="text-neutral-400 mt-4">
          Any loss, dilution, or reinterpretation of prior constraints
          constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            All prior constraints remain intact, enforceable, and semantically
            stable across version updates.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Governance that evolves through weakening replaces constraint with
            narrative, enabling drift under the appearance of progress.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          Version history is defined as an immutable record of constraints in
          which all prior rules remain active unless explicitly superseded by a
          stricter constraint.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Integrity of prior constraints across versions, including visibility,
          semantic consistency, and enforceability.
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
          <li>Compare prior and current versions of constraints</li>
          <li>Evaluate for semantic drift or reinterpretation</li>
          <li>Check for removal, weakening, or ambiguity introduction</li>
          <li>Assess visibility and traceability of historical rules</li>
          <li>Verify explicit supersession conditions where present</li>
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
          System fails if any prior constraint is removed, weakened,
          semantically altered, or rendered unenforceable without explicit
          strengthening replacement.
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
          <li>All changes must be additive or strictly strengthening</li>
          <li>No retroactive weakening or reinterpretation is permitted</li>
          <li>Supersession must be explicit, scoped, and more restrictive</li>
          <li>Historical constraints must remain visible and traceable</li>
          <li>Ambiguity introduced across versions constitutes failure</li>
        </ul>

        <p className="text-neutral-600">
          Governance evolution must increase constraint, not reduce it.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This constraint evaluates governance evolution only. It does not
          assess system performance, adoption, or external interpretation.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            All prior constraints remain intact, visible, and strictly preserved
            or strengthened across versions.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any prior constraint is weakened, removed, reinterpreted, or rendered
            ambiguous across versions.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          Governance that can rewrite itself cannot be trusted.
        </p>
        <p className="text-neutral-400 mt-4">
          If constraints weaken over time, they do not exist. Valid governance
          accumulates restriction—it does not erode it.
        </p>
      </section>
    </main>
  );
}
