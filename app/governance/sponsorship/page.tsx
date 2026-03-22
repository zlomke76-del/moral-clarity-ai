// app/governance/sponsorship/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsorship Charter | Moral Clarity AI",
  description:
    "A framework for supporting Moral Clarity AI without ownership, control, or extraction.",
};

export const dynamic = "force-static";

export default function SponsorshipCharterPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">

      {/* HERO */}
      <section className="mb-16">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8">

          <p className="text-xs tracking-widest text-neutral-400 mb-3">
            SPONSORSHIP CHARTER · CANONICAL · NON-EXTRACTIVE
          </p>

          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Sponsorship, Without Control
          </h1>

          <p className="text-neutral-300 max-w-2xl">
            AI systems are becoming powerful enough to shape real-world outcomes.
            Supporting their development responsibly requires a model that
            preserves independence, not ownership. This charter defines how
            Moral Clarity AI can be supported without being captured.
          </p>
        </div>
      </section>

      {/* PRINCIPLE GRID */}
      <section className="grid md:grid-cols-3 gap-6 mb-20">

        <div className="rounded-xl border border-white/10 p-6">
          <p className="text-xs text-neutral-400 mb-2">MODEL</p>
          <p className="text-sm text-neutral-200">
            Support without ownership.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-6">
          <p className="text-xs text-neutral-400 mb-2">BOUNDARY</p>
          <p className="text-sm text-neutral-200">
            No control over governance or outcomes.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-6">
          <p className="text-xs text-neutral-400 mb-2">PURPOSE</p>
          <p className="text-sm text-neutral-200">
            Preserve independence under scale and pressure.
          </p>
        </div>

      </section>

      {/* BODY */}
      <section className="space-y-14 text-neutral-300 leading-relaxed">

        {/* PURPOSE */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Purpose</h2>
          <p>
            Sponsorship exists to support the stewardship, infrastructure, and
            propagation of Moral Clarity AI without transferring ownership,
            governance authority, or extractive rights.
          </p>
          <p className="mt-3">
            This model ensures the system remains aligned to truth, safety, and
            long-term viability—even when external incentives would otherwise
            distort it.
          </p>
        </div>

        {/* WHAT IT IS */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            What Sponsorship Is
          </h2>

          <p>
            Sponsorship is non-controlling support that sustains:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Stewardship and governance labor</li>
            <li>Infrastructure and operational stability</li>
            <li>Research, audits, and safety work</li>
            <li>Responsible expansion of the system</li>
          </ul>

          <p className="mt-3">
            Sponsors enable the system to exist without shaping its decisions.
          </p>
        </div>

        {/* WHAT IT IS NOT */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            What Sponsorship Is Not
          </h2>

          <ul className="list-disc pl-6 space-y-1">
            <li>No ownership or equity</li>
            <li>No governance authority or voting rights</li>
            <li>No influence over ethical or system decisions</li>
            <li>No access to private or user-level data</li>
            <li>No preferential extraction or advantage</li>
          </ul>

          <p className="mt-3">
            This structure is intentional. Independence is preserved by design.
          </p>
        </div>

        {/* GOVERNANCE */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Governance and Authority
          </h2>

          <p>
            Moral Clarity AI operates under a Stewardship model. Final authority
            over governance, licensing, and ethical boundaries resides with the
            Steward.
          </p>

          <p className="mt-3">
            Governance is defined publicly in the Stewardship Agreement.
          </p>

          <Link
            href="/governance/stewardship-agreement"
            className="inline-block mt-3 text-blue-400"
          >
            View the Stewardship Agreement →
          </Link>
        </div>

        {/* TRANSPARENCY */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Transparency
          </h2>

          <ul className="list-disc pl-6 space-y-1">
            <li>Public access to governance documents</li>
            <li>Disclosure of material changes</li>
            <li>High-level reporting on sponsorship use</li>
          </ul>

          <p className="mt-3">
            Transparency is designed to create trust without enabling control.
          </p>
        </div>

        {/* LICENSING */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Licensing Separation
          </h2>

          <p>
            Sponsorship does not grant access, integration, or commercial
            advantage. Licensing decisions are evaluated independently.
          </p>
        </div>

        {/* ETHICAL BOUNDARIES */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Ethical Boundaries
          </h2>

          <p>
            Sponsorship will not be accepted if it introduces ownership,
            control, extraction, or compromise of system integrity.
          </p>
        </div>

        {/* INTENT */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Statement of Intent
          </h2>

          <p>
            Sponsorship is participation in a system that must remain governed,
            not owned.
          </p>

          <p className="mt-3">
            It reflects the belief that:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>AI systems require independent governance</li>
            <li>Ethical infrastructure must resist capture</li>
            <li>Stewardship is legitimate and necessary labor</li>
          </ul>
        </div>

      </section>

      {/* FOOTER */}
      <section className="mt-20 pt-8 border-t border-white/10 text-xs text-neutral-500">
        Canonical · Moral Clarity AI · Public Governance Document
      </section>

    </main>
  );
}
