// app/whitepapers/epoxy-modified-pet/page.tsx
// ============================================================
// WHITE PAPER
// Epoxy-Modified PET (Epoxy Diacid Copolymer)
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Epoxy-Modified PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether epoxy-functional diacids can be structurally incorporated into PET to enable durable adhesion and barrier enhancement without functional loss.",
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
            Epoxy-Modified PET (Epoxy Diacid Copolymer)
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether epoxy-functional
            diacids can be structurally incorporated into PET to enable
            persistent adhesion and barrier enhancement without reliance on
            reactive additives or post-processing treatments.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of incorporating epoxy-bearing
            functionality into polyethylene terephthalate (PET) as a route to
            enhanced adhesion and reduced permeability. The governing constraint
            is retention under chemical stress. Functional improvement is
            admissible only if epoxy-derived structure remains intact after
            hydrolytic exposure.
          </p>
          <p className="leading-8 text-neutral-700">
            If epoxy functionality is lost or degraded under acid conditions,
            the system fails as a structurally enhanced material and reverts to
            baseline or additive-dependent behavior.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            PET is widely used in films, packaging, and structural components,
            but its adhesion and barrier performance can be limited in demanding
            environments. Conventional improvements rely on coatings, adhesives,
            or multilayer constructions.
          </p>
          <p className="leading-8 text-neutral-700">
            These approaches introduce added complexity, potential delamination,
            and failure pathways under chemical or environmental stress.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally modified PET incorporating reactive functionality
            offers a potential route to intrinsic performance improvement without
            external systems.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Incorporating glycidyl (epoxy-bearing) diacids into PET during
            polymerization may enable enhanced interfacial bonding and reduced
            permeability through retained reactive sites within the polymer
            structure.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if epoxy functionality survives
            hydrolytic stress and remains part of the material structure rather
            than degrading or becoming inactive.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Glycidyl-functional diacids are introduced during PET
            polycondensation at low molar fractions. The objective is to embed
            epoxy functionality directly into the polymer network while
            preserving processability and baseline material performance.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It assumes no benefit
            unless retention and functional survivability are demonstrated.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if epoxy functionality is lost or degraded under
            hydrolytic conditions, as indicated by measurable reduction in
            retained functional groups.
          </p>
          <p className="leading-8 text-neutral-700">
            Functional loss indicates that adhesion or barrier improvements are
            not structurally supported and cannot be treated as durable
            properties.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Acid hydrolysis in 1M HCl for 24 hours is used as the governing
            stress condition, followed by quantitative analysis of retained
            epoxy functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> less than 90% epoxy retention after
            hydrolysis.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> at least 90% retention of epoxy functionality,
            indicating structural survivability under chemical stress.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines persistence, not peak performance.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, epoxy-modified PET may enable improved adhesion
            to adjacent materials and reduced permeability in films and
            containers, contributing to longer service life and reduced material
            failure.
          </p>
          <p className="leading-8 text-neutral-700">
            These improvements are conditional and invalid if the retention
            requirement fails.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim validated barrier performance across all
            conditions, adhesion superiority in all systems, regulatory approval,
            manufacturability at scale, or replacement of existing multilayer
            solutions.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which adhesion and barrier improvements become materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Epoxy-modified PET is admissible only if epoxy functionality
            survives hydrolytic stress as part of the material structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If retention falls below threshold, the concept fails as a durable
            structural enhancement. If retention holds, it becomes a viable
            candidate for adhesion-critical and barrier-sensitive applications.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Adhesion and barrier performance are admissible only if the
            functional structure survives chemistry.
          </p>
          <p className="mt-2 text-neutral-600">
            If the reactive group does not persist, the improvement does not
            belong to the material.
          </p>
        </section>
      </article>
    </main>
  );
}
