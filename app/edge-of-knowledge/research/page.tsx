// app/edge-of-knowledge/research/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Knowledge — Research Index | Moral Clarity AI",
  description:
    "A public research index exploring failure, uncertainty, and responsible action where optimization and certainty break down.",
  openGraph: {
    title: "Edge of Knowledge — Research Index",
    description:
      "Public research on failure modes, uncertainty, and responsible action beyond certainty.",
    url: "https://moralclarity.ai/edge-of-knowledge/research",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EdgeOfKnowledgeIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Edge of Knowledge</h1>

        <p className="lead">
          <strong>
            Research on failure, uncertainty, and responsible action where
            optimization breaks
          </strong>
        </p>

        <p>
          <em>Edge of Knowledge</em> is a public research series examining how
          systems fail when assumptions quietly collapse, incentives misalign,
          and certainty becomes dangerous. These documents are not product
          proposals, investment theses, or policy mandates. They are
          regime-bounded analyses intended to clarify limits, surface risk, and
          govern action where traditional optimization no longer applies.
        </p>

        <hr />

        <h2>I. Doctrine — Governing Action Under Uncertainty</h2>

        <ul>
          <li>
            <Link href="/edge-of-knowledge">
              Governing Action at the Edge of Knowledge
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Foundational doctrine for responsible intelligence when certainty breaks
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/epistemic-lock-in">
              Epistemic Lock-In After Risk Acknowledgment
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              When recognized risk fails to reframe understanding
            </span>
          </li>
        </ul>

        <h2>II. Governance-Driven Failure Modes</h2>

        <p>
          These papers examine failures that arise after risk is recognized,
          signaling is sufficient, and capability exists—but governance logic
          itself prevents timely or proportionate action.
        </p>

        <ul>
          <li>
            <Link href="/edge-of-knowledge/procedural-entrenchment">
              Procedural Entrenchment
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Governance inertia after risk recognition due to procedural rigidity
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/action-threshold-collapse">
              Action Threshold Collapse
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              When all available interventions produce greater harm than inaction
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/fragmented-responsibility-disjunction">
              Fragmented Responsibility Disjunction
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              When recognized risk fails to produce action due to fragmented authority
            </span>
          </li>
        </ul>

        <h2>III. Failure Visibility & Accountability</h2>

        <ul>
          <li>
            <Link href="/edge-of-knowledge/quiet-failure">
              Materials That Quietly Prevent Failure
            </Link>
          </li>

          <li>
            <Link href="/edge-of-knowledge/neglect-impossible">
              Materials That Make Neglect Impossible
            </Link>
          </li>

          <li>
            <Link href="/edge-of-knowledge/irreversible-infrastructure-exposure-marker">
              Irreversible Infrastructure Exposure Marker
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Infrastructure states that permanently surface neglect, misuse, or deferred responsibility
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/phase-locked-wear-surfaces">
              Phase-Locked Wear Surfaces
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Irreversible, physically encoded wear patterns that record maintenance sequence and adherence
            </span>
          </li>

          <li>
            <Link href="/material-encoded-truth">
              Material-Encoded Truth
            </Link>
          </li>

          <li>
            <Link href="/edge-of-knowledge/intrinsic-cognitive-drift-materials">
              Intrinsic Cognitive-Drift Signaling Materials
            </Link>
          </li>

          <li>
            <Link href="/edge-of-knowledge/signaling-before-failure">
              Signaling Before Failure
            </Link>
          </li>

          <li>
            <Link href="/edge-of-knowledge/thermal-indicator-paint">
              Thermal Indicator Paint for Food Safety
            </Link>
          </li>
        </ul>

        <h2>IV. Boundary Research — Physically Allowed, Non-Scalable</h2>

        <ul>
          <li>
            <Link href="/edge-of-knowledge/damage-activated-nitrogen-fixation">
              Damage-Activated Nitrogen Fixation
            </Link>
          </li>

          <li>
            <Link href="/edge-of-knowledge/salt-gradient-desalination-wick">
              Salt-Gradient Desalination Wick
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              NO-GO — membrane-free passive desalination falsified by thermodynamics
            </span>
          </li>
        </ul>

        <h2>V. Validation-First Materials Exploration</h2>

        <ul>
          <li>
            <Link href="/edge-of-knowledge/polymer-discovery-validation">
              Polymer Discovery (Validation-First, Non-Inventive)
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Regime-bounded mapping of cost-accessible polymer architectures using commodity materials
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/semi-ipn-polyolefin-tpe">
              Semi-Interpenetrating Network (Semi-IPN) of Polyolefin &amp; Elastomer
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Physically interlocked polyolefin–elastomer architectures for fatigue and impact durability
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/mineral-filled-polyolefin-barrier-films">
              Mineral-Filled Polyolefin Barrier Films
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tuned permeability and mechanical response using commodity mineral fillers
            </span>
          </li>
        </ul>

        <h2>VI. Operational Drift &amp; Degradation</h2>

        <ul>
          <li>
            <Link href="/edge-of-knowledge/maintenance-drift-and-degradation-dynamics">
              Maintenance Drift and Degradation Dynamics in Operational Systems
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Cumulative, slow degradation arising between validation and overt failure
            </span>
          </li>
        </ul>

        <hr />

        <p className="text-sm text-muted-foreground">
          Edge of Knowledge is a public research series. Documents are updated
          only by explicit revision and remain accessible for epistemic continuity.
        </p>
      </article>
    </main>
  );
}
