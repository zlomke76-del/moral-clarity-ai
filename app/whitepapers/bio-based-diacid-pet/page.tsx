// app/whitepapers/bio-based-diacid-pet/page.tsx
// ============================================================
// WHITE PAPER
// Bio-Based Diacid PET Copolymer (FDCA)
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bio-Based Diacid PET Copolymer (FDCA) | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether FDCA can be durably incorporated into PET as a renewable diacid substitution without losing structural retention.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <article className="space-y-10">
        <header className="space-y-4 border-b pb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
            White Paper · Anchored PET Candidate
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Bio-Based Diacid PET Copolymer (FDCA)
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether
            2,5-furandicarboxylic acid (FDCA) can serve as a structurally
            retained renewable diacid within PET, reducing fossil feedstock
            dependence without compromising material integrity.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper examines the admissibility of incorporating
            2,5-furandicarboxylic acid (FDCA) into polyethylene terephthalate
            (PET) as a renewable diacid substitution strategy. The central
            question is not whether FDCA is chemically compatible in principle,
            but whether it remains structurally retained after processing and
            extraction stress.
          </p>
          <p className="leading-8 text-neutral-700">
            The governing condition is persistence. If the furan-bearing
            structure is not materially retained, then the renewable substitution
            claim weakens from structural incorporation to incomplete or unstable
            modification.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Conventional PET relies on terephthalic acid derived largely from
            petroleum-based feedstocks. This creates an upstream dependence on
            fossil carbon even where downstream material performance is strong.
          </p>
          <p className="leading-8 text-neutral-700">
            FDCA offers a bio-derived aromatic diacid candidate with meaningful
            structural similarity, making it one of the clearest routes toward a
            lower-fossil PET architecture. The key issue is whether that
            substitution behaves as a durable component of the polymer rather
            than a nominal or unstable inclusion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Controlled co-condensation of FDCA into PET may produce a
            partially renewable polyester system while preserving the structural
            continuity required for practical use.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if FDCA-derived furan units remain
            incorporated as part of the material structure after extraction and
            analytical challenge.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            FDCA is introduced during PET polycondensation at controlled molar
            fractions as a co-diacid component. The objective is not novelty for
            its own sake, but renewable substitution through direct structural
            integration.
          </p>
          <p className="leading-8 text-neutral-700">
            The strategy is framed as a bounded copolymer hypothesis: if FDCA
            becomes part of the chain architecture in a retained and measurable
            way, then the renewable-content claim gains structural legitimacy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if FDCA-derived furan content is not retained at
            sufficiently high levels after extraction, indicating incomplete,
            unstable, or non-durable incorporation.
          </p>
          <p className="leading-8 text-neutral-700">
            In that case, the material cannot be treated as a structurally
            credible renewable PET copolymer.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Soxhlet extraction is used as the governing stress condition,
            followed by nuclear magnetic resonance (NMR) analysis to quantify
            furan-ring retention.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> less than 90% furan-ring retention after
            extraction.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> at least 90% furan-ring retention with no
            evidence that the renewable structural contribution is materially
            unstable.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold is a survivability gate, not a marketing metric.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, FDCA-PET may provide a credible route to
            partially or potentially more fully renewable polyester systems
            without abandoning the PET processing logic already familiar to
            industry.
          </p>
          <p className="leading-8 text-neutral-700">
            The projected value is upstream carbon displacement through durable
            structural substitution, not symbolic bio-content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim lifecycle validation, full carbon
            accounting, recyclability superiority, commercial readiness, or
            performance equivalence across all PET use cases.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which its renewable substitution claim becomes materially credible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            FDCA-PET is meaningful only if the furan-bearing renewable structure
            survives extraction as part of the polymer itself.
          </p>
          <p className="leading-8 text-neutral-700">
            If retention falls below threshold, the concept fails as a durable
            renewable copolymer claim. If retention holds, it becomes a credible
            candidate for lower-fossil polyester supply chains.
          </p>
        </section>

        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Renewable substitution is admissible only if it remains part of the
            material.
          </p>
          <p className="mt-2 text-neutral-600">
            If the structural contribution does not survive extraction, the
            sustainability claim has not been materially secured.
          </p>
        </section>
      </article>
    </main>
  );
}
