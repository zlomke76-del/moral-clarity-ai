// app/whitepapers/catechol-bearing-pet/page.tsx
// ============================================================
// WHITE PAPER
// Catechol-Bearing PET (Adhesion-Enhanced PET)
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catechol-Bearing PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether catechol functionality can be structurally anchored into PET to enable durable adhesion without mobile adhesives.",
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
            Catechol-Bearing PET (Adhesion-Enhanced PET)
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether catechol
            functionality can be covalently anchored into PET to enable durable
            adhesion across metal, glass, and biological substrates without
            reliance on mobile adhesives or external bonding agents.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of incorporating
            catechol-bearing functionality into polyethylene terephthalate
            (PET) as a route to intrinsic adhesion. The central constraint is
            persistence under environmental cycling. Adhesion is admissible only
            if it remains after repeated wet/dry exposure without degradation
            beyond defined thresholds.
          </p>
          <p className="leading-8 text-neutral-700">
            If adhesion depends on transient surface chemistry or degrades under
            cycling, the system fails as an anchored adhesion material and
            reverts to an unstable or additive-dependent mechanism.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Adhesion in polymer systems is commonly achieved through applied
            adhesives, surface treatments, or coatings. These introduce failure
            points, toxicity concerns, and degradation under moisture, thermal,
            or mechanical stress.
          </p>
          <p className="leading-8 text-neutral-700">
            Catechol chemistry, inspired by mussel adhesion, offers a pathway to
            strong interfacial bonding across diverse substrates. However, its
            effectiveness depends on whether the functional group is retained
            and accessible as part of the material structure.
          </p>
          <p className="leading-8 text-neutral-700">
            For PET to function as an adhesion-capable material, catechol groups
            must remain covalently anchored and resist degradation or loss under
            repeated environmental cycling.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Incorporating catechol-functional diacids or diols into PET during
            polymerization may enable intrinsic adhesion through retained
            functional groups that interact with target surfaces under both wet
            and dry conditions.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if adhesion performance is stable
            under repeated environmental cycling and does not depend on
            degradation-sensitive or extractable components.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Catechol-bearing monomers are introduced into PET during
            polycondensation at low molar fractions. The objective is to embed
            adhesion-capable functionality directly into the polymer network
            without compromising processability or structural integrity.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It assumes no inherent
            adhesion benefit unless validated through persistence and cycling
            stability.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if adhesion strength decreases beyond the defined
            threshold after repeated wet/dry cycling.
          </p>
          <p className="leading-8 text-neutral-700">
            Loss of adhesion indicates either degradation of catechol
            functionality or insufficient structural retention, invalidating the
            concept as an anchored adhesion material.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Surface peel testing is conducted after repeated wet/dry cycling to
            evaluate adhesion stability under environmental stress.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> greater than 10% reduction in adhesion
            strength relative to baseline after cycling.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> adhesion loss remains within 10% of baseline,
            with no evidence that bonding relies on transient or degrading
            chemistry.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines persistence, not peak performance.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention and stability hold, catechol-bearing PET may enable
            durable adhesion across a range of substrates without the need for
            applied adhesives or bonding agents.
          </p>
          <p className="leading-8 text-neutral-700">
            This could support applications in medical devices, assemblies, and
            environments where adhesive migration or degradation presents
            unacceptable risk.
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
            This paper does not claim validated adhesion performance across all
            substrates, regulatory approval, biocompatibility certification,
            manufacturability at scale, or superiority over existing adhesive
            systems.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which intrinsic adhesion becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Catechol-bearing PET is admissible only if adhesion persists after
            repeated environmental cycling as a function of retained structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If adhesion degrades beyond threshold, the concept fails as a durable
            structural solution. If stability holds, it becomes a viable
            candidate for adhesion-critical applications without reliance on
            external adhesives.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Adhesion is admissible only if it survives environmental cycling.
          </p>
          <p className="mt-2 text-neutral-600">
            If bonding degrades under use conditions, it does not belong to the
            material.
          </p>
        </section>
      </article>
    </main>
  );
}
