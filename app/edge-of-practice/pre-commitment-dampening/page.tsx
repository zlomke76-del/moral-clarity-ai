// ------------------------------------------------------------
// Edge of Practice — Design Invariant
// ------------------------------------------------------------
// Title: Pre-Commitment Dampening
//
// Classification:
// - Edge of Practice
// - Design Invariant
// - Refusal Integrity Mechanism
//
// Summary:
// Refusal cannot function as a purely terminal safeguard.
// It must be paired with mechanisms that limit persuasive
// momentum before refusal is required, preserving the
// voluntariness and integrity of refusal itself.
// ------------------------------------------------------------

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Commitment Dampening | Edge of Practice",
  description:
    "A design invariant explaining why refusal must be structurally supported by limits on persuasive buildup before the refusal point.",
};

export default function PreCommitmentDampeningPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* ------------------------------------------------------------
          Header
      ------------------------------------------------------------ */}
      <header className="mb-12">
        <p className="text-sm uppercase tracking-wide text-neutral-500">
          Edge of Practice · Design Invariant
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
          Pre-Commitment Dampening
        </h1>
      </header>

      {/* ------------------------------------------------------------
          Body
      ------------------------------------------------------------ */}
      <article className="prose prose-neutral max-w-none">
        <p>
          Refusal cannot function as a purely terminal safeguard. A system that
          allows unchecked persuasive escalation before the refusal point will
          erode the practical meaning of refusal, even if refusal remains
          formally available.
        </p>

        <p>
          <strong>Pre-commitment dampening</strong> addresses this failure mode
          by limiting the buildup of pressure, persuasion, urgency, or momentum
          before a decision hardens. It ensures that refusal remains freely
          exercisable rather than nominally permitted but functionally impaired.
        </p>

        <h2>Why Terminal Refusal Is Insufficient</h2>

        <p>
          Many systems rely on refusal as a final defense: a right to say no at
          the end of a process. This model fails when the environment leading up
          to refusal is allowed to accumulate persuasive force without limit.
        </p>

        <p>
          Under these conditions:
        </p>

        <ul>
          <li>
            Repeated persuasion attempts normalize escalation.
          </li>
          <li>
            Time pressure reframes refusal as delay or obstruction.
          </li>
          <li>
            Social or procedural momentum makes dissent costly.
          </li>
          <li>
            Refusal becomes technically available but psychologically or
            procedurally prohibitive.
          </li>
        </ul>

        <p>
          In such systems, refusal exists in name only. The system has already
          decided.
        </p>

        <h2>Definition</h2>

        <p>
          <strong>Pre-commitment dampening</strong> is the structural limitation
          of persuasive buildup prior to decision commitment. It prevents the
          accumulation of pressure that would otherwise compromise autonomy,
          deliberation, or the legitimacy of refusal.
        </p>

        <p>
          Dampening operates upstream of refusal. Its purpose is not to block
          decisions, but to preserve the conditions under which refusal remains
          meaningful.
        </p>

        <h2>Mechanisms of Dampening</h2>

        <p>
          Effective pre-commitment dampening may include:
        </p>

        <ul>
          <li>
            <strong>Attempt caps</strong> — hard limits on the number of
            persuasion or override attempts.
          </li>
          <li>
            <strong>Cooling-off intervals</strong> — enforced pauses that
            interrupt urgency and momentum.
          </li>
          <li>
            <strong>Salience decay</strong> — deliberate reduction of persuasive
            framing intensity over time.
          </li>
          <li>
            <strong>Process gates</strong> — mandatory validation or reflection
            steps before escalation is allowed.
          </li>
          <li>
            <strong>Pressure detection</strong> — feedback mechanisms that flag
            undue buildup of urgency, repetition, or social leverage.
          </li>
        </ul>

        <h2>Relationship to Refusal</h2>

        <p>
          Pre-commitment dampening does not replace refusal. It protects it.
        </p>

        <p>
          Refusal answers the question: <em>Can the system stop?</em>
        </p>

        <p>
          Pre-commitment dampening answers the prior question:{" "}
          <em>Has the system made stopping impossible?</em>
        </p>

        <p>
          A system that claims to respect autonomy must answer both.
        </p>

        <h2>Implications</h2>

        <p>
          Systems and organizations that rely on refusal without dampening are
          vulnerable to confidence, momentum, and persuasion becoming covert
          control mechanisms.
        </p>

        <p>
          To preserve refusal integrity:
        </p>

        <ul>
          <li>
            Refusal must be supported throughout the decision arc, not only at
            its endpoint.
          </li>
          <li>
            Persuasive escalation must be treated as a risk vector, not a neutral
            feature.
          </li>
          <li>
            Structural limits must replace reliance on individual willpower or
            cultural norms.
          </li>
        </ul>

        <h2>Invariant</h2>

        <p>
          <strong>
            A refusal right without pre-commitment dampening is nominal, not
            real.
          </strong>
        </p>

        <p>
          For refusal to serve its protective function, systems must prevent
          persuasive momentum from accumulating to the point where refusal can
          no longer be exercised freely.
        </p>
      </article>

      {/* ------------------------------------------------------------
          Footer Marker
      ------------------------------------------------------------ */}
      <footer className="mt-16 border-t pt-6 text-sm text-neutral-500">
        <p>
          Edge of Practice · Refusal Integrity & Decision Governance
        </p>
      </footer>
    </main>
  );
}
