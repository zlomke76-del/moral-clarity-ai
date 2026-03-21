// app/whitepapers/ionic-liquid-antistatic-pet/page.tsx
// ============================================================
// WHITE PAPER
// Ionic Liquid–Mimic Antistatic PET
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ionic Liquid–Mimic Antistatic PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether ionic-liquid-mimic functionality can be structurally incorporated into PET to enable durable antistatic behavior without leaching.",
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
            Ionic Liquid–Mimic Antistatic PET
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether ionic-liquid-like
            functionality can be covalently incorporated into PET to provide
            persistent antistatic behavior without reliance on migrating or
            consumable additives.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of embedding ionic-liquid-
            mimic functionality into polyethylene terephthalate (PET) to enable
            intrinsic surface conductivity. The governing constraint is
            conductivity persistence. Antistatic behavior is admissible only if
            conductivity remains stable after environmental cycling and
            extraction stress.
          </p>
          <p className="leading-8 text-neutral-700">
            If conductivity depends on extractable species or degrades under
            use conditions, the system fails as an anchored antistatic material
            and reverts to additive-dependent behavior.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Electrostatic buildup presents risks in electronics manufacturing,
            filtration systems, and medical environments. Charge accumulation
            can lead to device failure, contamination attraction, and safety
            hazards.
          </p>
          <p className="leading-8 text-neutral-700">
            Conventional antistatic solutions rely on additives or surface
            treatments that migrate, wear off, or degrade over time, reducing
            long-term reliability.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally anchored ionic system offers a potential route to
            stable conductivity without depletion or migration.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Incorporating ionic-liquid-mimic diacid or diol monomers into PET
            during polymerization may create fixed ionic pathways that enable
            persistent surface conductivity.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if conductivity remains stable after
            repeated environmental exposure and is not dependent on mobile ionic
            species.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Ionic-liquid-like functional groups are introduced into PET via
            copolymerization at low molar fractions. The objective is to embed
            ionic conductivity directly into the polymer structure while
            preserving mechanical and processing properties.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It assumes no
            antistatic benefit unless conductivity persists under stress.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if surface conductivity decreases beyond threshold
            under repeated cycling or if ionic functionality is lost due to
            extraction or degradation.
          </p>
          <p className="leading-8 text-neutral-700">
            Loss of conductivity indicates that antistatic behavior is not
            structurally retained and cannot be treated as a durable material
            property.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Multi-cycle surface conductivity measurements are performed in
            combination with extraction testing to evaluate persistence of
            ionic functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> greater than 10% reduction in conductivity
            after cycling and extraction.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> conductivity remains within 90% of baseline
            with no evidence of leaching or loss of ionic structure.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines persistence, not maximum conductivity.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, ionic-liquid-mimic PET may provide durable
            antistatic surfaces capable of maintaining conductivity across
            extended use without additive migration.
          </p>
          <p className="leading-8 text-neutral-700">
            This could support applications in electronics handling,
            filtration systems, and contamination-sensitive environments.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if conductivity does
            not persist under stress.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim validated conductivity performance across
            all environments, regulatory approval, manufacturability at scale,
            or superiority over existing antistatic technologies.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which durable antistatic behavior becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Ionic-liquid-mimic PET is admissible only if conductivity persists
            after environmental cycling and extraction as a function of retained
            structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If conductivity degrades or depends on extractable species, the
            concept fails as a durable antistatic system. If persistence holds,
            it becomes a viable candidate for long-life antistatic materials.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Antistatic behavior is admissible only if conductivity persists.
          </p>
          <p className="mt-2 text-neutral-600">
            If charge control degrades with use, it does not belong to the
            material.
          </p>
        </section>
      </article>
    </main>
  );
}
