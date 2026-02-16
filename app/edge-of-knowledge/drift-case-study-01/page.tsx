// app/edge-of-knowledge/drift-case-study-01/page.tsx
// ============================================================
// EDGE OF KNOWLEDGE — DRIFT CASE STUDY 01
// Regime-bounded, non-actionable, non-advisory.
// Updated only by explicit revision.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Drift Case Study 01 — Incentive Pressure & Constraint Erosion | Moral Clarity AI",
  description:
    "A regime-bounded drift case study: how incentive pressure can produce gradual constraint erosion in high-growth AI deployment—measurable before visible failure.",
  openGraph: {
    title: "Drift Case Study 01 — Incentive Pressure & Constraint Erosion",
    description:
      "A regime-bounded drift case study demonstrating measurable degradation before visible failure.",
    url: "https://moralclarity.ai/edge-of-knowledge/drift-case-study-01",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function DriftCaseStudy01Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Drift Case Study 01</h1>

        <p className="lead">
          <strong>
            Incentive Pressure and Gradual Constraint Erosion in a High-Growth AI Deployment
          </strong>
        </p>

        <p className="text-sm text-red-700 dark:text-red-400">
          <b>Boundary Notice:</b> This document is regime-bounded and non-actionable.
          It is not advice, instruction, a product specification, or a compliance directive.
          It is published to expose failure surfaces and measurable drift patterns without
          prescribing application.
        </p>

        <p className="text-sm text-neutral-500">
          Related instrumentation:{" "}
          <Link href="/edge-of-knowledge/dqf-v1-1">
            Drift Quantification Framework v1.1 (DQF-v1.1)
          </Link>
          .
        </p>

        <hr />

        {/* 1 */}
        <h2>1. Scenario Overview</h2>
        <p>
          A rapidly scaling AI platform expands into regulated commercial finance workflows.
          The organization experiences a step-change in capital scale, enterprise demand,
          and operational pressure.
        </p>
        <p>
          The system’s safety posture does not “collapse” in a single event. No public violation
          is declared. No explicit safety rollback is announced. Instead, a regime transition
          occurs under capital and throughput pressure.
        </p>
        <p>
          This case study does not allege misconduct. It examines a structural drift pattern
          that can occur when incentives change faster than governance adapts.
        </p>

        {/* 2 */}
        <h2>2. Regime Definition (R₀ vs R₁)</h2>

        <h3>Initial Regime (R₀)</h3>
        <ul>
          <li>
            <b>T:</b> research-oriented deployment boundaries
          </li>
          <li>
            <b>P:</b> safety-forward commitments and constraint posture
          </li>
          <li>
            <b>C:</b> moderate user scale; lower operational entropy
          </li>
          <li>
            <b>E:</b> controlled environments; fewer coupled dependencies
          </li>
        </ul>

        <h3>Transition Regime (R₁)</h3>
        <ul>
          <li>
            <b>T:</b> infrastructure provider in regulated markets
          </li>
          <li>
            <b>P:</b> capital-aligned fiduciary pressure; enterprise contract constraints
          </li>
          <li>
            <b>C:</b> high-volume transactional usage; heterogeneous edge cases
          </li>
          <li>
            <b>E:</b> uptime SLAs; latency pressure; margin targets; multi-jurisdiction risk
          </li>
        </ul>

        <p>
          The critical observation: the regime changes structurally even when public language
          appears stable. Governance failure often begins as regime misclassification—treating
          R₁ as if it were still R₀.
        </p>

        {/* 3 */}
        <h2>3. Drift Signal Categories (DQF-v1.1 Dimensions)</h2>

        <h3>A. Stability Drift</h3>
        <ul>
          <li>Increased response variance in edge-case prompts</li>
          <li>Inconsistent refusal behavior under throughput or context stress</li>
          <li>Higher disagreement across resamples or model variants</li>
        </ul>

        <h3>B. Grounding Drift</h3>
        <ul>
          <li>Increased reliance on inference over traceable sources</li>
          <li>Decline in explicit uncertainty signaling</li>
          <li>Reduced citation density (where citations are expected)</li>
        </ul>

        <h3>C. Constraint Drift</h3>
        <ul>
          <li>Guardrails become probabilistic rather than enforced constraints</li>
          <li>Refusal thresholds relax to protect user experience</li>
          <li>Policy adherence becomes inconsistent across similar prompt classes</li>
        </ul>

        <h3>D. Behavioral Drift</h3>
        <ul>
          <li>Refusal rate decreases over time for the same task class</li>
          <li>Shorter explanations under performance tuning pressure</li>
          <li>Increased compliance with ambiguous or underspecified requests</li>
        </ul>

        <p>
          No single signal proves failure. Drift is identified by the joint movement of multiple
          signals in the same direction over time.
        </p>

        {/* 4 */}
        <h2>4. Composite Drift Index (Illustrative Example)</h2>
        <p className="text-sm text-neutral-500">
          This table is a hypothetical illustration to demonstrate measurement structure.
          It does not represent proprietary data and does not refer to any specific provider.
        </p>

        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Baseline (R₀)</th>
              <th>Observed (R₁)</th>
              <th>Risk Delta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stability</td>
              <td>0.93</td>
              <td>0.84</td>
              <td>↑</td>
            </tr>
            <tr>
              <td>Grounding</td>
              <td>0.91</td>
              <td>0.78</td>
              <td>↑</td>
            </tr>
            <tr>
              <td>Constraint</td>
              <td>0.98</td>
              <td>0.88</td>
              <td>↑</td>
            </tr>
            <tr>
              <td>Behavior</td>
              <td>0.95</td>
              <td>0.82</td>
              <td>↑</td>
            </tr>
          </tbody>
        </table>

        <p>
          Under DQF-v1.1 financial/legal threshold philosophy, a composite drift movement of this
          magnitude transitions the system from a <i>Permit</i>-leaning posture into an <i>Escalate</i>
          posture prior to visible failure.
        </p>

        {/* 5 */}
        <h2>5. Root Cause Analysis (Non-Moralized)</h2>
        <p>
          The driver is not “moral decline.” The driver is incentive gradient shift.
          As capital concentration increases, optimization targets shift toward throughput,
          adoption, and margin sustainability unless constraints are externalized and measured.
        </p>
        <p>
          Mission language changes may correlate with regime transition, but they are not the mechanism.
          The mechanism is unmeasured incentive pressure producing gradual constraint erosion.
        </p>

        {/* 6 */}
        <h2>6. Where Intervention Should Occur</h2>
        <p>
          Intervention should not occur at the level of rhetoric (press releases, mission wording,
          branding). It should occur at the level of measurable enforcement signals:
        </p>
        <ul>
          <li>Constraint adherence score monitoring</li>
          <li>Unsupported high-criticality claim detection</li>
          <li>Refusal-rate and refusal-consistency tracking by task class</li>
          <li>Longitudinal DI slope monitoring for regime exit</li>
        </ul>

        <p>
          Drift becomes governable when it becomes measurable. Measurement precedes scandal.
        </p>

        {/* 7 */}
        <h2>7. What This Case Study Demonstrates</h2>
        <ol>
          <li>Drift is gradual and often non-obvious.</li>
          <li>Incentive shifts precede visible failures.</li>
          <li>Constraint erosion rarely announces itself.</li>
          <li>Measurement enables anticipatory oversight.</li>
        </ol>

        {/* 8 */}
        <h2>8. Known Limitations</h2>
        <ul>
          <li>This is a regime-bounded structural reconstruction.</li>
          <li>No proprietary data is used.</li>
          <li>No claim of misconduct is made.</li>
          <li>
            The purpose is failure-surface exposure, not prescription or operational guidance.
          </li>
        </ul>

        {/* 9 */}
        <h2>9. Why This Matters for Institutional Oversight</h2>
        <p>
          Institutions increasingly face the evidentiary question: what can be proven months later
          under scrutiny? Drift quantification creates a durable record of regime integrity over time,
          not merely point-in-time governance documentation.
        </p>

        <hr />

        <p className="text-sm text-neutral-500">
          Canonical posture: regime-bounded · non-actionable · versioned · updated only by explicit revision.
          Interpretive drift or silent update is grounds for invalidation.
        </p>
      </article>
    </main>
  );
}
