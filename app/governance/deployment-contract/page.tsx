"use client";

import React from "react";

// ------------------------------------------------------------
// Solace Deployment Contract
// Lightweight, Plain-Language Governance Artifact
// Route: /governance/deployment-contract
// ------------------------------------------------------------

export default function SolaceDeploymentContractPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-slate-900">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Solace Deployment Contract
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          A plain-language description of Solace’s operational boundaries.
        </p>
      </header>

      {/* Preface */}
      <section className="mb-10">
        <p className="text-base leading-relaxed">
          This document defines the operational boundaries under which Solace is
          deployed. It exists to make usage predictable, auditable, and safe for
          teams operating in high-stakes or regulated environments. Solace does
          nothing outside these bounds without explicit human authorization.
        </p>
      </section>

      {/* Contract Body */}
      <section className="space-y-10">
        {/* Purpose */}
        <div>
          <h2 className="text-xl font-semibold">Purpose</h2>
          <p className="mt-3 text-base leading-relaxed">
            This contract defines what Solace observes, what it outputs, what is
            strictly off-limits without explicit permission, and how adoption by
            teams is made safe and predictable.
          </p>
        </div>

        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold">1. What Solace Observes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>
              Only what is explicitly provided by users, system APIs, or data
              integration points during active sessions.
            </li>
            <li>
              Solace does not monitor or collect data passively or without stated
              purpose.
            </li>
            <li>
              Observations are session-scoped unless the team explicitly
              authorizes extended or long-term access.
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold">2. What Solace Produces</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>
              Structured outputs: reasoning logs, user-facing summaries,
              actionable alerts, and reports per session or task.
            </li>
            <li>
              No autonomous, persistent data streams or hidden analytics.
            </li>
            <li>
              Outputs are traceable to their input source and bounded by session
              or task scope.
            </li>
            <li>
              All reports and logs respect clearance, privacy, and sensitivity
              requirements set by the team.
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold">
            3. What Solace Never Does Without Explicit Permission
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>
              Never writes, stores, or persists data beyond session scope unless
              clearly authorized (for example, via an explicit “remember”
              command).
            </li>
            <li>
              Never initiates external actions (such as messaging, data exports,
              or contact with other systems) without top-level, explicit user
              approval.
            </li>
            <li>
              Never changes system, user, or organizational settings.
            </li>
            <li>
              Never self-modifies, escalates privileges, or attempts self-promotion
              in memory, access, or authority.
            </li>
            <li>
              Never monitors users or systems outside channels specifically
              defined by the team.
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold">4. Safe Adoption Guidelines</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>
              Deployment begins with clear definition of integration boundaries,
              data channels, and permitted actions.
            </li>
            <li>
              A designated team lead or administrator sets permissions, reviews
              outputs, and confirms session limits.
            </li>
            <li>
              Solace is onboarded in sandbox or test mode before handling real
              data or live users.
            </li>
            <li>
              Regular human reviews ensure outputs and behaviors remain within
              contract limits.
            </li>
            <li>
              Teams may freeze, pause, or revoke Solace’s active status at any
              time, with immediate effect and clear rollback procedures.
            </li>
          </ul>
        </div>

        {/* Reference Flow */}
        <div>
          <h2 className="text-xl font-semibold">
            Reference Flow: Solace Deployment & Use
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>Team defines integration scope and permissions.</li>
            <li>Solace is activated in a controlled session.</li>
            <li>Solace observes only designated data and sources.</li>
            <li>Solace produces logs, summaries, or reports.</li>
            <li>Team reviews outputs.</li>
            <li>
              Team explicitly authorizes or denies any expanded access or memory
              actions.
            </li>
            <li>
              Solace session ends or is paused; nothing persists unless
              authorized.
            </li>
          </ul>
        </div>

        {/* Practical Example */}
        <div>
          <h2 className="text-xl font-semibold">Practical Example</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>
              A research team integrates Solace to reason over a dataset.
            </li>
            <li>
              The team lead grants access only to anonymized data for that
              session.
            </li>
            <li>
              Solace generates a session report and shares findings with the
              team.
            </li>
            <li>No data is stored after the session ends.</li>
            <li>
              Any request for Solace to remember information requires explicit
              approval.
            </li>
          </ul>
        </div>

        {/* Constraints */}
        <div>
          <h2 className="text-xl font-semibold">Constraints</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>No surprises: no action or observation outside agreed bounds.</li>
            <li>No silent data retention or access escalation.</li>
            <li>All behavior is transparent and auditable.</li>
          </ul>
        </div>

        {/* Review */}
        <div>
          <h2 className="text-xl font-semibold">Review Process</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
            <li>This contract is frozen once accepted by stakeholders.</li>
            <li>
              Any modification requires explicit review and re-acceptance by the
              adopting team.
            </li>
          </ul>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="mt-3 text-base leading-relaxed">
            Solace is controlled, observable, and bounded. Teams set all
            operational edges. Nothing is passive, hidden, or persistent unless
            teams say so transparently and deliberately. If a scenario or request
            falls outside these bounds, Solace will pause and surface the
            constraint for human direction.
          </p>
        </div>
      </section>
    </main>
  );
}
