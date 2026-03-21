// app/whitepapers/cyanate-ester-pet/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Cyanate Ester–PET Copolymer | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether aromatic cyanate ester functionality can be structurally retained under high-temperature exposure.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 space-y-16">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] to-black p-12">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              White Paper
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              Constraint Assessment
            </span>
            <span className="rounded-full border border-yellow-400/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-yellow-300">
              STATUS: CONDITIONAL
            </span>
          </div>

          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Cyanate Ester–PET Copolymer
          </h1>

          <p className="max-w-2xl text-lg text-white/70 leading-8">
            Evaluation of whether aromatic cyanate ester functionality can be
            structurally incorporated into PET to improve thermal durability
            without functional loss under high-temperature exposure.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM CONSTRAINT */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-14 text-center">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6">
          System Constraint
        </h2>

        <p className="text-3xl text-white max-w-3xl mx-auto leading-[1.5]">
          Thermal durability is admissible only if cyanate-derived structure
          remains intact after high-temperature exposure.
        </p>

        <p className="mt-6 text-white/50">
          If functionality degrades under heat, the system is rejected.
        </p>
      </section>

      {/* ===================================================== */}
      {/* CONTEXT */}
      {/* ===================================================== */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold text-white">Problem Context</h2>

        <p className="text-white/70 leading-8">
          PET performance degrades under elevated temperatures, limiting use in
          transportation, electronics, and infrastructure systems.
        </p>

        <p className="text-white/70 leading-8">
          Existing approaches rely on fillers and coatings, introducing
          complexity and failure modes.
        </p>

        <p className="text-white/70 leading-8">
          Structural modification offers a path to intrinsic heat resistance.
        </p>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM CONSTRUCTION */}
      {/* ===================================================== */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold text-white">
          System Construction
        </h2>

        <p className="text-white/70 leading-8">
          Aromatic cyanate ester monomers are introduced at low molar fractions
          during PET synthesis to form thermally stable triazine structures.
        </p>

        <p className="text-white/70 leading-8">
          This is a constrained structural pathway requiring retention validation.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FAILURE CONDITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border border-white/10 bg-white/[0.05] p-8 max-w-3xl">
        <h2 className="text-xl font-semibold text-white">
          Failure Condition
        </h2>

        <p className="mt-3 text-white/80 leading-8">
          The system fails if cyanate-derived functionality degrades or is lost
          under thermal exposure, as indicated by reduction in IR spectral features.
        </p>
      </section>

      {/* ===================================================== */}
      {/* ADMISSIBILITY TEST */}
      {/* ===================================================== */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold text-white">
          Admissibility Test
        </h2>

        <p className="text-white/70 leading-8">
          Thermal exposure at 250°C for 1 hour followed by IR analysis to
          quantify retained functionality.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6">
            <h3 className="text-green-300 font-semibold">PASS</h3>
            <p className="mt-2 text-green-200/80">
              ≥90% functional retention under thermal stress.
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="text-red-300 font-semibold">FAIL</h3>
            <p className="mt-2 text-red-200/80">
              &gt;10% functional loss after exposure.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DETERMINATION */}
      {/* ===================================================== */}
      <section className="text-center space-y-4">
        <div className="w-24 h-px bg-white/10 mx-auto" />

        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          System Determination
        </p>

        <p className="text-white/70 max-w-2xl mx-auto">
          Admissibility is conditional on functional retention under thermal stress.
          Thermal performance claims are invalid if structural retention fails.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FINAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-16 text-center">
        <p className="text-3xl text-white leading-[1.5]">
          If the structure does not survive heat,
          <br />
          the material does not gain thermal durability.
        </p>

        <p className="mt-6 text-white/60">
          Temperature does not test performance.
        </p>

        <p className="mt-2 text-white/40">
          It reveals structure.
        </p>
      </section>
    </main>
  );
}
