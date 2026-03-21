// app/whitepapers/lignin-derived-aromatic-pet/page.tsx
// ============================================================
// WHITE PAPER
// Lignin-Derived Aromatic PET Copolymer
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lignin-Derived Aromatic PET Copolymer | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether lignin-derived aromatic diacids can be structurally incorporated into PET to enable durable renewable substitution without loss of integrity.",
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
            Lignin-Derived Aromatic PET Copolymer
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether lignin-derived
            aromatic diacids can be structurally incorporated into PET to
            replace petroleum-derived aromatics while maintaining retention,
            integrity, and material coherence.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of incorporating
            lignin-derived aromatic diacids into polyethylene terephthalate
            (PET) as a renewable substitution strategy. The governing constraint
            is structural retention of aromatic content. Renewable substitution
            is admissible only if lignin-derived aromatics remain integrated
            into the polymer after extraction and analytical challenge.
          </p>
          <p className="leading-8 text-neutral-700">
            If aromatic content is lost, degraded, or not measurably retained,
            the system fails as a structurally credible renewable copolymer and
            reverts to nominal or unstable substitution.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            PET relies on petroleum-derived aromatic monomers, creating
            dependence on fossil feedstocks despite otherwise mature material
            performance.
          </p>
          <p className="leading-8 text-neutral-700">
            Lignin, an abundant byproduct of biomass processing, contains
            significant aromatic structure but is underutilized due to
            processing complexity and variability.
          </p>
          <p className="leading-8 text-neutral-700">
            Converting lignin-derived fractions into compatible diacid monomers
            presents a potential pathway to renewable aromatic substitution—if
            structural integrity can be maintained.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Co-condensation of lignin-derived aromatic diacids into PET may
            enable partial substitution of petroleum-based aromatics while
            preserving polymer structure.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if lignin-derived aromatic units are
            retained after extraction and remain part of the polymer backbone in
            a measurable and stable form.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Aromatic diacids derived from lignin are introduced during PET
            polycondensation at controlled molar fractions. The objective is to
            replace a portion of conventional aromatic content with renewable
            sources without disrupting polymerization or material properties.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It assumes no
            sustainability benefit unless retention and structural integrity are
            demonstrated.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if lignin-derived aromatic content is not retained
            after extraction or if measurable degradation reduces structural
            contribution below threshold.
          </p>
          <p className="leading-8 text-neutral-700">
            Loss of aromatic retention invalidates the concept as a durable
            renewable substitution and reduces it to a non-structural inclusion.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Soxhlet extraction is used as the governing stress condition,
            followed by UV-Vis or NMR analysis to quantify retained aromatic
            functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> less than 90% aromatic retention after
            extraction.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> at least 90% retention of lignin-derived
            aromatic structure with no evidence of extractable or unstable
            content.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines structural persistence, not sustainability
            claims.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, lignin-derived PET may enable polymer systems
            with reduced fossil dependence while maintaining structural
            integrity and performance characteristics.
          </p>
          <p className="leading-8 text-neutral-700">
            This represents upstream feedstock substitution rather than
            performance transformation.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if retention fails.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim lifecycle carbon reduction, recyclability
            improvement, supply chain viability, or commercial readiness.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which renewable aromatic substitution becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Lignin-derived aromatic PET is admissible only if renewable aromatic
            content remains structurally retained after extraction.
          </p>
          <p className="leading-8 text-neutral-700">
            If retention falls below threshold, the concept fails as a durable
            substitution strategy. If retention holds, it becomes a viable
            candidate for reducing fossil-derived aromatic content in PET
            systems.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Renewable substitution is admissible only if it remains in the
            material.
          </p>
          <p className="mt-2 text-neutral-600">
            If the structure does not persist, the sustainability claim does not
            belong to the polymer.
          </p>
        </section>
      </article>
    </main>
  );
}
