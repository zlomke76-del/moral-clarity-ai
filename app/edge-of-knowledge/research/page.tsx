// app/edge-of-knowledge/research/page.tsx
// ============================================================
// EDGE OF KNOWLEDGE — RESEARCH INDEX
// Public, regime-bounded research on failure, uncertainty,
// and responsible action where optimization breaks.
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

function Section({
  title,
  items,
}: {
  title: string;
  items: Array<{ href: string; label: string }>;
}) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/55 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.06),0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-[15px] leading-7 text-sky-300 underline decoration-sky-700/50 underline-offset-4 transition hover:text-sky-200 hover:decoration-sky-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function EdgeOfKnowledgeIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-sky-950/40 bg-slate-950/65 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
        <div className="grid gap-10 px-8 py-10 md:grid-cols-[1.35fr_0.65fr] md:px-10 md:py-12">
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              Research Layer
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Edge of Knowledge
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-100">
              Research on failure, uncertainty, and responsible action where
              optimization breaks.
            </p>

            <p className="mt-6 max-w-3xl text-[16px] leading-8 text-slate-300">
              <em>Edge of Knowledge</em> is a public research series examining how
              systems fail when assumptions quietly collapse, incentives misalign,
              and certainty becomes dangerous. These documents are not product
              proposals, investment theses, or policy mandates. They are
              regime-bounded analyses intended to clarify limits, surface risk,
              and govern action where traditional optimization no longer applies.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <div className="flex w-full max-w-[280px] items-center justify-center rounded-3xl border border-sky-950/40 bg-slate-950/45 p-6 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
              <Image
                src="/assets/image_research_trans_01.png"
                alt="MCAI Research emblem"
                width={320}
                height={320}
                priority
                className="h-auto w-full max-w-[220px] object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.20)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNING PROBLEM */}
      <section className="mt-10 rounded-3xl border border-sky-950/40 bg-slate-950/60 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.06),0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            The Governing Problem
          </h2>
        </div>

        <div className="mt-6 space-y-4 text-[16px] leading-8 text-slate-300">
          <p>
            Systems rarely collapse suddenly. They become{" "}
            <strong className="text-white">
              internally consistent and externally wrong
            </strong>
            .
          </p>

          <p>
            AI systems continue producing coherent outputs while drifting from
            ground truth. Organizations accumulate governance artifacts while
            behavior decouples from constraint. Materials pass validation while
            degrading along untracked pathways.
          </p>

          <p>
            <strong className="text-white">
              Edge of Knowledge exists to detect epistemic decoupling before
              consequence becomes irreversible.
            </strong>
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-950/40 bg-slate-900/70 px-5 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-300">
              Research
            </p>
            <p className="mt-2 text-[15px] leading-7 text-slate-200">
              Defines the boundary.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-950/40 bg-slate-900/70 px-5 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-300">
              Instrumentation
            </p>
            <p className="mt-2 text-[15px] leading-7 text-slate-200">
              Detects boundary violation.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-950/40 bg-slate-900/70 px-5 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-300">
              Constraint
            </p>
            <p className="mt-2 text-[15px] leading-7 text-slate-200">
              Intervenes before lock-in.
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-400">
          Without that sequence, governance becomes documentation of failure.
        </p>
      </section>

      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-sky-700/50 to-transparent" />

      {/* INDEX */}
      <div className="grid gap-8">
        <Section
          title="I. Doctrine — Governing Action Under Uncertainty"
          items={[
            {
              href: "/edge-of-knowledge",
              label: "Governing Action at the Edge of Knowledge",
            },
            {
              href: "/edge-of-knowledge/morphology-trajectory-integrity",
              label: "Morphology Trajectory Integrity (MTI-1)",
            },
            {
              href: "/edge-of-knowledge/untracked-configurational-energy-landscapes",
              label:
                "Untracked Configurational Energy Landscapes in Polymer Durability",
            },
            {
              href: "/edge-of-knowledge/non-commutative-morphology-trajectories",
              label:
                "Non-Commutative Morphology Trajectories in Polymer Durability",
            },
            {
              href: "/edge-of-knowledge/epistemic-lock-in",
              label: "Epistemic Lock-In After Risk Acknowledgment",
            },
          ]}
        />

        <Section
          title="II. Governance-Driven Failure Modes"
          items={[
            {
              href: "/edge-of-knowledge/procedural-entrenchment",
              label: "Procedural Entrenchment",
            },
            {
              href: "/edge-of-knowledge/action-threshold-collapse",
              label: "Action Threshold Collapse",
            },
            {
              href: "/edge-of-knowledge/fragmented-responsibility-disjunction",
              label: "Fragmented Responsibility Disjunction",
            },
          ]}
        />

        <Section
          title="III. Failure Visibility & Accountability"
          items={[
            {
              href: "/edge-of-knowledge/interfacial-debond-failure-class",
              label: "Interfacial-Debond–Controlled Failure (General Class)",
            },
            {
              href: "/edge-of-knowledge/quiet-failure",
              label: "Materials That Quietly Prevent Failure",
            },
            {
              href: "/edge-of-knowledge/neglect-impossible",
              label: "Materials That Make Neglect Impossible",
            },
            {
              href: "/edge-of-knowledge/irreversible-infrastructure-exposure-marker",
              label: "Irreversible Infrastructure Exposure Marker",
            },
            {
              href: "/edge-of-knowledge/phase-locked-wear-surfaces",
              label: "Phase-Locked Wear Surfaces",
            },
            {
              href: "/edge-of-knowledge/material-encoded-truth",
              label: "Material-Encoded Truth",
            },
            {
              href: "/edge-of-knowledge/intrinsic-cognitive-drift-materials",
              label: "Intrinsic Cognitive-Drift Signaling Materials",
            },
            {
              href: "/edge-of-knowledge/signaling-before-failure",
              label: "Signaling Before Failure",
            },
            {
              href: "/edge-of-knowledge/thermal-indicator-paint",
              label: "Thermal Indicator Paint for Food Safety",
            },
          ]}
        />

        <Section
          title="IV. Boundary Research — Physically Allowed, Non-Scalable"
          items={[
            {
              href: "/edge-of-knowledge/damage-activated-nitrogen-fixation",
              label: "Damage-Activated Nitrogen Fixation",
            },
            {
              href: "/edge-of-knowledge/salt-gradient-desalination-wick",
              label: "Salt-Gradient Desalination Wick",
            },
          ]}
        />

        <Section
          title="V. Validation-First Materials Exploration"
          items={[
            {
              href: "/edge-of-knowledge/high-crystallinity-polyamide-fibers",
              label: "High-Crystallinity Polyamide Fibers",
            },
            {
              href: "/edge-of-knowledge/tpu-elastomer-networks",
              label: "Thermoplastic Polyurethane Elastomer Networks",
            },
            {
              href: "/edge-of-knowledge/polymer-discovery-validation",
              label: "Polymer Discovery (Validation-First, Non-Inventive)",
            },
            {
              href: "/edge-of-knowledge/semi-ipn-polyolefin-tpe",
              label: "Semi-Interpenetrating Network (Semi-IPN)",
            },
            {
              href: "/edge-of-knowledge/mineral-filled-polyolefin-barrier-films",
              label: "Mineral-Filled Polyolefin Barrier Films",
            },
            {
              href: "/edge-of-knowledge/hdpe-non-commutative-morphology",
              label:
                "Non-Commutative Morphology Encoding in Semicrystalline Polyolefins",
            },
            {
              href: "/edge-of-knowledge/beip-v1",
              label:
                "Boundary-Encoded Interfacial Persistence (BEIP v1) — Pre-Registered Protocol",
            },
            {
              href: "/edge-of-knowledge/human-ai-co-agency-boundary",
              label:
                "Human–AI Co-Agency Boundary — Minimal Decisive Experiment (Protocol)",
            },
            {
              href: "/edge-of-knowledge/inflammation-suppressing-microenvironment-polymer",
              label: "Inflammation-Suppressing Human Micro-Environment Polymer",
            },
            {
              href: "/edge-of-knowledge/suppressing-transferable-inflammatory-signaling",
              label:
                "Suppressing Transferable Inflammatory Signaling in Indoor Micro-Environments",
            },
            {
              href: "/edge-of-knowledge/passive-infrastructure-organophosphate-interruption",
              label:
                "Passive Infrastructure Polymers for Irreversible Interruption of Organophosphate Surface Transfer Pathways",
            },
            {
              href: "/edge-of-knowledge/irreversible-gradient-ratcheting-composites",
              label: "Irreversible Gradient-Ratcheting Composites (IGRC)",
            },
          ]}
        />

        <Section
          title="VI. Formal Epistemic Obstructions (Mathematics)"
          items={[
            {
              href: "/edge-of-knowledge/riemann-hypothesis-critical-line-structural-obstruction",
              label: "Riemann Hypothesis: Critical Line Structural Obstruction",
            },
            {
              href: "/edge-of-knowledge/collatz-conjecture-universal-descent-obstruction",
              label: "Collatz Conjecture: Universal Descent Obstruction",
            },
            {
              href: "/edge-of-knowledge/hodge-conjecture-algebraicity-obstruction",
              label: "Hodge Conjecture: Algebraicity Obstruction",
            },
          ]}
        />

        <Section
          title="VII. Operational Drift & Degradation"
          items={[
            {
              href: "/edge-of-knowledge/maintenance-drift-and-degradation-dynamics",
              label: "Maintenance Drift and Degradation Dynamics",
            },
          ]}
        />

        <Section
          title="VIII. Epistemic Instrumentation — Detection Before Damage"
          items={[
            {
              href: "/edge-of-knowledge/detection-before-damage",
              label: "Detection Before Damage: Formal Reduction",
            },
            {
              href: "/edge-of-knowledge/dqf-v1-1",
              label:
                "Drift Quantification Framework v1.1 (Regime-Bounded Drift Instrumentation)",
            },
          ]}
        />

        <Section
          title="IX. Adversarial & Incentive-Corrupted Regimes"
          items={[
            {
              href: "/edge-of-knowledge/adversarial-incentive-corrupted-regimes",
              label: "Adversarial & Incentive-Corrupted Regimes",
            },
            {
              href: "/edge-of-knowledge/drift-case-study-01",
              label:
                "Drift Case Study 01 — Incentive Pressure & Constraint Erosion",
            },
          ]}
        />

        <Section
          title="X. Meta-Failure of Knowledge Systems"
          items={[
            {
              href: "/edge-of-knowledge/meta-failure-of-knowledge-systems",
              label: "Meta-Failure of Knowledge Systems",
            },
            {
              href: "/edge-of-knowledge/boundary-of-meaning-vs-authority",
              label: "The Boundary of Meaning vs Authority",
            },
          ]}
        />

        <Section
          title="XI. Boundary Tests — Pre-Registered, Decisive Experiments"
          items={[
            {
              href: "/edge-of-knowledge/beip-v1",
              label: "Boundary-Encoded Interfacial Persistence (BEIP v1)",
            },
            {
              href: "/edge-of-knowledge/human-ai-co-agency-boundary",
              label: "Human–AI Co-Agency Boundary — Minimal Decisive Experiment",
            },
            {
              href: "/edge-of-knowledge/parent-state-emergency-intervention-boundary",
              label: "Parent–State Emergency Intervention Boundary (PSEIB-v1)",
            },
            {
              href: "/edge-of-knowledge/government-data-access-responsibility-boundary",
              label: "Government Data Access Responsibility Boundary (GDARB-v1)",
            },
            {
              href: "/edge-of-knowledge/corporate-shareholder-environment-boundary",
              label:
                "Corporate–Shareholder–Environment Responsibility Boundary (CSEB-v1)",
            },
            {
              href: "/edge-of-knowledge/auditor-management-unreported-risk-boundary",
              label:
                "Auditor–Management Responsibility Boundary: Known but Unreported Risk (AMURB-v1)",
            },
            {
              href: "/edge-of-knowledge/simulated-consciousness-boundary",
              label: "Simulated Consciousness Boundary Test (SCBT-v1)",
            },
          ]}
        />
      </div>

      <p className="mt-14 text-center text-sm leading-7 text-slate-400">
        Edge of Knowledge is a public research series. Documents are updated only
        by explicit revision and remain accessible for epistemic continuity.
      </p>
    </main>
  );
}
