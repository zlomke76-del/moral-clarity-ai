// app/edge-of-knowledge/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edge of Knowledge | Governing Action Under Uncertainty",
  description:
    "A public doctrine for governing human and artificial action when assumptions break, confidence exceeds validity, and uncertainty becomes dominant.",
  openGraph: {
    title: "Edge of Knowledge",
    description:
      "A doctrine for governing action when certainty breaks.",
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
            Governing action when certainty breaks and confidence becomes unsafe
          </strong>
        </p>

        <h2>Purpose</h2>
        <p>
          The Edge of Knowledge defines how intelligent systems—human or
          artificial—should behave when assumptions no longer hold, models lose
          validity, and uncertainty becomes dominant. It is not a specification,
          product, or optimization framework. It is a doctrine for restraint,
          detectability, and survivability under epistemic stress.
        </p>

        <p>
          This series exists to prevent the most common catastrophic failure
          mode: acting with unjustified confidence outside the regime where
          reasoning remains valid.
        </p>

        <h2>What This Is (and Is Not)</h2>
        <ul>
          <li>
            <strong>This is:</strong> a framework for recognizing regime exit,
            governing authority, and constraining action under uncertainty.
          </li>
          <li>
            <strong>This is not:</strong> an engineering playbook, a proposal
            for new technology, or an optimization strategy.
          </li>
          <li>
            <strong>This is not:</strong> about intelligence expansion, speed,
            or performance.
          </li>
        </ul>

        <h2>Core Thesis</h2>
        <p>
          Most real-world failures are not caused by lack of intelligence or
          data. They arise when systems continue to act confidently after their
          assumptions have quietly failed.
        </p>

        <p>
          The Edge of Knowledge is where confidence must yield to constraint.
        </p>

        <h2>Series Structure</h2>

        <h3>Tier A — Foundational Doctrine</h3>
        <ul>
          <li>
            <strong>Edge of Knowledge (this document):</strong> Defines the
            governing problem and ethical stance.
          </li>
        </ul>

        <h3>Tier B — Failure Recognition</h3>
        <ul>
          <li>
            <strong>Quiet Failure:</strong> How systems degrade invisibly while
            appearing stable.
          </li>
          <li>
            <strong>Signaling Before Failure:</strong> Detecting regime exit
            before collapse becomes irreversible.
          </li>
        </ul>

        <h3>Tier C — Conditional Constraints</h3>
        <ul>
          <li>
            <strong>Neglect-Impossible Systems:</strong> When making neglect
            physically unignorable may be justified—and when it must not be.
          </li>
          <li>
            <strong>Intrinsic Cognitive Drift:</strong> Why drift occurs even
            without intent, malice, or error.
          </li>
        </ul>

        <p>
          No document in this series proposes optimization, deployment, or
          enforcement. All mechanisms—if discussed elsewhere—must inherit the
          constraints defined here.
        </p>

        <h2>Audience</h2>
        <ul>
          <li>Engineers working in safety-critical systems</li>
          <li>Researchers confronting model breakdown</li>
          <li>Institutional decision-makers under uncertainty</li>
          <li>Designers of AI governance and oversight systems</li>
        </ul>

        <h2>Ethical Position</h2>
        <p>
          When uncertainty dominates, restraint is not weakness. It is
          responsibility.
        </p>

        <hr />

        <p className="text-sm text-muted-foreground">
          Edge of Knowledge · Foundational Doctrine · Moral Clarity AI
        </p>
      </article>
    </main>
  );
}
