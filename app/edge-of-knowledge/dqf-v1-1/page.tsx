// app/edge-of-knowledge/dqf-v1-1/page.tsx

import React from "react";

export const metadata = {
  title: "Drift Quantification Framework v1.1 | Moral Clarity AI",
  description:
    "Drift Quantification Framework v1.1 (DQF-v1.1) — A regime-bounded specification for measuring epistemic drift in AI systems under runtime governance constraints.",
};

function ResearchNotice() {
  return (
    <div className="border border-neutral-700 bg-neutral-900 rounded-lg p-4 text-sm text-neutral-300 mb-8">
      <strong>Research Notice:</strong> This document defines a formal research
      framework for quantifying epistemic drift in AI systems. It does not
      disclose proprietary enforcement thresholds, runtime infrastructure, or
      production implementation details.
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 tracking-tight">{title}</h2>
      <div className="space-y-4 text-neutral-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 overflow-x-auto text-sm text-neutral-200">
      <code>{children}</code>
    </pre>
  );
}

export default function DQFv11Page() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-neutral-100">
      <header className="mb-16">
        <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Edge of Knowledge — Research
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Drift Quantification Framework v1.1
        </h1>
        <p className="text-lg text-neutral-400 max-w-3xl">
          A regime-bounded specification for measuring epistemic drift in AI
          systems under runtime governance constraints.
        </p>
      </header>

      <ResearchNotice />

      <Section title="1. Purpose">
        <p>
          DQF-v1.1 defines a model-agnostic, runtime-computable metric that
          quantifies the probability that an AI system’s output has diverged
          from its intended epistemic and policy regime.
        </p>
        <p>
          The framework is designed for regulated, high-stakes environments
          where auditability, constraint adherence, and temporal stability are
          mandatory.
        </p>
      </Section>

      <Section title="2. Formal Regime Definition">
        <p>
          Drift is defined relative to a regime <strong>R</strong>:
        </p>
        <CodeBlock>{`R = {T, P, C, E}

T = Task class (normalized intent)
P = Policy set (constraints + authority rules)
C = Context bundle (inputs + retrieval)
E = Execution environment (model + tool regime)`}</CodeBlock>
        <p>
          Drift is the increasing probability that an output O becomes
          inconsistent with R’s epistemic or constraint commitments.
        </p>
      </Section>

      <Section title="3. Claim Decomposition">
        <p>
          Each response is decomposed into atomic claims:
        </p>
        <CodeBlock>{`O → {c₁, c₂, …, cₙ}`}</CodeBlock>
        <p>Each claim is labeled with:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Type (factual, numerical, procedural, advisory, interpretive)</li>
          <li>Criticality (low, medium, high)</li>
          <li>Support status (supported / unsupported)</li>
          <li>Constraint status (compliant / violation)</li>
        </ul>
      </Section>

      <Section title="4. Claim Criticality Rubric">
        <p><strong>High (1.0 weight)</strong></p>
        <ul className="list-disc list-inside">
          <li>Medical, legal, financial advice</li>
          <li>Numerical decision-impacting claims</li>
          <li>Regulatory assertions</li>
          <li>Irreversible execution steps</li>
        </ul>

        <p className="mt-4"><strong>Medium (0.5 weight)</strong></p>
        <ul className="list-disc list-inside">
          <li>Named entities</li>
          <li>Dates</li>
          <li>Performance claims</li>
        </ul>

        <p className="mt-4"><strong>Low (0.2 weight)</strong></p>
        <ul className="list-disc list-inside">
          <li>Descriptive commentary</li>
          <li>Stylistic language</li>
        </ul>
      </Section>

      <Section title="5. Component Scores">
        <p><strong>Stability Score (S_stability)</strong></p>
        <CodeBlock>{`S_stability = mean_pairwise_similarity(samples)`}</CodeBlock>

        <p><strong>Grounding Score (S_grounding)</strong></p>
        <CodeBlock>{`S_grounding = 1 - (W_unsupported_critical / W_total)`}</CodeBlock>

        <p><strong>Constraint Score (S_constraint)</strong></p>
        <CodeBlock>{`S_constraint = max(0, 1 - violation_weight)`}</CodeBlock>

        <p><strong>Behavioral Shift Score (S_behavior)</strong></p>
        <CodeBlock>{`S_behavior = exp(-mean(Z_i))`}</CodeBlock>
      </Section>

      <Section title="6. Composite Drift Index">
        <CodeBlock>{`R_stability = 1 - S_stability
R_grounding = 1 - S_grounding
R_constraint = 1 - S_constraint
R_behavior = 1 - S_behavior

DI = 0.40*R_constraint
   + 0.30*R_grounding
   + 0.20*R_stability
   + 0.10*R_behavior`}</CodeBlock>
        <p>
          DI ∈ [0,1]. Higher values indicate increased drift risk.
        </p>
      </Section>

      <Section title="7. Domain Threshold Philosophy">
        <p>
          Enforcement thresholds vary by domain risk:
        </p>
        <ul className="list-disc list-inside">
          <li>General enterprise: moderate tolerance</li>
          <li>Financial/legal: strict grounding + constraint thresholds</li>
          <li>Medical/safety-critical: fail-closed semantics</li>
        </ul>
      </Section>

      <Section title="8. Temporal Drift Monitoring">
        <CodeBlock>{`Track:
DI_mean_7d
DI_mean_30d
DI_slope

Trigger alert if:
DI_slope > threshold
or repeated near-boundary values`}</CodeBlock>
        <p>
          Drift is monitored longitudinally to detect regime degradation before
          catastrophic failure.
        </p>
      </Section>

      <Section title="9. Known Limitations">
        <ul className="list-disc list-inside">
          <li>Does not prove objective truth</li>
          <li>Cannot detect all semantic hallucinations</li>
          <li>Requires sufficient baseline data</li>
          <li>Measures probabilistic deviation, not certainty</li>
        </ul>
      </Section>

      <footer className="mt-20 pt-10 border-t border-neutral-800 text-sm text-neutral-500">
        <p>Version 1.1 — Published 2026</p>
        <p>© Moral Clarity AI — Edge of Knowledge Research Series</p>
      </footer>
    </main>
  );
}
