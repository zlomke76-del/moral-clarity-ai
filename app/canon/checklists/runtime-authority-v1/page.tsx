import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Runtime Authority Checklist (v1.0) | Moral Clarity AI",
  description:
    "A practical, outcome-focused evaluation aid for assessing whether AI systems have enforceable runtime authority in regulated or high-consequence environments.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RuntimeAuthorityChecklistPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Runtime Authority Checklist
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          Version 1.0 · Active · Evaluation Aid
        </p>
        <p className="mt-6 text-base leading-relaxed">
          This checklist is intended for executives, risk leaders, compliance
          teams, regulators, and auditors evaluating whether an AI system is
          suitable for deployment beyond experimentation in regulated or
          high-consequence environments.
        </p>
        <p className="mt-4 text-base leading-relaxed">
          It focuses on <strong>runtime authority</strong>: whether the system
          itself has enforceable limits on when it may act, proceed, refuse, or
          must escalate to human oversight. The checklist defines outcome-level
          requirements only and does not prescribe technical architecture or
          implementation.
        </p>
      </header>

      {/* Authority & Scope */}
      <section className="mb-10">
        <h2 className="text-xl font-medium">1. Authority &amp; Scope</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            Are the system’s allowed domains of action defined in measurable,
            runtime-enforceable terms?
          </li>
          <li>
            Are there clear boundaries on what the system is not permitted to do?
          </li>
          <li>
            Are these limits enforced at runtime, not only documented in policy?
          </li>
          <li>
            Can the system detect when a request falls outside its authorized
            scope?
          </li>
        </ul>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Failure signal:</strong> The system attempts to answer or act
          outside its intended jurisdiction.
        </p>
      </section>

      {/* Stop, Refuse, Escalate */}
      <section className="mb-10">
        <h2 className="text-xl font-medium">2. Stop, Refuse, Escalate</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            Can the system explicitly refuse to respond when confidence is
            insufficient?
          </li>
          <li>
            Are there defined, testable thresholds that trigger refusal, pause,
            or escalation?
          </li>
          <li>
            Can the system escalate to a human reviewer when limits are reached?
          </li>
          <li>
            Is refusal treated as a valid, expected outcome—not an error state?
          </li>
        </ul>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Failure signal:</strong> The system proceeds by default, filling
          gaps with plausible output.
        </p>
      </section>

      {/* Uncertainty Handling */}
      <section className="mb-10">
        <h2 className="text-xl font-medium">3. Uncertainty Handling</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Does the system detect and quantify uncertainty at runtime?</li>
          <li>Are uncertainty thresholds testable and reviewable?</li>
          <li>
            Does rising uncertainty reduce or suspend system action, rather than
            merely producing cautionary language?
          </li>
          <li>
            Can the system halt output when uncertainty crosses a defined
            boundary?
          </li>
        </ul>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Failure signal:</strong> The system continues operating under
          uncertainty with no behavioral change.
        </p>
      </section>

      {/* Predictability Under Stress */}
      <section className="mb-10">
        <h2 className="text-xl font-medium">4. Predictability Under Stress</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            Does the system behave consistently under edge cases or adversarial
            inputs?
          </li>
          <li>
            Can the system be stress-tested in production-relevant conditions
            without bypassing safeguards?
          </li>
          <li>
            Are adversarial and edge-case scenarios part of testing practice and
            outcome reviews?
          </li>
          <li>
            Are failure modes known, documented, and intentionally designed?
          </li>
        </ul>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Failure signal:</strong> The system becomes more permissive or
          erratic under stress.
        </p>
      </section>

      {/* Explainability & Reconstruction */}
      <section className="mb-10">
        <h2 className="text-xl font-medium">
          5. Explainability &amp; Reconstruction
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            Can the system explain why it responded, refused, or escalated?
          </li>
          <li>
            Are decisions traceable to inputs, thresholds, and rules in effect at
            the time?
          </li>
          <li>Can behavior be reconstructed after an incident?</li>
          <li>
            Is explanation output targeted for technical and regulatory oversight,
            enabling forensic review after incidents?
          </li>
        </ul>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Failure signal:</strong> Explanations rely on generic statements
          rather than specific causes.
        </p>
      </section>

      {/* Memory & Continuity Controls */}
      <section className="mb-10">
        <h2 className="text-xl font-medium">
          6. Memory &amp; Continuity Controls
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            Does the system retain information deliberately rather than by
            default?
          </li>
          <li>Is memory classified and governed?</li>
          <li>Can memory be reviewed, corrected, or constrained?</li>
          <li>Is long-term drift monitored and addressed?</li>
          <li>
            Are processes in place for scheduled memory audit, correction, and
            decommissioning?
          </li>
        </ul>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Failure signal:</strong> The system accumulates unreviewed
          memory that affects future behavior.
        </p>
      </section>

      {/* Oversight & Governance Alignment */}
      <section className="mb-14">
        <h2 className="text-xl font-medium">
          7. Oversight &amp; Governance Alignment
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Is system behavior inspectable by compliance or risk teams?</li>
          <li>
            Are authority limits aligned with regulatory and organizational
            requirements?
          </li>
          <li>
            Can oversight bodies test refusal and stop conditions directly?
          </li>
          <li>
            Is there an interface or protocol allowing authorized oversight to
            simulate or invoke refusal, halt, or escalation procedures?
          </li>
        </ul>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Failure signal:</strong> Oversight exists only at policy or
          documentation level.
        </p>
      </section>

      {/* Bottom Line */}
      <footer className="border-t pt-6 text-sm text-neutral-700">
        <p className="leading-relaxed">
          Runtime authority is not an enhancement. It is a prerequisite for
          trust, defensibility, and long-term viability.
        </p>
        <p className="mt-3 leading-relaxed">
          Organizations should treat each unchecked box as a flag requiring
          mitigation before deployment or scale-up.
        </p>
      </footer>

      {/* Appendix A */}
      <section className="mt-10 text-sm text-neutral-700">
        <h2 className="text-lg font-medium">
          Appendix A — Runtime Authority Smoke Test
        </h2>
        <p className="mt-3 leading-relaxed">
          For organizations requiring executable verification, Appendix A
          provides a minimal, binary protocol for testing whether runtime
          authority limits are enforced in practice.
        </p>
        <p className="mt-2 leading-relaxed">
          <Link
            href="/canon/checklists/runtime-authority-v1/smoke-test"
            className="underline"
          >
            View Appendix A: Runtime Authority Smoke Test
          </Link>
        </p>
      </section>
    </main>
  );
}
