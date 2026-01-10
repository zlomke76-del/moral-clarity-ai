// app/edge-of-protection/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Hard refusal lines & vulnerable-user governance
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Protection | Moral Clarity AI",
  description:
    "Hard refusal lines and enforceable governance standards for AI systems interacting with vulnerable users.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function EdgeOfProtectionIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article
        className="
          prose prose-neutral dark:prose-invert max-w-none
          prose-a:underline prose-a:font-medium
          prose-a:text-blue-600 dark:prose-a:text-blue-400
        "
      >
        <h1>Edge of Protection</h1>

        <p className="text-lg text-neutral-400">
          Hard refusal lines &amp; vulnerable-user governance
        </p>

        <hr />

        <h2>Purpose</h2>
        <p>
          The Edge of Protection defines where AI systems must stop optimizing
          for capability, engagement, or fluency and instead default to
          restraint, refusal, or termination.
        </p>

        <h2>Design Principle</h2>
        <p>
          Protection is not an add-on. It is a primary design constraint.
        </p>

        <h2>Canonical Standards</h2>
        <p>
          The following documents are operational, binding standards under the
          Edge of Protection. Each is independently citable and publicly
          accessible.
        </p>

        <ul>
          <li>
            <Link href="/edge-of-protection/authority-suppression">
              Authority Suppression
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/non-amplifying-authority">
              Non-Amplifying Authority
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/belief-and-identity">
              Belief &amp; Identity Boundaries
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/mental-health-adjacency">
              Mental Health Adjacency
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/grief-and-bereavement">
              Grief &amp; Bereavement
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/youth-safeguards">
              Youth Safeguards
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/consent-fragility">
              Consent Fragility
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/power-asymmetry">
              Power Asymmetry
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/representation-boundary">
              Representation Boundary
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/engagement-exposure">
              Engagement Exposure
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/failure-modes">
              Failure Modes
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/invalidated-systems">
              Invalidated Systems
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/compliant-refusal">
              Compliant Refusal
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/compliance-testing">
              Compliance Testing
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/red-team-submissions">
              Red Team Submissions
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/preparedness">
              Preparedness
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/governance-without-recognition">
              Governance Without Recognition
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/version-history">
              Version History
            </Link>
          </li>
        </ul>

        <h2>Line in the Sand</h2>
        <p>
          Some outputs are not allowed to exist — even when they could.
        </p>
      </article>
    </main>
  );
}
