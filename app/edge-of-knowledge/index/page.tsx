// app/edge-of-knowledge/index/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Knowledge — Research Index | Moral Clarity AI",
  description:
    "An index of public research notes and white papers exploring failure, uncertainty, and governance at the limits of knowledge.",
  openGraph: {
    title: "Edge of Knowledge — Research Index",
    description:
      "Research notes examining failure modes, uncertainty, and responsible action beyond certainty.",
    url: "https://moralclarity.ai/edge-of-knowledge/index",
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
            Research notes on failure, uncertainty, and responsible action beyond certainty
          </strong>
        </p>

        <p>
          This index collects public research notes associated with the{" "}
          <em>Edge of Knowledge</em> doctrine. These documents explore how systems
          fail quietly, how risk becomes normalized, and how responsibility must
          shift when certainty breaks.
        </p>

        <p>
          Each paper is regime-bounded, falsifiable, and written to stand alone.
          They are not product documentation or policy statements.
        </p>

        <h2>Doctrine</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge">
              Governing Action at the Edge of Knowledge
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Foundational doctrine for responsible intelligence under uncertainty
            </span>
          </li>
        </ul>

        <h2>Research Notes</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge/quiet-failure">
              Quiet Failure
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              How systems degrade silently before catastrophic breakdown
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/signaling-before-failure">
              Signaling Before Failure
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Physical and informational signals that precede collapse
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/neglect-impossible">
              Neglect-Impossible Systems
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Designing systems where neglect becomes unignorable
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/intrinsic-cognitive-drift-materials">
              Intrinsic Cognitive Drift Materials
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Materials that encode misuse, drift, or cumulative exposure
            </span>
          </li>

          <li>
            <Link href="/edge-of-knowledge/damage-activated-nitrogen-fixation">
              Damage-Activated Nitrogen Fixation
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Environmental response systems triggered by physical harm
            </span>
          </li>
        </ul>

        <hr />

        <p className="text-sm text-muted-foreground">
          Edge of Knowledge is a public research series. Documents are updated
          only by explicit revision and remain accessible for historical reference.
        </p>
      </article>
    </main>
  );
}
