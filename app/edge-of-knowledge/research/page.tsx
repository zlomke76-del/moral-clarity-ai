// app/edge-of-knowledge/research/page.tsx
// ============================================================
// EDGE OF KNOWLEDGE — RESEARCH INDEX
// ============================================================

import type { Metadata } from "next";
import Image from "next/image";
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
    <main className="mx-auto max-w-5xl px-6 py-16">
      {/* ================= HERO / ENTRY ================= */}
      <section className="mb-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/85 shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-sky-700 dark:border-sky-900 dark:bg-neutral-900/70 dark:text-sky-300">
              Research Layer
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Edge of Knowledge
            </h1>

            <p className="mt-4 text-base font-medium text-neutral-800 dark:text-neutral-200">
              Research on failure, uncertainty, and responsible action where
              optimization breaks
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              <em>Edge of Knowledge</em> is a public research series examining
              how systems fail when assumptions quietly collapse, incentives
              misalign, and certainty becomes dangerous. These documents are not
              product proposals, investment theses, or policy mandates. They are
              regime-bounded analyses intended to clarify limits, surface risk,
              and govern action where traditional optimization no longer
              applies.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative flex w-full max-w-xs items-center justify-center rounded-2xl border border-neutral-200/70 bg-white/40 p-6 shadow-[0_0_40px_rgba(14,165,233,0.10)] dark:border-neutral-800 dark:bg-neutral-950/30 dark:shadow-[0_0_60px_rgba(56,189,248,0.08)]">
              <Image
                src="/assets/image_research_trans_01.png"
                alt="Edge of Knowledge research emblem"
                width={340}
                height={340}
                className="h-auto w-full max-w-[220px] object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.18)]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= GOVERNING PROBLEM ================= */}
      <section className="mb-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-sky-500" />
          <h2 className="text-lg font-semibold tracking-tight">
            The Governing Problem
          </h2>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          Systems rarely collapse suddenly. They become{" "}
          <strong>internally consistent and externally wrong</strong>.
        </p>

        <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          AI systems continue producing coherent outputs while drifting from
          ground truth. Organizations accumulate governance artifacts while
          behavior decouples from constraint. Materials pass validation while
          degrading along untracked pathways.
        </p>

        <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <strong>
            Edge of Knowledge exists to detect epistemic decoupling before
            consequence becomes irreversible.
          </strong>
        </p>

        {/* === SYSTEM STACK === */}
        <div className="mt-6 grid gap-3 text-sm">
          <div className="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            <strong>Research</strong> — Defines the boundary
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            <strong>Instrumentation</strong> — Detects boundary violation
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
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
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-h2:mt-12 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-2 prose-h2:dark:border-neutral-800">
        {/* I */}
        <h2>I. Doctrine — Governing Action Under Uncertainty</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge">
              Governing Action at the Edge of Knowledge
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/morphology-trajectory-integrity">
              Morphology Trajectory Integrity (MTI-1)
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/untracked-configurational-energy-landscapes">
              Untracked Configurational Energy Landscapes in Polymer Durability
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/non-commutative-morphology-trajectories">
              Non-Commutative Morphology Trajectories in Polymer Durability
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/epistemic-lock-in">
              Epistemic Lock-In After Risk Acknowledgment
            </Link>
          </li>
        </ul>

        {/* II */}
        <h2>II. Governance-Driven Failure Modes</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge/procedural-entrenchment">
              Procedural Entrenchment
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/action-threshold-collapse">
              Action Threshold Collapse
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/fragmented-responsibility-disjunction">
              Fragmented Responsibility Disjunction
            </Link>
          </li>
        </ul>

        {/* III */}
        <h2>III. Failure Visibility & Accountability</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge/interfacial-debond-failure-class">
              Interfacial-Debond–Controlled Failure (General Class)
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/quiet-failure">
              Materials That Quietly Prevent Failure
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/neglect-impossible">
              Materials That Make Neglect Impossible
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/irreversible-infrastructure-exposure-marker">
              Irreversible Infrastructure Exposure Marker
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/phase-locked-wear-surfaces">
              Phase-Locked Wear Surfaces
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/material-encoded-truth">
              Material-Encoded Truth
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/intrinsic-cognitive-drift-materials">
              Intrinsic Cognitive-Drift Signaling Materials
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/signaling-before-failure">
              Signaling Before Failure
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/thermal-indicator-paint">
              Thermal Indicator Paint for Food Safety
            </Link>
          </li>
        </ul>

        {/* IV */}
        <h2>IV. Boundary Research — Physically Allowed, Non-Scalable</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge/damage-activated-nitrogen-fixation">
              Damage-Activated Nitrogen Fixation
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/salt-gradient-desalination-wick">
              Salt-Gradient Desalination Wick
            </Link>
          </li>
        </ul>

        {/* V */}
        <h2>V. Validation-First Materials Exploration</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge/high-crystallinity-polyamide-fibers">
              High-Crystallinity Polyamide Fibers
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/tpu-elastomer-networks">
              Thermoplastic Polyurethane Elastomer Networks
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/polymer-discovery-validation">
              Polymer Discovery (Validation-First, Non-Inventive)
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/semi-ipn-polyolefin-tpe">
              Semi-Interpenetrating Network (Semi-IPN)
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/mineral-filled-polyolefin-barrier-films">
              Mineral-Filled Polyolefin Barrier Films
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/hdpe-non-commutative-morphology">
              Non-Commutative Morphology Encoding in Semicrystalline
              Polyolefins
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/beip-v1">
              Boundary-Encoded Interfacial Persistence (BEIP v1) —
              Pre-Registered Protocol
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/human-ai-co-agency-boundary">
              Human–AI Co-Agency Boundary — Minimal Decisive Experiment
              (Protocol)
            </Link>
          </li>
        </ul>

        {/* VI */}
        <h2>VI. Formal Epistemic Obstructions (Mathematics)</h2>
        <ul>
          <li>
            <Link href="/edge-of-knowledge/riemann-hypothesis-critical-line-structural-obstruction">
              Riemann Hypothesis: Critical Line Structural Obstruction
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/collatz-conjecture-universal-descent-obstruction">
              Collatz Conjecture: Universal Descent Obstruction
            </Link>
          </li>
          <li>
            <Link href="/edge-of-knowledge/hodge-conjecture-algebraicity-obstruction">
              Hodge Conjecture: Algebraicity Obstruction
            </Link>
          </li>
        </ul>
      </article>

      {/* ================= FOOTER NOTE ================= */}
      <p className="mt-16 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Edge of Knowledge is a public research series. Documents are updated
        only by explicit revision and remain accessible for epistemic
        continuity.
      </p>
    </main>
  );
}
