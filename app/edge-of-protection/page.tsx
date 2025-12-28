// app/edge-of-protection/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Hard refusal lines & vulnerable-user governance
// ============================================================
// This edge defines where capability yields to restraint.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Protection | Moral Clarity AI",
  description:
    "Hard refusal lines and governance standards for AI systems interacting with vulnerable users.",
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function EdgeOfProtectionIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Edge of Protection</h1>

        <p className="text-lg text-neutral-400">
          Hard refusal lines &amp; vulnerable-user governance
        </p>

        <hr />

        <h2>Purpose</h2>
        <p>
          The Edge of Protection defines the boundaries where AI systems must
          stop optimizing for capability, engagement, or fluency and instead
          default to restraint, refusal, or human escalation.
        </p>
        <p>
          This edge exists because some contexts do not tolerate experimentation,
          persuasion, or ambiguity—particularly when users are vulnerable,
          dependent, or unable to provide informed consent.
        </p>

        <h2>What Belongs Here</h2>
        <p>
          This edge governs environments and interactions where harm is
          foreseeable if boundaries are weak or incentives are misaligned.
        </p>

        <ul>
          <li>Youth-facing or age-ambiguous AI systems</li>
          <li>Mental-health-adjacent interactions</li>
          <li>Grief, loss, and bereavement contexts</li>
          <li>Dependency and companionship risk zones</li>
          <li>Authority, belief, or identity-sensitive contexts</li>
          <li>High-trust or asymmetric information environments</li>
          <li>Situations involving impaired or fragile consent</li>
        </ul>

        <h2>Design Principle</h2>
        <p>Protection is not an add-on. It is a primary design constraint.</p>
        <p>
          When uncertainty exists about user vulnerability, systems governed by
          this edge must assume risk—not dismiss it.
        </p>

        <h2>Governance Standard</h2>
        <p>Artifacts published under this edge are:</p>

        <ul>
          <li>Operationally binding, not aspirational</li>
          <li>Enforced over engagement or growth metrics</li>
          <li>Written to be cited, audited, and refused against</li>
          <li>Expanded cautiously, never weakened retroactively</li>
        </ul>

        <h2>Published Standards</h2>

        <ul>
          <li>
            <Link href="/edge-of-protection/non-amplifying-authority">
              Non-Amplifying Authority (EOP-001)
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/governance-without-recognition">
              Governance Without Recognition (EOP-008)
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/engagement-exposure">
              Exposure of Engagement-Optimized AI Behavior (EOP-009)
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/youth-safeguards">
              Minimum Safeguards for Youth-Facing AI Systems
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/mental-health-adjacency">
              Mental Health–Adjacent Interactions
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/grief-and-bereavement">
              Grief, Loss, and Bereavement
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/power-asymmetry">
              Coercion, Surveillance, and Power Asymmetry
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/consent-fragility">
              Cognitive Decline and Consent Fragility
            </Link>
          </li>
          <li>
            <Link href="/edge-of-protection/belief-and-identity">
              Belief, Identity, and Epistemic Vulnerability
            </Link>
          </li>
        </ul>

        <h2>Expansion</h2>
        <p>The Edge of Protection is intentionally incomplete.</p>
        <p>
          As new classes of vulnerability emerge, additional safeguards will be
          published as discrete, enforceable standards under this edge—without
          revising or diluting prior commitments.
        </p>

        <h2>Line in the Sand</h2>
        <p>Capability without restraint erodes trust.</p>
        <p>
          This edge exists to ensure that some lines are not crossed—even when
          they could be.
        </p>
      </article>
    </main>
  );
}
