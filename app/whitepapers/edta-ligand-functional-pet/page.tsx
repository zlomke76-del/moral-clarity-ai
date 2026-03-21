// app/whitepapers/edta-ligand-functional-pet/page.tsx
// ============================================================
// WHITE PAPER
// EDTA-Ligand Functional PET
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EDTA-Ligand Functional PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether EDTA-like ligand functionality can be structurally incorporated into PET to enable durable heavy-metal binding without leaching.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <article className="space-y-10">
        {/* HEADER */}
        <header className="space-y-4 border-b pb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
            White Paper · Anchored PET Candidate
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            EDTA-Ligand Functional PET
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether EDTA-like ligand
            functionality can be covalently incorporated into PET to enable
            repeatable heavy-metal binding without reliance on leaching or
            consumable additives.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of embedding EDTA-like
            chelating functionality into polyethylene terephthalate (PET) as a
            route to reusable heavy-metal capture. The central constraint is
            cycling stability. Binding capability is admissible only if it
            persists across repeated capture–release cycles without loss of
            function or structural degradation.
          </p>
          <p className="leading-8 text-neutral-700">
            If binding capacity diminishes under repeated use or depends on
            extractable ligand species, the system fails as an anchored
            remediation material.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Heavy-metal contamination in water systems presents persistent
            environmental and public health challenges. Conventional remediation
            approaches often rely on soluble chelating agents or consumable
            filtration media.
          </p>
          <p className="leading-8 text-neutral-700">
            These systems introduce limitations including depletion,
            regeneration complexity, and potential release of active species
            into the environment.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally anchored chelating material offers a potential route
            to repeatable, non-leaching remediation performance.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Incorporating EDTA-like ligand structures into PET during
            polymerization may enable fixed chelation sites capable of binding
            heavy metals repeatedly without loss of function.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if binding capacity remains stable
            across multiple cycles and does not rely on mobile or extractable
            ligand species.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            EDTA-analog diacid or diol monomers are introduced into PET during
            polycondensation at low molar fractions. The objective is to embed
            chelation-capable functionality directly into the polymer structure
            while preserving processability and mechanical integrity.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It assumes no binding
            benefit unless retention and cycling stability are demonstrated.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if heavy-metal binding capacity decreases
            measurably across repeated cycles or if ligand functionality is
            lost or degraded.
          </p>
          <p className="leading-8 text-neutral-700">
            Loss of performance indicates either structural instability or
            reliance on non-retained chemistry, invalidating the concept as an
            anchored remediation material.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Repeated heavy-metal binding and release cycles are used as the
            governing stress condition, with quantitative measurement of
            retained binding capacity after each cycle.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> measurable loss of binding capacity after
            five cycles.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> binding capacity remains stable across at
            least five cycles with no evidence of ligand loss or leaching.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines repeatability, not peak binding efficiency.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention and cycling stability hold, EDTA-functional PET may
            enable reusable filtration systems capable of repeated heavy-metal
            capture without release of active species.
          </p>
          <p className="leading-8 text-neutral-700">
            This could support water purification systems with reduced material
            consumption and improved control over contaminant removal.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if the cycling
            stability requirement fails.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim validated remediation performance across
            all contaminants, regulatory approval, environmental safety across
            all conditions, or manufacturability at scale.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which durable chelation becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            EDTA-ligand functional PET is admissible only if binding capacity
            persists across repeated cycles as a function of retained structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If performance degrades or depends on extractable chemistry, the
            concept fails as a durable remediation material. If stability holds,
            it becomes a viable candidate for reusable heavy-metal capture
            systems.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Remediation is admissible only if binding persists across cycles.
          </p>
          <p className="mt-2 text-neutral-600">
            If capacity degrades with use, the function does not belong to the
            material.
          </p>
        </section>
      </article>
    </main>
  );
}
