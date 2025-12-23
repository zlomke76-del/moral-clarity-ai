import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Persistence Experiments | Moral Clarity AI",
  description:
    "Experiments examining whether assumptions remain valid over long timescales where degradation, drift, and cumulative exposure dominate.",
  openGraph: {
    title: "Edge of Practice — Persistence Experiments",
    description:
      "Long-duration assumption stress tests where time itself becomes the mechanism.",
    url: "https://moralclarity.ai/edge-of-practice/persistence",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EdgeOfPracticePersistencePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Edge of Practice — Persistence</h1>

        <p className="lead">
          <strong>
            Where time is the mechanism
          </strong>
        </p>

        <p>
          <em>Persistence</em> experiments are promoted exclusively from{" "}
          <Link href="/edge-of-practice/extended-cycle">Extended Cycle</Link>{" "}
          after surviving repeated stress without collapse. These experiments
          examine assumptions society treats as effectively permanent.
        </p>

        <p>
          Acceleration is limited. Where acceleration invalidates physics,
          early-warning indicators are used instead of endpoints.
        </p>

        <hr />

        <h2>Qualification Criteria</h2>

        <ul>
          <li>Extended Cycle survival without hidden degradation</li>
          <li>Failure modes unfold only over long durations</li>
          <li>Early indicators clearly defined</li>
          <li>No speculative extrapolation</li>
        </ul>

        <hr />

        <h2>Persistence Experiments</h2>

        <ul>
          <li>
            <Link href="/edge-of-practice/microplastics-dynamic-chemistry">
              Microplastics as Dynamic Chemical Agents
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Long-term chemical interaction with water and sediment
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/heavy-metal-remobilization-urban-soils">
              Heavy Metal Stability in Ordinary Urban Environments
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Gradual remobilization under repeated rainfall cycles
            </span>
          </li>
        </ul>

        <hr />

        <h2>Governance</h2>

        <p>
          Persistence does not imply inevitability or catastrophe. It exists to
          detect slow failure where absence of evidence is routinely mistaken
          for evidence of safety.
        </p>

        <p className="text-sm text-muted-foreground">
          Experiments in this index are immutable once published. Revisions
          require explicit versioning and rationale.
        </p>
      </article>
    </main>
  );
}
