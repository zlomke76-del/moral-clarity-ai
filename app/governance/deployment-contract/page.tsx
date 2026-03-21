"use client";

import React from "react";

// ------------------------------------------------------------
// Solace Deployment Contract
// Elevated Public Governance Artifact
// Route: /governance/deployment-contract
// ------------------------------------------------------------

export default function SolaceDeploymentContractPage() {
  const sections = [
    {
      number: "01",
      title: "What Solace Observes",
      body: "Solace observes only what is explicitly provided through active user interaction, declared system APIs, or designated integration points inside an authorized session.",
      bullets: [
        "No passive monitoring.",
        "No undisclosed collection.",
        "No observation outside declared channels.",
        "All observation remains bounded to the active session unless extended access is explicitly approved.",
      ],
    },
    {
      number: "02",
      title: "What Solace Produces",
      body: "Solace produces bounded outputs tied to a defined task, session, or review surface. Output exists to make reasoning, risk, and constraint legible—not to create hidden influence or uncontrolled persistence.",
      bullets: [
        "Structured summaries, logs, alerts, and reports.",
        "Traceable output bounded to stated source and scope.",
        "No hidden analytics streams.",
        "No uncontrolled persistent output channels.",
      ],
    },
    {
      number: "03",
      title: "What Solace Never Does Without Explicit Permission",
      body: "Permission is the controlling boundary. If authority is not clearly granted, the action does not occur.",
      bullets: [
        "No storage or persistence beyond session scope unless explicitly authorized.",
        "No messaging, export, transmission, or external action without top-level user approval.",
        "No system, organizational, or user setting changes.",
        "No self-modification, privilege escalation, or authority expansion.",
        "No monitoring outside channels specifically defined by the adopting team.",
      ],
    },
    {
      number: "04",
      title: "Safe Adoption Conditions",
      body: "Deployment is admissible only if Solace is introduced through explicit boundaries, controlled permissions, and human review authority.",
      bullets: [
        "Integration scope and permitted actions are defined before use.",
        "A designated human owner sets permissions and reviews outputs.",
        "Sandbox or test-mode onboarding precedes live deployment.",
        "Outputs are reviewed regularly against contract limits.",
        "Solace can be paused, frozen, or revoked immediately.",
      ],
    },
    {
      number: "05",
      title: "Reference Flow",
      body: "The deployment flow is designed to preserve bounded observation, bounded output, and explicit human authority at every transition point.",
      bullets: [
        "Team defines scope and permissions.",
        "Solace is activated inside a controlled session.",
        "Solace observes only designated sources.",
        "Solace produces bounded logs, summaries, or reports.",
        "The team reviews outputs before any expanded action.",
        "Any memory or access expansion requires explicit approval.",
        "The session ends or pauses; nothing persists unless authorized.",
      ],
    },
    {
      number: "06",
      title: "Practical Example",
      body: "A research team authorizes Solace to reason over anonymized data for a single session. Solace produces a report, the team reviews the output, and no persistence occurs after session end unless explicitly approved.",
      bullets: [
        "Access is scoped to anonymized session data.",
        "Output is limited to the authorized task.",
        "Nothing is retained automatically.",
        "Any memory request requires a new explicit permission event.",
      ],
    },
  ];

  const invariants = [
    "No surprises.",
    "No silent retention.",
    "No hidden observation.",
    "No authority without permission.",
    "No persistence without explicit approval.",
    "No action outside declared bounds.",
  ];

  const contractEdges = [
    {
      label: "Observation",
      value: "Declared only",
    },
    {
      label: "Persistence",
      value: "Permission-gated",
    },
    {
      label: "Authority",
      value: "Human-controlled",
    },
    {
      label: "Intervention",
      value: "Immediate revoke",
    },
  ];

  return (
    <main className="relative overflow-hidden bg-[#020817] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 lg:px-10 lg:py-20 space-y-8">
        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#081427]/95 via-[#0b1220]/92 to-black/92 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/85">
                  Solace Deployment Contract
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Plain-Language Governance Artifact
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Operational Boundary
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                  Solace Deployment Contract
                </h1>
                <p className="max-w-4xl text-lg leading-8 text-white/82">
                  A public contract defining what Solace may observe, what it
                  may produce, what it will never do without explicit human
                  permission, and how deployment remains bounded, auditable, and
                  revocable.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.08] p-5">
                <p className="text-sm leading-7 text-cyan-100/90">
                  <span className="font-semibold">Contract Position:</span>{" "}
                  Solace does nothing outside these bounds without explicit human
                  authorization. If authority is absent, the action does not
                  occur.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Scope
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Bounded observation, bounded output, bounded authority.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Standard
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Nothing passive, hidden, persistent, or externally active
                  without explicit approval.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Control
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Teams retain immediate pause, freeze, and revoke authority.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTRACT ORIENTATION */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Purpose
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This contract defines what Solace observes, what it outputs, what
              remains strictly off-limits without explicit permission, and how
              adoption by teams is made operationally safe and predictable.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              It exists to make deployment legible before trust is assumed. The
              contract is not descriptive branding. It is the boundary by which
              usage remains governable.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Operational Position
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Authority stays with the team.
            </p>
            <p className="mt-4 text-base leading-8 text-white/66">
              Solace operates only inside declared boundaries. It does not
              create authority through persistence, hidden memory, silent access,
              or self-expansion.
            </p>
          </div>
        </section>

        {/* CONTRACT EDGES */}
        <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1220]/92 via-[#08101d]/92 to-black/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-10">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Contract Edges
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              The deployment surface is bounded at every layer
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-white/66 md:text-base">
              These are the primary control edges that keep deployment from
              drifting into silent persistence, uncontrolled action, or ambiguous
              authority.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {contractEdges.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  {item.label}
                </div>
                <div className="mt-3 text-xl font-semibold tracking-tight text-white">
                  {item.value}
                </div>
              </div>
            ))}
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
                  <p className="text-base leading-8 text-white/70 md:text-[1.02rem]">
                    {section.body}
                  </p>
                  <ul className="grid gap-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/78"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </section>

        {/* CONSTRAINTS / REVIEW */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Constraints
            </div>
            <ul className="mt-5 space-y-3">
              {invariants.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/76"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Review Process
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This contract is frozen once accepted by stakeholders.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              Any modification requires explicit review and renewed acceptance
              by the adopting team. Boundaries do not change by drift,
              assumption, or convenience.
            </p>
          </div>
        </section>

        {/* SUMMARY / INVARIANT */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Summary
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              Solace is controlled, observable, and bounded. Teams define the
              operational edges. Nothing is passive, hidden, or persistent
              unless teams authorize it transparently and deliberately.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              If a scenario or request falls outside these bounds, Solace does
              not improvise authority. It pauses and surfaces the constraint for
              human direction.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/72 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Invariant
            </div>
            <p className="mt-3 text-xl leading-8 text-white md:text-2xl">
              If permission is absent, the action does not exist.
            </p>
            <p className="mt-4 text-base leading-7 text-white/64">
              Solace remains bounded not by trust alone, but by explicit
              authority, visible limits, and immediate revocability.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
