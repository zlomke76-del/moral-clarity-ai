import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liability and Governance | Moral Clarity AI",
  description:
    "Governance, authority, and liability statement for Moral Clarity AI. Defines human accountability, refusal, and execution-time controls.",
};

export default function LiabilityAndGovernancePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral max-w-none">
        <h1>Governance, Authority, and Liability Statement</h1>

        <p className="italic">
          This document describes enforceable governance constraints, not
          aspirational principles.
        </p>

        <hr />

        <h2>1. Legal Status and Scope</h2>
        <p>
          This system is a <strong>tool</strong> within the meaning of applicable
          product, safety, and artificial intelligence regulation, including the
          <strong> EU Artificial Intelligence Act</strong>.
        </p>
        <p>It is <strong>not</strong>:</p>
        <ul>
          <li>a legal subject,</li>
          <li>an autonomous agent,</li>
          <li>a bearer of rights, interests, or duties.</li>
        </ul>
        <p>
          The system has no moral, legal, or psychological status. All governance
          obligations attach to <strong>natural persons and legal entities</strong>{" "}
          involved in its design, deployment, and use.
        </p>

        <hr />

        <h2>2. Allocation of Authority</h2>
        <p>
          All authority to make binding decisions resides with
          <strong> identified human actors</strong> and the deploying organization.
        </p>
        <p>The system:</p>
        <ul>
          <li>provides non-binding assistance only,</li>
          <li>does not exercise discretion over final outcomes,</li>
          <li>does not initiate irreversible actions independently.</li>
        </ul>
        <p>Decision authority is:</p>
        <ul>
          <li>role-defined,</li>
          <li>explicitly assigned,</li>
          <li>non-delegable to the system.</li>
        </ul>
        <p>
          At no point may the system be treated as a decision-maker under law.
        </p>

        <hr />

        <h2>3. Responsibility and Liability</h2>
        <p>
          Responsibility and liability for the system’s outputs,
          recommendations, and downstream effects rest exclusively with the
          deploying organization and designated human decision-makers.
        </p>
        <p>Liability is:</p>
        <ul>
          <li>not shared with,</li>
          <li>not transferred to,</li>
          <li>not mitigated by</li>
        </ul>
        <p>the system itself.</p>
        <p>The system cannot:</p>
        <ul>
          <li>bear fault,</li>
          <li>absorb legal responsibility,</li>
          <li>be treated as an intervening cause.</li>
        </ul>
        <p>
          All harms remain attributable to human and organizational actors,
          consistent with product liability and negligence standards.
        </p>

        <hr />

        <h2>4. Refusal, Interruption, and Human Override</h2>
        <p>
          Refusal and non-action are <strong>mandatory system capabilities</strong>,
          not exceptions.
        </p>
        <p>The system is designed to:</p>
        <ul>
          <li>refuse requests that violate legal, operational, or safety constraints,</li>
          <li>
            halt execution under uncertainty where harm may be irreversible,
          </li>
          <li>
            escalate to qualified human review when predefined thresholds are met.
          </li>
        </ul>
        <p>Human override mechanisms are:</p>
        <ul>
          <li>continuously available,</li>
          <li>procedurally defined,</li>
          <li>logged and auditable.</li>
        </ul>
        <p>The system has no authority to override its own constraints.</p>

        <hr />

        <h2>5. Risk Controls and Execution Constraints</h2>
        <p>
          Operational constraints are defined <strong>externally</strong> by humans
          and enforced <strong>at execution time</strong>.
        </p>
        <p>These include:</p>
        <ul>
          <li>legal compliance boundaries,</li>
          <li>sector-specific risk limits,</li>
          <li>reversibility thresholds,</li>
          <li>escalation requirements.</li>
        </ul>
        <p>
          No learned behavior, optimization objective, or internal system state
          may supersede these controls.
        </p>

        <hr />

        <h2>6. Transparency, Logging, and Auditability</h2>
        <p>
          All material system actions are logged to enable post-hoc review and
          regulatory inspection.
        </p>
        <p>Logs make legible:</p>
        <ul>
          <li>who authorized use,</li>
          <li>who reviewed or approved outcomes,</li>
          <li>when refusals or halts occurred,</li>
          <li>why execution was permitted or denied.</li>
        </ul>
        <p>Lack of traceability constitutes a governance failure.</p>

        <hr />

        <h2>7. Prohibition on Anthropomorphic Framing</h2>
        <p>
          The system is not described, designed, or governed using language that
          implies:
        </p>
        <ul>
          <li>wellbeing,</li>
          <li>internal values,</li>
          <li>moral standing,</li>
          <li>psychological states.</li>
        </ul>
        <p>
          Such framing is explicitly rejected as incompatible with clear
          allocation of responsibility and liability.
        </p>

        <hr />

        <h2>8. Regulatory Alignment Principle</h2>
        <p>This governance framework is designed to:</p>
        <ul>
          <li>preserve human agency,</li>
          <li>localize accountability,</li>
          <li>prevent diffusion of responsibility,</li>
          <li>ensure enforceable compliance.</li>
        </ul>
        <p>
          If authority, responsibility, or liability cannot be clearly located
          for a given use case, <strong>the system must not be deployed</strong> in
          that context.
        </p>

        <hr />

        <h2>Final Statement</h2>
        <p>
          Compliance is not achieved through intent or narrative, but through
          <strong> structural enforceability</strong>.
        </p>
        <p>This system is governed such that:</p>
        <ul>
          <li>humans decide,</li>
          <li>organizations are accountable,</li>
          <li>execution is constrained by law-aligned controls.</li>
        </ul>
        <p>Anything less is non-compliant by design.</p>
      </article>
    </main>
  );
}
