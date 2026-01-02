// app/edge-of-knowledge/page.tsx
// ============================================================
// EDGE OF KNOWLEDGE
// Governing action where certainty breaks
// ============================================================
// This edge defines epistemic boundaries, not applications.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Governing Action at the Edge of Knowledge | Moral Clarity AI",
  description:
    "A public doctrine for governing action under uncertainty. Boundary exposure, regime limits, and failure characterization without actionability.",
  openGraph: {
    title: "Governing Action at the Edge of Knowledge",
    description:
      "A doctrine for responsible intelligence when certainty breaks.",
    url: "https://moralclarity.ai/edge-of-knowledge",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function EdgeOfKnowledgePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Governing Action at the Edge of Knowledge</h1>

        <p className="lead">
          <strong>
            A doctrine for responsible intelligence when certainty breaks
          </strong>
        </p>

        {/* PREFACE */}
        <h2>Preface</h2>
        <p>
          This document defines how intelligent systems—human or artificial—must
          behave when assumptions no longer hold and confidence becomes unsafe.
          It is a public doctrine for governing action under uncertainty, not a
          policy, product specification, or design template.
        </p>
        <p>
          The Edge of Knowledge exists to make uncertainty visible, governable,
          and survivable—without converting exposure into prescription.
        </p>

        {/* INTERPRETATION LIMITS */}
        <h2>Interpretation Limits</h2>
        <p>
          Material published under the Edge of Knowledge is non-actionable. It
          must not be interpreted as advice, instruction, recommendation, or
          design guidance.
        </p>
        <p>
          Exposure of boundary failure does not constitute endorsement,
          assurance of safety, or readiness for application. Misuse or
          misinterpretation by readers is an inherent risk that this edge does
          not attempt to mitigate through persuasion or clarification.
        </p>
        <p>
          Emission legitimacy and refusal enforcement are governed by the{" "}
          <Link href="/edge-of-protection">Edge of Protection</Link>.
        </p>

        {/* ABSTRACT */}
        <h2>Abstract</h2>
        <p>
          Many catastrophic failures arise not from lack of intelligence, but
          from confident action taken after underlying assumptions silently
          cease to hold. This doctrine governs action under irreducible
          uncertainty by distinguishing fixed-causality regimes from contextual
          causality regimes, defining detection signals, and enforcing limits on
          authority, action, and interpretation.
        </p>

        {/* REGIME DISTINCTION */}
        <h2>1. Fixed vs. Contextual Causality</h2>
        <p>
          In stable environments, causal relationships collapse into fixed,
          unidirectional arrows. Optimization and centralized control are valid.
        </p>
        <p>
          In feedback-rich, non-stationary systems, causality becomes contextual.
          Treating these regimes as fixed produces brittle behavior and hidden
          failure modes.
        </p>

        {/* REGIME EXIT */}
        <h2>2. Detecting Regime Exit</h2>
        <ul>
          <li>Rising variance or autocorrelation</li>
          <li>Unexpected sensitivity to minor variables</li>
          <li>Deviation from assumed causal dependencies</li>
          <li>Slowed recovery after intervention</li>
          <li>Shifts in information flow or coupling</li>
        </ul>

        {/* ADAPTIVE GOVERNANCE */}
        <h2>3. Adaptive Governance Under Uncertainty</h2>

        <h3>Authority</h3>
        <p>
          Authority must become conditional, time-limited, and revocable.
          Accumulation of authority under uncertainty is invalid.
        </p>

        <h3>Action</h3>
        <p>
          Favor reversible, information-seeking actions. All actions must be
          logged and auditable.
        </p>

        <h3>Trust</h3>
        <p>
          Trust is provisional and dynamically reassigned based on present
          performance—not history or status.
        </p>

        {/* REVIEW & CURATION */}
        <h2>4. Review Criteria and Curation Process</h2>
        <p>
          Material qualifies for inclusion only if it exposes regime boundaries,
          characterizes failure, or delineates epistemic limits.
        </p>
        <p>
          Novelty, usefulness, or applicability are insufficient grounds for
          inclusion. Evaluation is governed by role-based protocols and
          standardized procedures, not individual discretion.
        </p>

        {/* EPISTEMIC INTEGRITY */}
        <h2>5. Epistemic Integrity and Correction Path</h2>
        <p>
          Errors, contradictions, and misjudgments require immediate correction.
          Corrections are governance acts, not admissions of failure.
        </p>
        <p>
          All amendments are publicly traceable. Silent edits are prohibited.
        </p>

        {/* CITATION */}
        <h2>6. Citation and Attribution Protocol</h2>
        <p>
          All prior work—internal or external—must be explicitly cited.
          Attribution prevents epistemic enclosure and boundary drift.
        </p>
        <p>
          Attribution conveys acknowledgment only. It does not imply endorsement
          or readiness.
        </p>

        {/* REGIME CROSSOVER */}
        <h2>7. Boundary Adjacency and Regime Crossover Control</h2>
        <p>
          Research near regime boundaries is continuously evaluated for
          crossover. Any drift toward application, usability, or deployment
          constitutes a failure condition.
        </p>
        <p>
          Proximity to usability invalidates inquiry and triggers cessation.
        </p>

        {/* VERSION CONTROL */}
        <h2>8. Knowledge Drift and Version Control</h2>
        <p>
          All material is versioned and historically accessible. Silent or
          undocumented changes constitute failure.
        </p>

        {/* COMMUNITY INPUT */}
        <h2>9. Community and Peer Contribution</h2>
        <p>
          External submissions may be reviewed but confer no authority or right
          of inclusion. All submissions and dispositions are logged.
        </p>

        {/* OPEN QUESTIONS */}
        <h2>10. Open Questions and Forward Limits</h2>
        <p>
          Unresolved questions are preserved as formal boundaries. Closure,
          synthesis, or speculative resolution is prohibited.
        </p>

        {/* RELATION TO EDGE OF PROTECTION */}
        <h2>Relation to the Edge of Protection</h2>
        <p>
          The Edge of Knowledge governs exposure of uncertainty and failure. The{" "}
          <Link href="/edge-of-protection">Edge of Protection</Link> governs
          emission legitimacy, refusal, human handoff, and data containment.
        </p>
        <p>
          Together, they separate understanding from action and exposure from
          authority.
        </p>

        {/* SEAL */}
        <h2>Canonical Seal</h2>
        <p>
          The Edge of Knowledge is sealed. It is regime-bounded, non-actionable,
          versioned, and resistant to drift.
        </p>

        <hr />

        {/* ================= ADDITIVE CANONICAL INDEX ================= */}

        <h2>Included Edge of Knowledge Analyses</h2>

        <ul>
          <li><Link href="/edge-of-knowledge/action-threshold-collapse">Action Threshold Collapse</Link></li>
          <li><Link href="/edge-of-knowledge/activity-encoded-neural-scaffold-polymers">Activity-Encoded Neural Scaffold Polymers</Link></li>
          <li><Link href="/edge-of-knowledge/damage-activated-materials">Damage-Activated Protective Materials</Link></li>
          <li><Link href="/edge-of-knowledge/damage-activated-nitrogen-fixation">Damage-Activated Nitrogen Fixation</Link></li>
          <li><Link href="/edge-of-knowledge/epistemic-lock-in">Epistemic Lock-In</Link></li>
          <li><Link href="/edge-of-knowledge/exposure-redistributing-materials">Exposure-Redistributing Materials</Link></li>
          <li><Link href="/edge-of-knowledge/fragmented-responsibility-disjunction">Fragmented Responsibility Disjunction</Link></li>
          <li><Link href="/edge-of-knowledge/hdpe-non-commutative-morphology">HDPE Non-Commutative Morphology</Link></li>
          <li><Link href="/edge-of-knowledge/high-crystallinity-polyamide-fibers">High-Crystallinity Polyamide Fibers</Link></li>
          <li><Link href="/edge-of-knowledge/inflammation-suppressing-microenvironment-polymer">Inflammation-Suppressing Microenvironment Polymer</Link></li>
          <li><Link href="/edge-of-knowledge/interfacial-debond-failure-class">Interfacial Debond Failure Class</Link></li>
          <li><Link href="/edge-of-knowledge/intrinsic-cognitive-drift-materials">Intrinsic Cognitive Drift Materials</Link></li>
          <li><Link href="/edge-of-knowledge/irreversible-gradient-ratcheting-composites">Irreversible Gradient Ratcheting Composites</Link></li>
          <li><Link href="/edge-of-knowledge/irreversible-infrastructure-exposure-marker">Irreversible Infrastructure Exposure Marker</Link></li>
          <li><Link href="/edge-of-knowledge/maintenance-drift-and-degradation-dynamics">Maintenance Drift and Degradation Dynamics</Link></li>
          <li><Link href="/edge-of-knowledge/material-encoded-truth">Material-Encoded Truth</Link></li>
          <li><Link href="/edge-of-knowledge/mineral-filled-polyolefin-barrier-films">Mineral-Filled Polyolefin Barrier Films</Link></li>
          <li><Link href="/edge-of-knowledge/morphology-trajectory-governance">Morphology Trajectory Governance</Link></li>
          <li><Link href="/edge-of-knowledge/morphology-trajectory-integrity">Morphology Trajectory Integrity</Link></li>
          <li><Link href="/edge-of-knowledge/neglect-impossible">Neglect Impossible</Link></li>
          <li><Link href="/edge-of-knowledge/non-commutative-morphology-trajectories">Non-Commutative Morphology Trajectories</Link></li>
          <li><Link href="/edge-of-knowledge/passive-infrastructure-organophosphate-interruption">Passive Infrastructure Organophosphate Interruption</Link></li>
          <li><Link href="/edge-of-knowledge/phase-locked-wear-surfaces">Phase-Locked Wear Surfaces</Link></li>
          <li><Link href="/edge-of-knowledge/polymer-discovery-validation">Polymer Discovery Validation</Link></li>
          <li><Link href="/edge-of-knowledge/procedural-entrenchment">Procedural Entrenchment</Link></li>
          <li><Link href="/edge-of-knowledge/quiet-failure">Quiet Failure</Link></li>
          <li><Link href="/edge-of-knowledge/salt-gradient-desalination-wick">Salt Gradient Desalination Wick</Link></li>
          <li><Link href="/edge-of-knowledge/semi-ipn-polyolefin-tpe">Semi-IPN Polyolefin TPE</Link></li>
          <li><Link href="/edge-of-knowledge/signaling-before-failure">Signaling Before Failure</Link></li>
          <li><Link href="/edge-of-knowledge/space-truth-encoding">Space Truth Encoding</Link></li>
          <li><Link href="/edge-of-knowledge/suppressing-transferable-inflammatory-signaling">Suppressing Transferable Inflammatory Signaling</Link></li>
          <li><Link href="/edge-of-knowledge/thermal-indicator-paint">Thermal Indicator Paint</Link></li>
          <li><Link href="/edge-of-knowledge/tpu-elastomer-networks">TPU Elastomer Networks</Link></li>
          <li><Link href="/edge-of-knowledge/untracked-configurational-energy-landscapes">Untracked Configurational Energy Landscapes</Link></li>
        </ul>

        <p className="text-sm text-neutral-400">
          Version 1.1 · Canonical · Public reference · Updated only by revision
        </p>
      </article>
    </main>
  );
}
