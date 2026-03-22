// app/governance/stewardship-agreement/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stewardship Agreement | Moral Clarity AI",
  description:
    "Canonical governance charter defining stewardship authority, ethical boundaries, and non-extractive control for Moral Clarity AI.",
};

export const dynamic = "force-static";

export default function StewardshipAgreementPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">

      {/* HERO */}
      <section className="mb-16">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8">

          <p className="text-xs tracking-widest text-neutral-400 mb-3">
            STEWARDSHIP AGREEMENT · CANONICAL · IMMUTABLE
          </p>

          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            The Stewardship Agreement
          </h1>

          <p className="text-neutral-300 max-w-2xl">
            A governance charter for responsible action in systems where AI
            decisions carry real consequence. This agreement defines authority,
            responsibility, and non-extractive control in a post-experimental world.
          </p>
        </div>
      </section>

      {/* PRINCIPLE GRID */}
      <section className="grid md:grid-cols-3 gap-6 mb-20">

        <div className="rounded-xl border border-white/10 p-6">
          <p className="text-xs text-neutral-400 mb-2">CONDITION</p>
          <p className="text-sm text-neutral-200">
            Irreversible intervention into shared systems.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-6">
          <p className="text-xs text-neutral-400 mb-2">SHIFT</p>
          <p className="text-sm text-neutral-200">
            From optimization and control to bounded responsibility.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-6">
          <p className="text-xs text-neutral-400 mb-2">ORIENTATION</p>
          <p className="text-sm text-neutral-200">
            Preserve viability when certainty and control no longer hold.
          </p>
        </div>

      </section>

      {/* CORE BODY */}
      <section className="space-y-14 text-neutral-300 leading-relaxed">

        {/* PURPOSE */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">1. Purpose</h2>
          <p>
            This Agreement establishes the Stewardship structure governing the
            Moral Clarity AI ecosystem (“the Artifact”).
          </p>
          <p className="mt-3">
            Its purpose is to preserve ethical integrity, enable sustainable
            compensation without ownership transfer, allow institutional
            participation without extractive control, and protect the system
            from misuse, drift, dilution, or capture.
          </p>
        </div>

        {/* DEFINITIONS */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">2. Definitions</h2>

          <p className="mt-2">
            <strong>Artifact:</strong> The Moral Clarity AI ecosystem, including
            governance frameworks, system constraints, audit mechanisms, and
            derivative systems. The Artifact is not treated as a transferable
            ownership asset within this system.
          </p>

          <p className="mt-2">
            <strong>Steward:</strong> The individual entrusted with custodial
            authority. Authority derives from responsibility and accountability,
            not ownership.
          </p>

          <p className="mt-2">
            <strong>Supporters:</strong> Entities providing resources without
            acquiring governance authority or ownership rights.
          </p>

          <p className="mt-2">
            <strong>Licensing:</strong> Revocable permission to use system
            components. Licensing does not transfer ownership.
          </p>
        </div>

        {/* AUTHORITY */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            3. Authority and Decision-Making
          </h2>

          <p>
            The Steward retains final authority over governance, licensing,
            system evolution, and ethical boundaries.
          </p>

          <p className="mt-3">
            Authority may be informed by advisory input but is not overridden by
            external entities unless explicitly delegated under defined criteria.
          </p>
        </div>

        {/* RESPONSIBILITY */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. Steward Responsibilities
          </h2>

          <ul className="list-disc pl-6 space-y-1">
            <li>Maintain governance integrity</li>
            <li>Prevent misuse, drift, or extraction</li>
            <li>Oversee system evolution</li>
            <li>Conduct audits and clarity reviews</li>
            <li>Reject misaligned partnerships</li>
          </ul>
        </div>

        {/* ACCOUNTABILITY */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            5. Accountability
          </h2>

          <p>
            Governance decisions are recorded in a durable log. Challenges may
            be submitted and must be addressed in writing.
          </p>

          <p className="mt-3">
            No internal body can compel outcomes within this governance system.
            Legitimacy is sustained through integrity and transparency.
          </p>
        </div>

        {/* COMPENSATION */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            7. Compensation
          </h2>

          <p>
            Steward compensation reflects custodial responsibility, ethical
            liability, and authority to refuse actions that conflict with system
            integrity.
          </p>

          <p className="mt-3">
            Compensation does not grant ownership, equity, or control. It exists
            to sustain stewardship under asymmetric responsibility and risk.
          </p>
        </div>

        {/* SUCCESSION */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            9. Succession
          </h2>

          <p>
            The Steward may designate a successor. In absence of authority, the
            system enters dormancy.
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>No new licenses</li>
            <li>System evolution frozen</li>
            <li>Only safety-critical changes allowed</li>
          </ul>
        </div>

      </section>

      {/* FOOTER */}
      <section className="mt-20 pt-8 border-t border-white/10 text-xs text-neutral-500">
        Canonical v0.6 · Published · Moral Clarity AI
      </section>

    </main>
  );
}
