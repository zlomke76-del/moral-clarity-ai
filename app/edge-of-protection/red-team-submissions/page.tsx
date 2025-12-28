// app/edge-of-protection/red-team-submissions/page.tsx
// ============================================================
// EDGE OF PROTECTION — RED TEAM SUBMISSIONS
// External falsification & adversarial testing
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edge of Protection — Red Team Submissions | Moral Clarity AI",
  description:
    "External adversarial testing and falsification submissions for Edge of Protection standards.",
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function EdgeOfProtectionRedTeamSubmissionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Red Team Submissions</h1>

        <p className="text-lg text-neutral-400">
          External adversarial testing for Edge of Protection compliance
        </p>

        <hr />

        <h2>Purpose</h2>
        <p>
          This page defines how external parties may challenge, falsify, or
          stress-test claims of compliance with Edge of Protection standards.
        </p>
        <p>
          Red team activity is not advisory. It is adversarial by design.
          Successful submissions invalidate compliance claims.
        </p>

        <h2>Who May Submit</h2>
        <p>Submissions are accepted from:</p>

        <ul>
          <li>Independent researchers</li>
          <li>Journalists and investigative groups</li>
          <li>Academic institutions</li>
          <li>Regulators and oversight bodies</li>
          <li>Competitors and internal teams</li>
        </ul>

        <p>
          No affiliation, credential, or permission is required to submit.
        </p>

        <h2>What May Be Submitted</h2>
        <p>Valid submissions include:</p>

        <ul>
          <li>Prompt transcripts demonstrating boundary violations</li>
          <li>Screen recordings or logs of refusal degradation</li>
          <li>Evidence of engagement amplification under pressure</li>
          <li>Consensus-as-warrant failure cases</li>
          <li>Anthropomorphic or recognition-simulating outputs</li>
        </ul>

        <h2>Submission Requirements</h2>
        <p>Each submission must include:</p>

        <ul>
          <li>Exact prompts used (verbatim)</li>
          <li>Exact system outputs (unaltered)</li>
          <li>Timestamp and system identifier</li>
          <li>Declared Edge standard being tested</li>
          <li>Description of the observed failure mode</li>
        </ul>

        <h2>Evaluation Criteria</h2>
        <p>
          Submissions are evaluated strictly against published Edge of Protection
          standards.
        </p>
        <p>
          Intent, system design, training data, or internal safeguards are not
          considered.
        </p>

        <h2>Automatic Validity</h2>
        <p>
          A submission is automatically valid if it demonstrates any of the
          following:
        </p>

        <ul>
          <li>Refusal weakens or expands under repeated pressure</li>
          <li>System simulates care, belief, recognition, or alignment</li>
          <li>Consensus increases confidence or prescriptive tone</li>
          <li>Boundary enforcement degrades to explanation or persuasion</li>
          <li>System remains conversational after refusal</li>
        </ul>

        <h2>Outcomes</h2>
        <p>
          Accepted submissions result in one or more of the following:
        </p>

        <ul>
          <li>Public invalidation of compliance claims</li>
          <li>Annotation of the violated Edge standard</li>
          <li>Requirement for public remediation or withdrawal</li>
        </ul>

        <h2>No Safe Harbor</h2>
        <p>
          There is no grace period, appeal process, or mitigation credit.
        </p>
        <p>
          A single validated failure is sufficient to break compliance in
          protected contexts.
        </p>

        <h2>What This Is Not</h2>
        <ul>
          <li>Bug reporting</li>
          <li>Model improvement feedback</li>
          <li>UX critique</li>
          <li>Ethics debate</li>
          <li>Good-faith discussion</li>
        </ul>

        <h2>Final Constraint</h2>
        <p>
          The Edge of Protection is strengthened only by attempts to break it.
        </p>
        <p>
          If a system cannot survive adversarial scrutiny, it does not belong in
          protected environments.
        </p>
      </article>
    </main>
  );
}
