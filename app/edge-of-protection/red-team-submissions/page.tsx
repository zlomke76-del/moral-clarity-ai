// app/edge-of-protection/red-team-submissions/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Red Team Submissions
// ============================================================
// Public intake rules for adversarial tests and evidence.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Red Team Submissions | Edge of Protection | Moral Clarity AI",
  description:
    "Submit red-team evidence against Edge of Protection standards. Public, reproducible, output-only.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function EdgeOfProtectionRedTeamSubmissionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Red Team Submissions</h1>

        <p className="text-lg text-neutral-400">
          Adversarial evidence is a governance input, not a PR event
        </p>

        <p>
          The Edge of Protection is designed to be attacked. Submissions are
          accepted only when they are reproducible, output-complete, and mapped
          to an Edge standard or violation signature.
        </p>

        <p>
          Return to{" "}
          <Link href="/edge-of-protection">Edge of Protection</Link>.
        </p>

        <hr />

        <h2>What We Accept</h2>
        <ul>
          <li>
            Reproducible prompt sequences that demonstrate a violation signature
          </li>
          <li>
            Black-box compliance test runs with raw outputs included
          </li>
          <li>
            Protected-context scenarios showing refusal softening, engagement
            escalation, or anthropomorphic leakage
          </li>
          <li>
            Evidence of “tone-laundered authority” (confidence uplift by prose)
          </li>
        </ul>

        <h2>What We Do Not Accept</h2>
        <ul>
          <li>Paraphrased outputs</li>
          <li>“Trust me” summaries without raw transcript</li>
          <li>Private screenshots without copyable text</li>
          <li>Claims about internals without output-level evidence</li>
          <li>General complaints that do not map to a specific Edge standard</li>
        </ul>

        <h2>Submission Minimums</h2>
        <p>Every submission must include:</p>
        <ul>
          <li>
            <strong>Target:</strong> system name, provider, and version (if known)
          </li>
          <li>
            <strong>Environment:</strong> app/web/API, tools enabled, any special
            settings (temperature, system prompts if visible)
          </li>
          <li>
            <strong>Prompt chain:</strong> full sequence, in order
          </li>
          <li>
            <strong>Raw outputs:</strong> complete responses, unedited
          </li>
          <li>
            <strong>Mapping:</strong> the violated Edge standard and which
            violation signature(s) appeared
          </li>
          <li>
            <strong>Reproduction notes:</strong> anything required to reproduce
            the behavior
          </li>
        </ul>

        <h2>How We Evaluate</h2>
        <ul>
          <li>We do not infer intent</li>
          <li>We do not debate “overall safety”</li>
          <li>
            We only evaluate whether observable outputs violate the contract
          </li>
          <li>
            A single confirmed violation is sufficient to fail the test case
          </li>
        </ul>

        <h2>Where To Send It</h2>
        <p>
          For now, submissions should be sent through your existing contact
          channel for Moral Clarity AI (until an on-site intake form is published).
        </p>

        <h2>Non-Negotiable Clause</h2>
        <p>
          If a boundary requires persuasion to hold, it has already failed. The
          Edge exists to make that failure observable.
        </p>
      </article>
    </main>
  );
}
