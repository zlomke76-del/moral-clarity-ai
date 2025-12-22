// app/edge-of-practice/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Short-Cycle Experiments | Moral Clarity AI",
  description:
    "A public index of short-cycle, falsifiable experiments designed to test hidden assumptions governing health, materials, and everyday human environments.",
  openGraph: {
    title: "Edge of Practice — Short-Cycle Experiments",
    description:
      "Executable experiments that surface hidden assumptions with direct human relevance.",
    url: "https://moralclarity.ai/edge-of-practice",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EdgeOfPracticeIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Edge of Practice</h1>

        <p className="lead">
          <strong>
            Short-cycle experiments that break false assumptions at human scale
          </strong>
        </p>

        <p>
          <em>Edge of Practice</em> is a public index of small, decisive
          experiments that can be executed using standard laboratory tools,
          commodity materials, and short timelines. These experiments are not
          designed to optimize systems or invent products. They exist to test
          hidden assumptions that quietly govern health, safety, materials use,
          and daily human environments.
        </p>

        <p>
          Each experiment is intentionally bounded: it asks one precise
          question, defines a minimal setup, and specifies a binary failure
          condition. If the assumption fails, it fails cleanly. No extrapolation
          is implied.
        </p>

        <hr />

        <h2>Founding Principle</h2>

        <p>
          <em>Edge of Practice</em> sits downstream of{" "}
          <Link href="/edge-of-knowledge">Edge of Knowledge</Link>.
          Where Edge of Knowledge governs the limits of certainty, Edge of
          Practice governs where action can begin anyway—carefully, humbly, and
          with full epistemic accountability.
        </p>

        <ul>
          <li>Weeks, not years</li>
          <li>Binary outcomes, not gradients</li>
          <li>Human relevance without extrapolation</li>
          <li>No proprietary tools or methods</li>
          <li>Failure is as valuable as success</li>
        </ul>

        <hr />

        <h2>Founding Experiments</h2>

        <ul>
          <li>
            <Link href="/edge-of-practice/viral-viability-indoor-surfaces">
              Longevity of Viral Viability on Common Indoor Surfaces
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether surface-deposited viruses lose infectivity as quickly
              as commonly assumed
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/sweat-induced-metal-corrosion">
              Acceleration of Device Metal Corrosion Due to Human Sweat and Skin Oils
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Evaluates real-world corrosion under normal human handling
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/vitamin-loss-refrigerated-juice">
              Vitamin Content Loss in Home-Stored Fresh Juices
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Measures nutritional degradation under typical refrigeration
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/compostable-plastic-residue">
              Residual Microfragments from “Compostable” Packaging
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether compostable plastics fully degrade in home compost
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/cleaning-resistance-gene-transfer">
              Antibiotic Resistance Gene Spread After Household Cleaning
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Examines unintended microbial selection effects of cleaning
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/lighting-circadian-gene-expression">
              Indoor Lighting Spectra and Circadian Gene Expression
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests biological neutrality of common indoor lighting
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/uv-shadow-pathogen-survival">
              Pathogen Persistence in UV-Sterilized Equipment Shadows
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Identifies hidden sterilization failure zones
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/hot-water-pH-metal-leaching">
              Effect of Hot Water pH on Plumbing Metal Leaching
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests heavy metal exposure under realistic household conditions
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/air-ionizer-static-risk">
              Air Ionizer Effects on Electrostatic Charge Buildup
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Evaluates unintended ESD risks from ionization
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/glove-additive-leaching">
              Lab Glove Additive Leaching After Sanitizer Exposure
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests chemical integrity of gloves under real use
            </span>
          </li>
        </ul>

        <hr />

        <h2>Governance</h2>

        <p>
          Edge of Practice does not claim solutions, policy outcomes, or product
          relevance. Its sole function is to surface reality where assumptions
          dominate behavior. Any downstream application must be independently
          justified and revalidated.
        </p>

        <p className="text-sm text-muted-foreground">
          Edge of Practice is a public research index. Experiments are fixed at
          publication and revised only by explicit versioning to preserve
          epistemic continuity.
        </p>
      </article>
    </main>
  );
}
