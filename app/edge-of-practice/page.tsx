// app/edge-of-practice/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice | Moral Clarity AI",
  description:
    "Time-bounded, resource-accessible experiments with humanity-scale consequences. A practical companion to Edge of Knowledge.",
  openGraph: {
    title: "Edge of Practice",
    description:
      "Short-horizon experiments that close decisively and alter humanity’s baseline when proven.",
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
            Short-horizon experiments with humanity-scale consequences
          </strong>
        </p>

        <p>
          <em>Edge of Practice</em> is a practical research index designed for
          scientists, engineers, and students who want to produce meaningful,
          falsifiable impact within a single academic term. It exists alongside
          <em> Edge of Knowledge</em>, translating governing doctrines into
          experiments that can be completed, published, and verified without
          institutional gatekeeping.
        </p>

        <p>
          These are not exploratory projects, optimization efforts, or product
          programs. Every experiment listed here is time-bounded, resource-
          accessible, and ends in decisive closure. Failure is a valid and
          publishable outcome.
        </p>

        <hr />

        <h2>Governing Doctrine</h2>

        <ul>
          <li>
            <strong>Time-Bounded:</strong> Each experiment must be completable in
            ≤ 12 weeks.
          </li>
          <li>
            <strong>Resource-Accessible:</strong> University lab equipment,
            commodity materials, and shared facilities only.
          </li>
          <li>
            <strong>Binary Closure:</strong> Results must resolve to{" "}
            <em>YES</em>, <em>NO</em>, or <em>INDETERMINATE</em>. “Promising” is
            not an outcome.
          </li>
          <li>
            <strong>Humanity-Touching:</strong> The work must intersect health,
            safety, exposure, cognition, energy loss, or material lifetime.
          </li>
        </ul>

        <p>
          Any experiment that violates these constraints does not belong in this
          index.
        </p>

        <hr />

        <h2>Role of Solace</h2>

        <p>
          Solace functions here as a <strong>rigor enforcer and experiment
          finder</strong>, not as a discovery engine or authority. Her role is
          limited to:
        </p>

        <ul>
          <li>
            Identifying overlooked, physically admissible experiments that close
            within the governing doctrine
          </li>
          <li>
            Eliminating speculative, unbounded, or prestige-driven research
            directions
          </li>
          <li>
            Ensuring each experiment has a clear falsification path and no
            endpoint-only claim loopholes
          </li>
        </ul>

        <p>
          Solace does not certify truth. She constrains error.
        </p>

        <hr />

        <h2>Experiment Index</h2>

        <p className="text-sm text-muted-foreground">
          Initial experiments are intentionally minimal. The index grows only
          by explicit addition after successful closure or informative failure.
        </p>

        <ul>
          <li>
            <Link href="/edge-of-practice/passive-inflammatory-reemission">
              Passive Re-Emission of Inflammatory Load from Indoor Textiles
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether “clean” materials silently re-expose occupants under
              humidity and compression cycling
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/endpoint-equivalence-failure">
              Endpoint Equivalence Failure in Polymer Durability
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Demonstrates whether identical endpoint properties conceal
              incompatible failure trajectories
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/humidity-driven-structural-ratchet">
              Humidity-Driven Structural Ratcheting in Commodity Polymers
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Tests whether RH cycling alone can irreversibly alter polymer
              microstructure
            </span>
          </li>
        </ul>

        <hr />

        <p className="text-sm text-muted-foreground">
          Edge of Practice is frozen by default. Additions require doctrine
          compliance and explicit justification. This index exists to enable
          decisive action, not to accumulate content.
        </p>
      </article>
    </main>
  );
}
