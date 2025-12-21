// app/edge-of-knowledge/index/page.tsx

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
    url: "https://moralclarity.ai/edge-of-knowledge",
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

        <p>
          Each document is written to stand alone, is explicitly falsifiable
          where applicable, and is framed to resist misinterpretation as
          performance enhancement or technological salvation.
        </p>

        <hr />

        <h2>I. Doctrine — Governing Action Under Uncertainty</h2>

        <p>
          These documents establish how intelligent systems—human or
          artificial—should behave when confidence exceeds validity and
          assumptions silently fail.
        </p>

        <ul>
          <li>
            <Link href="/edge-of-knowledge">
              Governing Action at the Edge of Knowledge
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              A foundational doctrine for responsible intelligence when certainty breaks
            </span>
          </li>
        </ul>

        <h2>II. Failure Visibility & Accountability</h2>

        <p>
          These papers examine material and system designs that do not eliminate
          failure, but instead make risk, neglect, degradation, or impending harm
          visible early—before catastrophic outcomes occur.
        </p>

        <ul>
          <li>
            <Link href="/edge-of-knowledge/quiet-failure">
              Materials That Quietly Prevent Failure
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Suppressing failure modes without improving baseline performance
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/neglect-impossible">
              Materials That Make Neglect Impossible
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Eliminating plausible deniability around omission or skipped care
            </span>
          </li>

          <li>
            <Link href="/material-encoded-truth">
              Material-Encoded Truth
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Irreversible physical encoding of cumulative risk and misuse
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/intrinsic-cognitive-drift-materials">
              Intrinsic Cognitive-Drift Signaling Materials
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Passive materials that surface early cognitive erosion without surveillance
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/signaling-before-failure">
              Signaling Before Failure
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Designing materials to warn before biological harm occurs
            </span>
          </li>
        </ul>

        <h2>III. Boundary Research — Physically Allowed, Non-Scalable</h2>

        <p>
          These documents explore hypotheses that are not forbidden by physics,
          but operate at the edge of plausibility. They are explicitly constrained,
          non-scalable, and ethically framed to prevent misuse or overclaiming.
        </p>

        <ul>
          <li>
            <Link href="/edge-of-knowledge/damage-activated-nitrogen-fixation">
              Damage-Activated Nitrogen Fixation
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              A tightly bounded evaluation of marginal nitrogen fixation driven by mechanical damage
            </span>
          </li>
        </ul>

        <hr />

        <p className="text-sm text-muted-foreground">
          Edge of Knowledge is a public research series. Documents are updated
          only by explicit revision and remain accessible for historical and
          epistemic continuity.
        </p>
      </article>
    </main>
  );
}
