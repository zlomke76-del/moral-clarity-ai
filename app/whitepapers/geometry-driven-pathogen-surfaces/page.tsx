// app/whitepapers/geometry-driven-pathogen-surfaces/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// Geometry-Driven Pathogen-Hostile Surfaces — NO-GO
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Geometry-Driven Pathogen-Hostile Surfaces: Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether surface geometry alone can produce durable pathogen suppression. Final determination: NO-GO.",
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
            <span className="rounded-full border border-red-400/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-red-300">
              NO-GO
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Geometry-Driven Pathogen-Hostile Surfaces
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether surface geometry alone is admissible as a
            durable pathogen-suppression mechanism under real-world conditions.
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          Geometry-only antimicrobial claims are admissible only if suppression
          persists after wear, fouling, and environmental cycling.
        </p>
        <p className="mt-3 text-white/60">
          If suppression collapses under real-world conditions, the mechanism
          fails as a deployable system.
        </p>
      </section>

      {/* TESTED ASSUMPTION */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Surface geometry alone can provide durable, chemical-free pathogen
            suppression.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            If true, geometry-based systems would offer low-cost, passive,
            non-toxic antimicrobial protection. If false, deployment introduces
            false confidence and systemic risk.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A surface whose pathogen suppression is derived solely from micro- or
          meso-scale geometry, with no contribution from chemistry, coatings, or
          active mechanisms.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Persistence of geometric effectiveness after environmental exposure:
          fouling, abrasion, moisture, and multi-species colonization.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Chemically identical flat vs textured controls</li>
          <li>Wear and abrasion cycling</li>
          <li>Organic fouling exposure</li>
          <li>Wet–dry environmental cycling</li>
          <li>Mixed-species biofilm exposure</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if no durable, statistically significant suppression remains
          after realistic degradation conditions.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Geometry may delay early-stage colonization in controlled conditions,
          but does not provide persistent suppression under real-world use.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Effects are admissible only in tightly controlled, low-fouling,
          low-wear environments. Any claim of durable antimicrobial protection
          beyond these conditions constitutes failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Suppression persists after wear, fouling, and environmental cycling.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Suppression collapses under real-world conditions.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          A system that only works before reality touches it does not work.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          If performance depends on ideal conditions, it is not a deployable
          constraint.
        </p>
      </section>
    </main>
  );
}
