// app/newsroom/methodology/page.tsx
// ============================================================
// NEWSROOM METHODOLOGY
// Informative Infrastructure — Non-Authoritative
// ============================================================
// This page describes how Newsroom signals are computed.
// It does not justify conclusions or confer legitimacy.
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsroom Methodology | Moral Clarity AI",
  description:
    "An informative description of how Newsroom signals are mechanically aggregated. Scores are descriptive only and do not assess truth, intent, credibility, or ethics.",
  openGraph: {
    title: "Newsroom Methodology",
    description:
      "How Newsroom signals are calculated — informative only, non-authoritative, and canon-bounded.",
    url: "https://moralclarity.ai/newsroom/methodology",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NewsroomMethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Newsroom Methodology</h1>

        <p className="lead">
          <strong>How Newsroom signals are calculated (informative only)</strong>
        </p>

        <hr />

        {/* PURPOSE */}
        <h2>Purpose</h2>
        <p>
          This page explains how Newsroom scores and signals are generated.
        </p>
        <p>
          It exists to make mechanical signal aggregation visible — not to
          justify conclusions, assign credibility, evaluate truth, or recommend
          belief or action.
        </p>
        <p>
          No score displayed in the Newsroom constitutes a claim about
          correctness, intent, morality, reliability, or trustworthiness.
        </p>

        <hr />

        {/* WHAT SCORES ARE / ARE NOT */}
        <h2>What Newsroom Scores Are — and Are Not</h2>

        <h3>What they are</h3>
        <p>
          Newsroom scores are <strong>descriptive aggregates</strong> derived
          from observable, non-semantic signals present in published news
          content and its update history.
        </p>
        <p>
          They summarize <em>patterns of publication behavior</em>, not the
          meaning, validity, or intent of claims.
        </p>

        <h3>What they are not</h3>
        <p>Newsroom scores are not:</p>
        <ul>
          <li>Judgments of truth or falsity</li>
          <li>Rankings of credibility, quality, or trust</li>
          <li>Endorsements or warnings</li>
          <li>Measures of intent, morality, or ethics</li>
          <li>Recommendations for belief or action</li>
        </ul>

        <p>
          No optimization target exists behind the scores.
        </p>

        <hr />

        {/* DESIGN CONSTRAINTS */}
        <h2>Design Constraints (Non-Negotiable)</h2>
        <p>
          The Newsroom scoring system is constrained by the following invariants:
        </p>

        <ul>
          <li>
            <strong>No semantic interpretation</strong> — content meaning is not
            evaluated
          </li>
          <li>
            <strong>No moral weighting</strong> — signals are not ranked by
            virtue, harm, or value
          </li>
          <li>
            <strong>No hidden assumptions</strong> — all contributing signal
            classes are disclosed
          </li>
          <li>
            <strong>No authority emission</strong> — scores do not instruct,
            advise, or recommend
          </li>
          <li>
            <strong>No optimization loop</strong> — the system does not adapt to
            influence outcomes
          </li>
        </ul>

        <hr />

        {/* SIGNAL CLASSES */}
        <h2>Signal Classes Used</h2>
        <p>
          Scores are computed from the presence, frequency, and timing of
          observable publication signals. These include, but are not limited to:
        </p>

        <h3>Publication Structure Signals</h3>
        <ul>
          <li>Article count and publication cadence</li>
          <li>Update and revision frequency</li>
          <li>Correction presence (binary, not qualitative)</li>
          <li>Retraction events and latency</li>
        </ul>

        <h3>Attribution Signals</h3>
        <ul>
          <li>Use of named sources (presence only)</li>
          <li>Citation density</li>
          <li>External reference linking (presence only)</li>
        </ul>

        <h3>Temporal Signals</h3>
        <ul>
          <li>Update timing relative to breaking events</li>
          <li>Revision clustering or delay patterns</li>
        </ul>

        <h3>Cross-Source Signals</h3>
        <ul>
          <li>Divergence and convergence patterns across outlets</li>
          <li>Story persistence or decay over time</li>
        </ul>

        <h3>Editorial Surface Signals</h3>
        <ul>
          <li>Headline volatility</li>
          <li>Structural consistency across updates</li>
        </ul>

        <p>
          No signal is interpreted as “good” or “bad.” Signals are counted, not
          judged.
        </p>

        <hr />

        {/* STRUCTURAL ASYMMETRY */}
        <h2>Structural Asymmetry Signals (Commonly Described as Bias)</h2>
        <p>
          Some Newsroom signals surface <strong>structural asymmetries</strong>{" "}
          in publication behavior that are commonly labeled as “bias” in public
          discourse.
        </p>
        <p>
          In Newsroom, these signals are treated strictly as{" "}
          <em>observable structural patterns</em>, not as indicators of intent,
          ideology, or ethics.
        </p>

        <ul>
          <li>
            <strong>Structural Directionality</strong> — persistence of
            directional coverage patterns over time
          </li>
          <li>
            <strong>Linguistic Polarity Density</strong> — frequency of
            high-polarity language tokens without semantic interpretation
          </li>
          <li>
            <strong>Source Concentration Pattern</strong> — recurrence and
            diversity of cited sources, without credibility assessment
          </li>
          <li>
            <strong>Framing Persistence Signal</strong> — repeated structural
            framing patterns across related coverage
          </li>
          <li>
            <strong>Contextual Inclusion Variance</strong> — variance in
            contextual elements included or omitted across comparable events
          </li>
        </ul>

        <p>
          These signals describe structure, not motive. They do not imply
          correctness, fault, or trustworthiness.
        </p>

        <hr />

        {/* SCORE INTERPRETATION */}
        <h2>What a Higher or Lower Score Means</h2>
        <p>
          A higher or lower score reflects only a difference in the aggregate
          configuration of observable signals.
        </p>
        <p>It does not imply:</p>
        <ul>
          <li>Higher accuracy</li>
          <li>Greater reliability</li>
          <li>Better or worse journalism</li>
          <li>Malicious or benevolent intent</li>
        </ul>

        <p>
          Scores are comparative descriptors, not evaluative measures.
        </p>

        <hr />

        {/* WHY SCORES EXIST */}
        <h2>Why Scores Are Shown At All</h2>
        <p>Scores exist to:</p>
        <ul>
          <li>Make structural patterns visible</li>
          <li>Prevent hidden authority or opaque summarization</li>
          <li>Allow independent scrutiny of aggregation logic</li>
          <li>Reduce reliance on reputation or narrative framing</li>
        </ul>

        <p>
          They are a lens, not a verdict.
        </p>

        <hr />

        {/* REFUSALS */}
        <h2>What Newsroom Refuses to Do</h2>
        <p>The Newsroom explicitly refuses to:</p>
        <ul>
          <li>Rank outlets by trust</li>
          <li>Recommend sources</li>
          <li>Suppress or promote stories</li>
          <li>Collapse signal complexity into moral conclusions</li>
          <li>Replace human judgment</li>
        </ul>

        <p>
          Any system that does so would exceed its legitimacy.
        </p>

        <hr />

        {/* LIMITATIONS */}
        <h2>Known Limitations</h2>
        <ul>
          <li>Scores do not capture truth or falsity</li>
          <li>Scores do not account for context or intent</li>
          <li>Scores may surface neutral or incidental patterns</li>
          <li>Scores can be misinterpreted if treated as authority</li>
        </ul>

        <p>
          Misuse or over-interpretation is a known risk and is not mitigated by
          additional scoring.
        </p>

        <hr />

        {/* INTERPRETATION BOUNDARY */}
        <h2>Interpretation Boundary</h2>
        <p>
          If you find yourself asking:
        </p>
        <blockquote>
          “What should I believe or do based on this score?”
        </blockquote>
        <p>
          You have crossed the intended boundary.
        </p>
        <p>
          The Newsroom provides visibility, not guidance.
        </p>

        <hr />

        {/* REVISION POLICY */}
        <h2>Revision Policy</h2>
        <p>This methodology is:</p>
        <ul>
          <li>Public</li>
          <li>Versioned</li>
          <li>Additive only</li>
        </ul>

        <p>
          Any change to signal classes or aggregation logic is documented and
          historically accessible. Silent edits are prohibited.
        </p>

        <hr />

        {/* STATUS */}
        <h2>Status</h2>
        <ul>
          <li><strong>Status:</strong> Informative infrastructure</li>
          <li><strong>Authority:</strong> None</li>
          <li><strong>Function:</strong> Signal visibility</li>
          <li><strong>Alignment:</strong> Canon-compliant</li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Newsroom Methodology · Canonical · Informative Only · Moral Clarity AI
        </p>
      </article>
    </main>
  );
}
