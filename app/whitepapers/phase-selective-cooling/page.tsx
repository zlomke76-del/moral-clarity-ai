// app/whitepapers/phase-selective-cooling/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// Phase-Selective Cooling Fabric — CONDITIONAL
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Phase-Selective Cooling Fabric | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether passive radiative and phase-change textiles provide meaningful cooling under real-world conditions.",
  robots: { index: true, follow: true },
};

export default function PhaseSelectiveCoolingWhitepaper() {
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
            Phase-Selective Cooling Fabric
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether passive radiative emission and phase-change
            buffering produce meaningful, persistent cooling under real-world
            environmental conditions. :contentReference[oaicite:0]{index=0}
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          Cooling is admissible only if net heat loss persists under real-world
          conditions where convection, humidity, and solar gain are present.
        </p>
        <p className="mt-3 text-white/60">
          If cooling collapses outside constrained environments, the system
          fails as a practical intervention.
        </p>
      </section>

      {/* TESTED ASSUMPTION + WHY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Radiative emission and phase-change materials can produce sustained
            cooling beyond ambient conditions in wearable systems.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            If valid, passive cooling fabrics could reduce heat stress without
            energy input. If invalid, they create false confidence and displace
            effective cooling strategies.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A textile system combining high emissivity in the mid-infrared
          atmospheric window and/or embedded phase-change materials to reduce
          perceived or measured heat load on the wearer.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Net heat flux reduction under combined radiative, convective,
          conductive, and evaporative conditions.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Outdoor vs indoor testing environments</li>
          <li>Controlled humidity variation</li>
          <li>Direct solar vs shaded conditions</li>
          <li>Skin or manikin temperature comparison</li>
          <li>PCM cycling and re-solidification testing</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if cooling effect is not statistically distinguishable from
          baseline clothing under realistic environmental conditions or if
          performance disappears indoors or under humidity.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Radiative cooling and PCM buffering are physically valid but limited.
          Radiative effects require specific environmental conditions, and PCM
          effects are temporary and require reset.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Effects are admissible only in low-humidity, shaded, outdoor
          conditions with clear sky exposure. Any claim of universal cooling or
          replacement of primary heat mitigation constitutes failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Measurable net heat loss persists under real-world environmental
            conditions without reliance on idealized setups.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Cooling effect is environment-dependent, transient, or disappears
            outside controlled conditions.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          If cooling depends on conditions the user cannot control, it is not a reliable solution.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          Physics that only works in ideal environments does not scale to reality.
        </p>
      </section>
    </main>
  );
}
