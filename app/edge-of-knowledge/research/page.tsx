// app/edge-of-knowledge/research/page.tsx

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

type ResearchLink = {
  href: string;
  label: string;
};

type ResearchDomain = {
  numeral: string;
  title: string;
  description: string;
  items: ResearchLink[];
};

const domains: ResearchDomain[] = [
  {
    numeral: "I",
    title: "Doctrine — Governing Action Under Uncertainty",
    description:
      "Foundational doctrine for action when optimization, certainty, or standard decision logic no longer holds.",
    items: [
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
        label: "Non-Commutative Morphology Trajectories in Polymer Durability",
      },
      {
        href: "/edge-of-knowledge/epistemic-lock-in",
        label: "Epistemic Lock-In After Risk Acknowledgment",
      },
    ],
  },
  {
    numeral: "II",
    title: "Governance-Driven Failure Modes",
    description:
      "Failure classes created not only by technical breakdown, but by procedural drift, threshold erosion, and broken responsibility structures.",
    items: [
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
    ],
  },
  {
    numeral: "III",
    title: "Failure Visibility & Accountability",
    description:
      "Research on signaling, traceability, and material or system-level visibility before damage, neglect, or deception become irreversible.",
    items: [
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
    ],
  },
  {
    numeral: "IV",
    title: "Boundary Research — Physically Allowed, Non-Scalable",
    description:
      "Boundary-space research on phenomena that may be physically real yet resist straightforward scaling, commercialization, or simplification.",
    items: [
      {
        href: "/edge-of-knowledge/damage-activated-nitrogen-fixation",
        label: "Damage-Activated Nitrogen Fixation",
      },
      {
        href: "/edge-of-knowledge/salt-gradient-desalination-wick",
        label: "Salt-Gradient Desalination Wick",
      },
    ],
  },
  {
    numeral: "V",
    title: "Validation-First Materials Exploration",
    description:
      "Validation-bounded materials work focused on constraint mapping, durability, and non-inventive exploration under epistemic discipline.",
    items: [
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
    ],
  },
  {
    numeral: "VI",
    title: "Formal Epistemic Obstructions (Mathematics)",
    description:
      "Mathematical boundary work focused on structural obstructions, non-resolution conditions, and the formal limits of proof trajectories.",
    items: [
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
    ],
  },
  {
    numeral: "VII",
    title: "Operational Drift & Degradation",
    description:
      "Operational research on maintenance drift, degradation dynamics, and how systems quietly move away from their validated state.",
    items: [
      {
        href: "/edge-of-knowledge/maintenance-drift-and-degradation-dynamics",
        label: "Maintenance Drift and Degradation Dynamics",
      },
    ],
  },
  {
    numeral: "VIII",
    title: "Epistemic Instrumentation — Detection Before Damage",
    description:
      "Instrumentation frameworks for detecting drift, violation, and hidden degradation before visible failure arrives.",
    items: [
      {
        href: "/edge-of-knowledge/detection-before-damage",
        label: "Detection Before Damage: Formal Reduction",
      },
      {
        href: "/edge-of-knowledge/dqf-v1-1",
        label:
          "Drift Quantification Framework v1.1 (Regime-Bounded Drift Instrumentation)",
      },
    ],
  },
  {
    numeral: "IX",
    title: "Adversarial & Incentive-Corrupted Regimes",
    description:
      "Research on systems operating under conflict, gaming, corruption pressure, or incentive structures that erode truth and constraint.",
    items: [
      {
        href: "/edge-of-knowledge/adversarial-incentive-corrupted-regimes",
        label: "Adversarial & Incentive-Corrupted Regimes",
      },
      {
        href: "/edge-of-knowledge/drift-case-study-01",
        label:
          "Drift Case Study 01 — Incentive Pressure & Constraint Erosion",
      },
    ],
  },
  {
    numeral: "X",
    title: "Meta-Failure of Knowledge Systems",
    description:
      "Second-order failure analysis of institutions, meaning systems, and authority structures that collapse while appearing coherent.",
    items: [
      {
        href: "/edge-of-knowledge/meta-failure-of-knowledge-systems",
        label: "Meta-Failure of Knowledge Systems",
      },
      {
        href: "/edge-of-knowledge/boundary-of-meaning-vs-authority",
        label: "The Boundary of Meaning vs Authority",
      },
    ],
  },
  {
    numeral: "XI",
    title: "Boundary Tests — Pre-Registered, Decisive Experiments",
    description:
      "Pre-registered boundary tests designed to make responsibility, authority, or decisive thresholds visible under controlled conditions.",
    items: [
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
    ],
  },
];

function DomainCard({ numeral, title, description, items }: ResearchDomain) {
  return (
    <section className="group relative overflow-hidden rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm transition duration-300 hover:border-sky-800/60 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_26px_80px_rgba(0,0,0,0.50)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.06),transparent_28%)] opacity-70" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="mt-0.5 inline-flex min-w-[2.75rem] items-center justify-center rounded-full border border-sky-900/60 bg-sky-950/50 px-2.5 py-1 text-xs font-semibold tracking-[0.16em] text-sky-300">
          {numeral}
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {description}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 h-px w-full bg-gradient-to-r from-transparent via-sky-800/45 to-transparent" />

      <ul className="relative z-10 mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
            >
              <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
              <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SignalPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-950/45 bg-slate-950/65 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

export default function EdgeOfKnowledgeIndexPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-2 sm:px-8 lg:px-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-950/45 bg-slate-950/72 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_30px_100px_rgba(0,0,0,0.50)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
        <div className="relative z-10 grid items-center gap-12 px-8 py-10 md:px-10 md:py-12 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              MCAI Research Layer
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-[3.55rem] xl:leading-[1.04]">
              Edge of Knowledge
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
              Research on failure, uncertainty, and responsible action where
              optimization breaks.
            </p>

            <p className="mt-6 max-w-3xl text-[16px] leading-8 text-slate-300">
              This is not product design. Not policy. Not speculation. These
              are governed analyses of what happens when systems remain coherent
              while becoming wrong.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SignalPill
                label="Scope"
                value="Failure, uncertainty, drift, and responsible action."
              />
              <SignalPill
                label="Mode"
                value="Regime-bounded research rather than product thesis."
              />
              <SignalPill
                label="Purpose"
                value="Clarify boundaries before consequence hardens."
              />
            </div>
          </div>

          <div className="flex justify-center xl:justify-end">
            <div className="relative flex w-full max-w-[420px] items-center justify-center rounded-[2rem] border border-sky-950/40 bg-slate-950/45 p-8 shadow-[0_0_64px_rgba(59,130,246,0.16)]">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,rgba(56,189,248,0.10),transparent_60%)]" />
              <Image
                src="/assets/image_research_trans_01.png"
                alt="Edge of Knowledge research emblem"
                width={340}
                height={340}
                priority
                className="relative z-10 h-auto w-full max-w-[300px] object-contain opacity-95 drop-shadow-[0_0_60px_rgba(59,130,246,0.32)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl py-14 text-center">
        <p className="text-lg leading-9 text-slate-300 md:text-xl">
          Systems rarely fail by collapse.
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl xl:text-[2.8rem]">
          They become internally consistent and externally wrong.
        </h2>

        <div className="mx-auto mt-6 h-px w-24 bg-sky-500/40" />

        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-slate-400">
          Edge of Knowledge exists to detect epistemic decoupling before
          consequence becomes irreversible.
        </p>
      </section>

      <section className="rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            The Governing System
          </h2>
        </div>

        <p className="mt-5 max-w-4xl text-[16px] leading-8 text-slate-300">
          Research alone is not sufficient. At the edge of knowledge, governing
          action depends on a sequence: define the boundary, detect violation,
          and constrain before lock-in converts drift into consequence.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Research", "Defines the boundary."],
            ["Instrumentation", "Detects violation."],
            ["Constraint", "Intervenes before lock-in."],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-sky-900/40 bg-slate-900/72 p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/8 to-transparent opacity-60" />
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                  {title}
                </p>
                <p className="mt-4 text-lg font-medium leading-8 text-white">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-400">
          Without that sequence, governance becomes documentation of failure.
        </p>
      </section>

      <section className="mt-12 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Foundational Doctrine
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Governing action when certainty, optimization, and standard logic no
            longer apply.
          </h2>
          <p className="mt-4 text-[16px] leading-8 text-slate-400">
            This anchor text establishes the operating doctrine for action under
            uncertainty and frames the broader research system that follows.
          </p>

          <Link
            href="/edge-of-knowledge"
            className="mt-6 inline-flex items-center gap-2 text-lg font-medium text-sky-300 transition hover:text-sky-200"
          >
            <span className="underline decoration-sky-800/40 underline-offset-4">
              Governing Action at the Edge of Knowledge
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Research Domains
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-[2.35rem]">
              Structured by governing function
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Each domain groups work by epistemic role so readers can move
            through doctrine, failure, visibility, validation, and boundary
            research without losing system context.
          </p>
        </div>

        <div className="grid gap-8 2xl:grid-cols-2">
          {domains.map((domain) => (
            <DomainCard key={domain.title} {...domain} />
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[1.75rem] border border-sky-950/40 bg-slate-950/55 px-6 py-6 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.04)] backdrop-blur-sm">
        <p className="text-sm leading-7 text-slate-400">
          Documents are regime-bounded and updated only through explicit
          revision. Public continuity is preserved so epistemic movement remains
          visible rather than overwritten.
        </p>
      </section>
    </main>
  );
}
