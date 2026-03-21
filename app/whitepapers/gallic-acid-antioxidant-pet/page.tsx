// app/whitepapers/gallic-acid-antioxidant-pet/page.tsx
// ============================================================
// WHITE PAPER
// Gallic Acid–Antioxidant PET
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallic Acid–Antioxidant PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether gallic-acid-derived functionality can be structurally incorporated into PET to enable persistent antioxidant behavior without leaching.",
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
            Gallic Acid–Antioxidant PET
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether gallic-acid-derived
            antioxidant functionality can be structurally incorporated into PET
            to provide persistent oxidative resistance without reliance on
            migrating additives.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of embedding gallic-acid-
            derived antioxidant functionality into polyethylene terephthalate
            (PET). The governing constraint is photochemical and functional
            retention. Antioxidant behavior is admissible only if it persists
            after oxidative and UV stress without measurable loss of activity.
          </p>
          <p className="leading-8 text-neutral-700">
            If antioxidant capacity degrades or depends on extractable species,
            the system fails as an anchored antioxidant material and reverts to
            additive-dependent performance.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Oxidative degradation affects both packaged contents and the
            packaging material itself, limiting shelf life and stability in food,
            medical, and chemical storage systems.
          </p>
          <p className="leading-8 text-neutral-700">
            Conventional antioxidant strategies rely on blended additives that
            migrate, deplete, or degrade over time, creating variability and
            potential exposure concerns.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally anchored antioxidant system offers a potential route
            to persistent oxidative protection without reliance on mobile
            chemistry.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Incorporating gallic-acid-derived aromatic diacids into PET during
            polymerization may enable intrinsic antioxidant behavior through
            retained phenolic functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if antioxidant activity persists
            after UV and oxidative stress and is not dependent on leaching or
            degradable components.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Gallic-acid-derived monomers are introduced during PET
            polycondensation at low molar fractions. The objective is to embed
            antioxidant-capable functionality directly into the polymer network
            while preserving processability and material integrity.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It assumes no benefit
            unless functional retention and activity persistence are
            demonstrated under stress.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if antioxidant activity decreases after UV
            exposure or if functional groups degrade or become inactive.
          </p>
          <p className="leading-8 text-neutral-700">
            Loss of activity indicates that oxidative protection is not
            structurally retained and cannot be treated as a durable material
            property.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            UV exposure for 72 hours is used as the governing stress condition,
            followed by DPPH antioxidant assay to quantify retained activity.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> measurable loss of antioxidant activity after
            exposure.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> antioxidant activity persists with no
            evidence of functional degradation or reliance on extractable
            species.
          </p>
          <p className="leading-8 text-neutral-700">
            This test defines functional persistence, not peak activity.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, gallic-acid-modified PET may provide intrinsic
            antioxidant protection, extending shelf life and improving material
            stability in packaging systems.
          </p>
          <p className="leading-8 text-neutral-700">
            This could reduce reliance on additive-based stabilization and
            decrease migration-related risks.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if activity does not
            persist after stress.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim validated antioxidant performance across
            all conditions, regulatory approval for food or medical use,
            toxicological clearance, or manufacturability at scale.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which antioxidant functionality becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Gallic-acid–modified PET is admissible only if antioxidant activity
            persists after UV and oxidative stress as a function of retained
            structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If activity degrades, the concept fails as a durable antioxidant
            system. If persistence holds, it becomes a viable candidate for
            stability-critical packaging applications.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Antioxidant function is admissible only if it survives exposure.
          </p>
          <p className="mt-2 text-neutral-600">
            If activity degrades under light or oxidation, it does not belong to
            the material.
          </p>
        </section>
      </article>
    </main>
  );
}
