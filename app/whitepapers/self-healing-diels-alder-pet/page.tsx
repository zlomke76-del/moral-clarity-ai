// app/whitepapers/self-healing-pet-diels-alder/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// Self-Healing PET via Diels–Alder Chemistry — CONDITIONAL
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Self-Healing PET via Diels–Alder Chemistry | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether Diels–Alder-enabled PET systems provide durable, repeatable self-healing under mechanical and thermal cycling.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-10">
      {/* HERO */}
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#0a0f1a] to-black p-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              White Paper
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              Constraint Assessment
            </span>
            <span className="rounded-full border border-yellow-400/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-yellow-300">
              CONDITIONAL
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Self-Healing PET via Diels–Alder Chemistry
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether reversible Diels–Alder bonding in PET enables
            repeatable recovery of mechanical integrity under controlled thermal
            cycling.
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          Self-healing is admissible only if mechanical properties recover
          consistently across repeated damage–healing cycles without cumulative
          degradation.
        </p>
        <p className="mt-3 text-white/60">
          If recovery diminishes with cycling, the system fails as a durable
          self-healing material.
        </p>
      </section>

      {/* TESTED ASSUMPTION + WHY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Diels–Alder reversible bonds embedded in PET can reform after damage,
            restoring structural integrity under thermal activation.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            If valid, materials could extend lifetime and reduce failure-driven
            waste. If invalid, recovery is superficial or short-lived, limiting
            real-world benefit.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A PET-based polymer system incorporating furan–maleimide (or equivalent)
          Diels–Alder reactive groups that form reversible covalent bonds capable
          of dissociation and reformation under controlled temperature.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Retention of mechanical strength (e.g., tensile strength or modulus)
          after repeated damage and thermal healing cycles.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Controlled introduction of microcracks or mechanical damage</li>
          <li>Thermal activation cycles to induce bond reformation</li>
          <li>Measurement of mechanical properties before and after healing</li>
          <li>Repeated cycling (≥5 cycles)</li>
          <li>Comparison to non-functionalized PET baseline</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if greater than 10% mechanical property loss persists after five
          healing cycles or if recovery declines progressively with each cycle.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Reversible bonding enables partial recovery, but effectiveness depends
          on bond density, thermal accessibility, and avoidance of irreversible
          degradation pathways.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Self-healing claims are admissible only where repeatable recovery is
          demonstrated under realistic cycling conditions. Any claim of
          indefinite healing without degradation constitutes failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Mechanical properties recover consistently across repeated
            damage–healing cycles.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Recovery diminishes or structural integrity degrades across cycles.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          If healing degrades with use, it is not healing—it is delay.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          Durability is defined by repeatability, not initial recovery.
        </p>
      </section>
    </main>
  );
}
