// app/whitepapers/carboxylic-acid-modified-pet/page.tsx
// ============================================================
// WHITE PAPER
// Carboxylic Acid–Modified PET
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carboxylic Acid–Modified PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether pendant carboxylic acid functionality can be durably incorporated into PET to improve chemical resistance without leaching.",
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
            Carboxylic Acid–Modified PET
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether pendant carboxylic
            acid functionality can be structurally incorporated into PET to
            improve chemical resistance and container durability without
            reliance on extractable additives.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of introducing pendant
            carboxylic acid groups into polyethylene terephthalate (PET) as a
            route to enhanced chemical resistance. The central constraint is
            retention. Improved resistance is admissible only if the acid
            functionality is structurally anchored and remains present after
            extraction stress.
          </p>
          <p className="leading-8 text-neutral-700">
            If the functional groups are not retained, then any observed
            performance improvement is not structurally grounded and cannot be
            treated as durable material behavior.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            PET is widely used in food, beverage, and pharmaceutical containers,
            but certain applications expose it to chemically aggressive
            environments. Under these conditions, degradation, interaction, or
            loss of integrity can occur.
          </p>
          <p className="leading-8 text-neutral-700">
            Enhancing chemical resistance typically involves coatings, additives,
            or multilayer structures. These approaches introduce complexity,
            potential migration, and failure points over time.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally modified PET with retained acid functionality offers
            a potential route to intrinsic resistance without reliance on
            external layers or mobile chemistry.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Copolymerizing dicarboxylic acids bearing pendant functionality into
            PET may enable enhanced resistance to chemical exposure by altering
            local interactions, polarity, and structural behavior of the polymer.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if the pendant acid groups remain
            structurally incorporated and measurable after extraction challenge.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Dicarboxylic acid monomers containing pendant acid functionality are
            introduced during PET melt polycondensation at low molar fractions.
            The goal is to embed additional acid groups into the polymer network
            without disrupting processability or baseline material properties.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural approach. It does not assume
            performance improvement; it defines a pathway that must be validated
            through retention and survivability.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if pendant acid functionality is not retained after
            extraction or if measurable loss reduces structural contribution
            below the defined threshold.
          </p>
          <p className="leading-8 text-neutral-700">
            In that case, the material behaves as an additive-dependent system
            rather than a structurally modified polymer.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Soxhlet water extraction is used as the governing stress condition,
            followed by acid titration to quantify retained functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> less than 90% acid functionality retained
            after extraction.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> at least 90% retention of pendant acid groups
            with no evidence of extractable functional species.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines structural persistence, not optimization.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, the material may exhibit improved resistance to
            chemical exposure, leading to enhanced container durability and
            extended service life in demanding environments.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if the retention
            requirement fails.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim validated chemical resistance across all
            environments, regulatory approval, toxicological clearance,
            manufacturability at scale, or superiority over existing materials.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which it becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Carboxylic acid–modified PET is admissible only if pendant acid
            functionality remains structurally retained after extraction.
          </p>
          <p className="leading-8 text-neutral-700">
            If retention falls below threshold, the concept fails as a durable
            structural modification. If retention holds, it becomes a viable
            candidate for extended-use PET in chemically demanding contexts.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Chemical resistance is admissible only if the modifying structure
            remains in the material.
          </p>
          <p className="mt-2 text-neutral-600">
            If the functional group does not survive extraction, the improvement
            does not belong to the material.
          </p>
        </section>
      </article>
    </main>
  );
}
