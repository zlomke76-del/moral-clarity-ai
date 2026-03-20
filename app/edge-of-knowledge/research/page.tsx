// app/edge-of-knowledge/research/page.tsx
// ============================================================
// EDGE OF KNOWLEDGE — RESEARCH INDEX
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Knowledge — Research Index | Moral Clarity AI",
  description:
    "A public research index exploring failure, uncertainty, and responsible action where optimization and certainty break down.",
  openGraph: {
    title: "Edge of Knowledge — Research Index",
    description:
      "Public research on failure modes, uncertainty, and responsible action beyond certainty.",
    url: "https://moralclarity.ai/edge-of-knowledge/research",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EdgeOfKnowledgeIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">

      {/* ================= HERO / ENTRY ================= */}
      <section className="mb-12 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-8 dark:border-neutral-800 dark:bg-neutral-900/60 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Edge of Knowledge
        </h1>

        <p className="mt-4 text-base font-medium">
          Research on failure, uncertainty, and responsible action where
          optimization breaks
        </p>

        <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <em>Edge of Knowledge</em> is a public research series examining how
          systems fail when assumptions quietly collapse, incentives misalign,
          and certainty becomes dangerous. These documents are not product
          proposals, investment theses, or policy mandates. They are
          regime-bounded analyses intended to clarify limits, surface risk, and
          govern action where traditional optimization no longer applies.
        </p>
      </section>

      {/* ================= GOVERNING PROBLEM ================= */}
      <section className="mb-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/40">
        <h2 className="text-lg font-semibold tracking-tight">
          The Governing Problem
        </h2>

        <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Systems rarely collapse suddenly. They become{" "}
          <strong>internally consistent and externally wrong</strong>.
        </p>

        <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          AI systems continue producing coherent outputs while drifting from
          ground truth. Organizations accumulate governance artifacts while
          behavior decouples from constraint. Materials pass validation while
          degrading along untracked pathways.
        </p>

        <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <strong>
            Edge of Knowledge exists to detect epistemic decoupling before
            consequence becomes irreversible.
          </strong>
        </p>

        {/* === SYSTEM STACK (UPGRADED) === */}
        <div className="mt-6 grid gap-3 text-sm">
          <div className="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <strong>Research</strong> — Defines the boundary
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <strong>Instrumentation</strong> — Detects boundary violation
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <strong>Constraint</strong> — Intervenes before lock-in
          </div>
        </div>

        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
          Without that sequence, governance becomes documentation of failure.
        </p>
      </section>

      {/* ================= DIVIDER ================= */}
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-neutral-400/40 to-transparent" />

      {/* ================= CONTENT ================= */}
      <article className="prose prose-neutral dark:prose-invert max-w-none">

        {/* I */}
        <h2>I. Doctrine — Governing Action Under Uncertainty</h2>
        <ul>
          <li><Link href="/edge-of-knowledge">Governing Action at the Edge of Knowledge</Link></li>
          <li><Link href="/edge-of-knowledge/morphology-trajectory-integrity">Morphology Trajectory Integrity (MTI-1)</Link></li>
          <li><Link href="/edge-of-knowledge/untracked-configurational-energy-landscapes">Untracked Configurational Energy Landscapes in Polymer Durability</Link></li>
          <li><Link href="/edge-of-knowledge/non-commutative-morphology-trajectories">Non-Commutative Morphology Trajectories in Polymer Durability</Link></li>
          <li><Link href="/edge-of-knowledge/epistemic-lock-in">Epistemic Lock-In After Risk Acknowledgment</Link></li>
        </ul>

        {/* II */}
        <h2>II. Governance-Driven Failure Modes</h2>
        <ul>
          <li><Link href="/edge-of-knowledge/procedural-entrenchment">Procedural Entrenchment</Link></li>
          <li><Link href="/edge-of-knowledge/action-threshold-collapse">Action Threshold Collapse</Link></li>
          <li><Link href="/edge-of-knowledge/fragmented-responsibility-disjunction">Fragmented Responsibility Disjunction</Link></li>
        </ul>

        {/* III */}
        <h2>III. Failure Visibility & Accountability</h2>
        <ul>
          <li><Link href="/edge-of-knowledge/interfacial-debond-failure-class">Interfacial-Debond–Controlled Failure (General Class)</Link></li>
          <li><Link href="/edge-of-knowledge/quiet-failure">Materials That Quietly Prevent Failure</Link></li>
          <li><Link href="/edge-of-knowledge/neglect-impossible">Materials That Make Neglect Impossible</Link></li>
          <li><Link href="/edge-of-knowledge/irreversible-infrastructure-exposure-marker">Irreversible Infrastructure Exposure Marker</Link></li>
          <li><Link href="/edge-of-knowledge/phase-locked-wear-surfaces">Phase-Locked Wear Surfaces</Link></li>
          <li><Link href="/edge-of-knowledge/material-encoded-truth">Material-Encoded Truth</Link></li>
          <li><Link href="/edge-of-knowledge/intrinsic-cognitive-drift-materials">Intrinsic Cognitive-Drift Signaling Materials</Link></li>
          <li><Link href="/edge-of-knowledge/signaling-before-failure">Signaling Before Failure</Link></li>
          <li><Link href="/edge-of-knowledge/thermal-indicator-paint">Thermal Indicator Paint for Food Safety</Link></li>
        </ul>

        {/* IV */}
        <h2>IV. Boundary Research — Physically Allowed, Non-Scalable</h2>
        <ul>
          <li><Link href="/edge-of-knowledge/damage-activated-nitrogen-fixation">Damage-Activated Nitrogen Fixation</Link></li>
          <li><Link href="/edge-of-knowledge/salt-gradient-desalination-wick">Salt-Gradient Desalination Wick</Link></li>
        </ul>

        {/* V */}
        <h2>V. Validation-First Materials Exploration</h2>
        <ul>
          <li><Link href="/edge-of-knowledge/high-crystallinity-polyamide-fibers">High-Crystallinity Polyamide Fibers</Link></li>
          <li><Link href="/edge-of-knowledge/tpu-elastomer-networks">Thermoplastic Polyurethane Elastomer Networks</Link></li>
          <li><Link href="/edge-of-knowledge/polymer-discovery-validation">Polymer Discovery (Validation-First, Non-Inventive)</Link></li>
          <li><Link href="/edge-of-knowledge/semi-ipn-polyolefin-tpe">Semi-Interpenetrating Network (Semi-IPN)</Link></li>
          <li><Link href="/edge-of-knowledge/mineral-filled-polyolefin-barrier-films">Mineral-Filled Polyolefin Barrier Films</Link></li>
          <li><Link href="/edge-of-knowledge/hdpe-non-commutative-morphology">Non-Commutative Morphology Encoding in Semicrystalline Polyolefins</Link></li>
          <li>
            <Link href="/edge-of-knowledge/beip-v1">
              Boundary-Encoded Interfacial Persistence (BEIP v1) — Pre-Registered Protocol
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/human-ai-co-agency-boundary">
              Human–AI Co-Agency Boundary — Minimal Decisive Experiment (Protocol)
            </Link>
          </li>
        </ul>

        {/* VI */}
        <h2>VI. Formal Epistemic Obstructions (Mathematics)</h2>
        <ul>
          <li><Link href="/edge-of-knowledge/riemann-hypothesis-critical-line-structural-obstruction">Riemann Hypothesis: Critical Line Structural Obstruction</Link></li>
          <li><Link href="/edge-of-knowledge/collatz-conjecture-universal-descent-obstruction">Collatz Conjecture: Universal Descent Obstruction</Link></li>
          <li><Link href="/edge-of-knowledge/hodge-conjecture-algebraicity-obstruction">Hodge Conjecture: Algebraicity Obstruction</Link></li>
        </ul>

      </article>

      {/* ================= FOOTER NOTE ================= */}
      <p className="mt-16 text-sm text-neutral-500 dark:text-neutral-400 text-center">
        Edge of Knowledge is a public research series. Documents are updated only by explicit revision and remain accessible for epistemic continuity.
      </p>

    </main>
  );
}
