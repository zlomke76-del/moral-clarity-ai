// app/whitepapers/carboxylic-acid-modified-pet/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Carboxylic Acid–Modified PET | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether pendant carboxylic acid functionality can be durably incorporated into PET to improve chemical resistance.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 space-y-16">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] to-black p-12">
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">
          White Paper · Constraint Assessment
        </p>

        <h1 className="mt-4 text-5xl font-semibold text-white">
          Carboxylic Acid–Modified PET
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/70 leading-8">
          Evaluation of whether pendant carboxylic acid functionality can be
          structurally incorporated into PET to improve chemical resistance
          without reliance on extractable additives.
        </p>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM CONSTRAINT */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-14 text-center">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6">
          System Constraint
        </h2>

        <p className="text-3xl text-white max-w-3xl mx-auto leading-[1.5]">
          Chemical resistance is admissible only if carboxylic acid functionality
          remains structurally retained after extraction stress.
        </p>

        <p className="mt-6 text-white/50">
          If functionality is not retained, observed performance is not structural.
        </p>
      </section>

      {/* ===================================================== */}
      {/* CONTEXT */}
      {/* ===================================================== */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-2xl font-semibold text-white">Problem Context</h2>

        <p className="text-white/70 leading-8">
          PET is widely used in chemically exposed environments, where degradation
          and interaction can compromise integrity.
        </p>

        <p className="text-white/70 leading-8">
          Existing solutions introduce coatings, additives, and failure pathways.
          Structural modification offers a potential alternative.
        </p>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DESIGN */}
      {/* ===================================================== */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-2xl font-semibold text-white">
          System Construction
        </h2>

        <p className="text-white/70 leading-8">
          Dicarboxylic acid monomers with pendant functionality are incorporated
          during melt polycondensation to embed acid groups into the polymer backbone.
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
          The system fails if pendant acid functionality is not retained after extraction
          or if loss reduces structural contribution below threshold.
        </p>
      </section>

      {/* ===================================================== */}
      {/* ADMISSIBILITY TEST */}
      {/* ===================================================== */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-2xl font-semibold text-white">
          Admissibility Test
        </h2>

        <p className="text-white/70 leading-8">
          Soxhlet water extraction followed by acid titration to quantify retained functionality.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6">
            <h3 className="text-green-300 font-semibold">PASS</h3>
            <p className="mt-2 text-green-200/80">
              ≥90% retention of pendant acid functionality with no extractables.
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="text-red-300 font-semibold">FAIL</h3>
            <p className="mt-2 text-red-200/80">
              &lt;90% retention or evidence of extractable functionality.
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
          Admissibility is conditional on structural retention. Performance claims
          are invalid if retention fails.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FINAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-16 text-center">
        <p className="text-3xl text-white leading-[1.5]">
          If the modifying structure does not remain,
          <br />
          the improvement does not belong to the material.
        </p>

        <p className="mt-6 text-white/60">
          Chemical resistance requires structural persistence.
        </p>
      </section>
    </main>
  );
}
