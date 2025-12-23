import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Extended Cycle Experiments | Moral Clarity AI",
  description:
    "Experiments promoted from short-cycle validation into extended testing where time, repetition, and environmental cycling become the dominant variables.",
  openGraph: {
    title: "Edge of Practice — Extended Cycle Experiments",
    description:
      "Experiments that survived short-cycle falsification and now test durability, fatigue, and slow failure modes.",
    url: "https://moralclarity.ai/edge-of-practice/extended-cycle",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EdgeOfPracticeExtendedCyclePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Edge of Practice — Extended Cycle</h1>

        <p className="lead">
          <strong>
            Experiments that earned time
          </strong>
        </p>

        <p>
          <em>Extended Cycle</em> experiments are promoted from{" "}
          <Link href="/edge-of-practice">Edge of Practice (Short-Cycle)</Link>{" "}
          after surviving initial falsification. These experiments do not ask
          new questions—they test whether the same assumptions fail under
          repetition, fatigue, or environmental cycling.
        </p>

        <p>
          Entry into this index is gated. An experiment must demonstrate that
          rapid failure modes have been ruled out and that time itself is now
          the dominant variable.
        </p>

        <hr />

        <h2>Qualification Criteria</h2>

        <ul>
          <li>Short-cycle failure conditions explicitly passed</li>
          <li>New failure modes require repetition or duration</li>
          <li>No chemistry, coatings, or proprietary tools introduced</li>
          <li>Still binary: pass or fail</li>
        </ul>

        <hr />

        <h2>Extended Cycle Candidates</h2>

        <ul>
          <li>
            <Link href="/edge-of-practice/pc-abs-interfacial-microdamping">
              Interfacial Micro-Damping in Layered PC/ABS Structures
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Fatigue resistance under repeated mechanical cycling
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/hdpe-ldpe-interfacial-toughening">
              Interfacial Toughening in HDPE via Dispersed LDPE Domains
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Toughness evolution under repeated loading and fracture
            </span>
          </li>

          <li>
            <Link href="/edge-of-practice/pc-pmma-scratch-resistance">
              Scratch Resistance from Physical PMMA Dispersion in Polycarbonate
            </Link>
            <br />
            <span className="text-sm text-muted-foreground">
              Abrasion resistance under repeated wear
            </span>
          </li>
        </ul>

        <hr />

        <h2>Governance</h2>

        <p>
          Extended Cycle experiments remain falsification-first. Survival does
          not imply usefulness, safety, or permanence—only that time has not
          yet broken the assumption.
        </p>

        <p className="text-sm text-muted-foreground">
          Promotion to Persistence requires explicit documentation of extended
          survival and identification of slow, irreversible failure modes.
        </p>
      </article>
    </main>
  );
}
