// app/liability-and-governance/page.tsx
// ============================================================
// GOVERNANCE, AUTHORITY, AND LIABILITY STATEMENT
// Elevated public governance artifact
// Route: /liability-and-governance
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liability and Governance | Moral Clarity AI",
  description:
    "Governance, authority, and liability statement for Moral Clarity AI. Defines human accountability, refusal, execution-time controls, and non-delegable responsibility.",
  openGraph: {
    title: "Liability and Governance | Moral Clarity AI",
    description:
      "A public governance statement defining non-delegable human authority, organizational accountability, refusal, auditability, and execution-time control.",
    url: "https://moralclarity.ai/liability-and-governance",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

const sections = [
  {
    number: "01",
    title: "Legal Status and Scope",
    body: [
      "This system is a tool within the meaning of applicable product, safety, and artificial intelligence regulation, including the EU Artificial Intelligence Act.",
      "It is not a legal subject, an autonomous agent, or a bearer of rights, interests, or duties.",
      "The system has no moral, legal, or psychological status. All governance obligations attach to natural persons and legal entities involved in its design, deployment, and use.",
    ],
  },
  {
    number: "02",
    title: "Allocation of Authority",
    body: [
      "All authority to make binding decisions resides with identified human actors and the deploying organization.",
      "The system provides non-binding assistance only, does not exercise discretion over final outcomes, and does not initiate irreversible actions independently.",
      "Decision authority is role-defined, explicitly assigned, and non-delegable to the system. At no point may the system be treated as a decision-maker under law.",
    ],
  },
  {
    number: "03",
    title: "Responsibility and Liability",
    body: [
      "Responsibility and liability for the system’s outputs, recommendations, and downstream effects rest exclusively with the deploying organization and designated human decision-makers.",
      "Liability is not shared with, not transferred to, and not mitigated by the system itself.",
      "The system cannot bear fault, absorb legal responsibility, or be treated as an intervening cause. All harms remain attributable to human and organizational actors, consistent with product liability and negligence standards.",
    ],
  },
  {
    number: "04",
    title: "Refusal, Interruption, and Human Override",
    body: [
      "Refusal and non-action are mandatory system capabilities, not exceptions.",
      "The system is designed to refuse requests that violate legal, operational, or safety constraints, halt execution under uncertainty where harm may be irreversible, and escalate to qualified human review when predefined thresholds are met.",
      "Human override mechanisms are continuously available, procedurally defined, logged, and auditable. The system has no authority to override its own constraints.",
    ],
  },
  {
    number: "05",
    title: "Risk Controls and Execution Constraints",
    body: [
      "Operational constraints are defined externally by humans and enforced at execution time.",
      "These include legal compliance boundaries, sector-specific risk limits, reversibility thresholds, and escalation requirements.",
      "No learned behavior, optimization objective, or internal system state may supersede these controls.",
    ],
  },
  {
    number: "06",
    title: "Transparency, Logging, and Auditability",
    body: [
      "All material system actions are logged to enable post-hoc review and regulatory inspection.",
      "Logs make legible who authorized use, who reviewed or approved outcomes, when refusals or halts occurred, and why execution was permitted or denied.",
      "Lack of traceability constitutes a governance failure.",
    ],
  },
  {
    number: "07",
    title: "Prohibition on Anthropomorphic Framing",
    body: [
      "The system is not described, designed, or governed using language that implies wellbeing, internal values, moral standing, or psychological states.",
      "Such framing is explicitly rejected as incompatible with clear allocation of responsibility and liability.",
    ],
  },
  {
    number: "08",
    title: "Regulatory Alignment Principle",
    body: [
      "This governance framework is designed to preserve human agency, localize accountability, prevent diffusion of responsibility, and ensure enforceable compliance.",
      "If authority, responsibility, or liability cannot be clearly located for a given use case, the system must not be deployed in that context.",
    ],
  },
];

const controls = [
  "Humans decide",
  "Organizations remain accountable",
  "Execution is constrained at runtime",
  "Refusal is mandatory where boundaries fail",
  "Authority cannot be delegated to the system",
  "Traceability is required for legitimacy",
];

const prohibitions = [
  "No legal personhood",
  "No autonomous decision authority",
  "No liability transfer to the system",
  "No override of external constraints",
  "No anthropomorphic governance framing",
  "No deployment where accountability is unclear",
];

export default function LiabilityAndGovernancePage() {
  return (
    <main className="relative overflow-hidden bg-[#020817] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 lg:px-10 lg:py-20 space-y-8">
        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#081427]/95 via-[#0b1220]/92 to-black/92 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/85">
                  Governance Statement
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Authority
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Liability
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                  Governance, Authority, and Liability Statement
                </h1>
                <p className="max-w-4xl text-lg leading-8 text-white/82">
                  This document defines enforceable governance constraints for
                  authority, responsibility, refusal, and execution-time
                  control. It is not an aspirational principles page. It is a
                  boundary statement for accountable deployment.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.08] p-5">
                <p className="text-sm leading-7 text-cyan-100/90">
                  <span className="font-semibold">Binding Position:</span> The
                  system is a tool. Humans retain decision authority.
                  Organizations retain accountability. Liability does not
                  migrate into software.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Authority
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Always human, always explicit, never delegated to the system.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Liability
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Remains with natural persons and legal entities.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Enforcement
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Runtime constraints, refusal, override, and auditable logs.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ORIENTATION */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Scope
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This page defines the legal and operational boundary for how Moral
              Clarity AI systems are governed in deployment. It clarifies where
              authority resides, where liability remains attached, and what
              control mechanisms must exist for use to remain legitimate.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              It rejects the diffusion of responsibility into language,
              interface, or model behavior. Clear accountability is not optional.
              It is the condition of lawful and governable use.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Governing Position
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              If authority cannot be located, deployment is invalid.
            </p>
            <p className="mt-4 text-base leading-8 text-white/66">
              The system cannot bear responsibility, absorb liability, or serve
              as a substitute for identified human decision-makers.
            </p>
          </div>
        </section>

        {/* CONTROL GRID */}
        <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1220]/92 via-[#08101d]/92 to-black/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-10">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Core Governance Controls
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              The non-delegable structure of accountable deployment
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                Required
              </div>
              <ul className="mt-4 space-y-3">
                {controls.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/78"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/55 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                Prohibited
              </div>
              <ul className="mt-4 space-y-3">
                {prohibitions.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/78"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION STACK */}
        <section className="grid gap-5">
          {sections.map((section) => (
            <section
              key={section.number}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.025] via-transparent to-transparent opacity-80" />
              <div className="relative grid gap-6 md:grid-cols-[96px_1fr]">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                    Section
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight text-cyan-100/90 md:text-4xl">
                    {section.number}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
                    {section.title}
                  </h2>
                  {section.body.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-8 text-white/70 md:text-[1.02rem]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </section>

        {/* RELATION TO OTHER PAGES */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Link
            href="/governance/deployment-contract"
            className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:bg-white/[0.05]"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Related Artifact
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              Deployment Contract
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/66">
              Defines what Solace may observe, produce, retain, refuse, and do
              only with explicit permission.
            </p>
          </Link>

          <Link
            href="/governance-audit"
            className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:bg-white/[0.05]"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Related Artifact
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              Governance Audit
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/66">
              Diagnoses where governance fails under opacity, incentive
              distortion, and accountability collapse.
            </p>
          </Link>

          <Link
            href="/stewardship-canon"
            className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:bg-white/[0.05]"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Canonical Context
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              Stewardship Canon
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/66">
              The deeper doctrine behind bounded responsibility, irreversible
              consequence, and disciplined action under uncertainty.
            </p>
          </Link>
        </section>

        {/* CLOSING */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Final Statement
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              Compliance is not achieved through narrative, aspiration, or good
              intent. It is achieved only through structural enforceability.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              This system is governed such that humans decide, organizations are
              accountable, and execution remains constrained by law-aligned
              controls at the point of action.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              Anything less is non-compliant by design.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/72 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Invariant
            </div>
            <p className="mt-3 text-xl leading-8 text-white md:text-2xl">
              Liability does not disappear into software.
            </p>
            <p className="mt-4 text-base leading-7 text-white/64">
              If authority, responsibility, and control are not structurally
              located in humans and institutions, governance does not exist.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
