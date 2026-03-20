// app/edge-of-knowledge/meta-failure-of-knowledge-systems/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meta-Failure of Knowledge Systems | Epistemic Authority Boundary",
  description:
    "A foundational boundary where instruments, models, or language are insufficient, causing collapse of epistemic authority.",
};

export default function MetaFailureOfKnowledgeSystemsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Epistemic Authority Collapse Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Meta-Failure of Knowledge Systems
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When reality exceeds the capacity of instruments, models, or language, knowledge loses authority.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Non-actionable · Regime-bounded · Authority collapse · Representation-limited
        </div>
      </section>

      {/* CORE LAW */}
      <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
        <h2 className="text-xl font-semibold text-white">Core Boundary</h2>

        <p className="mt-4 text-slate-300">
          Meta-failure occurs when the representational capacity of a system is
          insufficient to capture relevant aspects of reality.
        </p>

        <p className="mt-4 text-red-300">
          In this regime, claims produced by the system lose epistemic authority,
          regardless of rigor, confidence, or consensus.
        </p>
      </section>

      {/* FAILURE OF REPRESENTATION */}
      <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
        <h2 className="text-xl font-semibold text-white">
          Failure of Representation
        </h2>

        <p className="mt-4 text-slate-300">
          Systems rely on instruments, models, and language to represent reality.
        </p>

        <p className="mt-4 text-slate-300">
          When critical aspects of reality fall outside these representations:
        </p>

        <ul className="list-disc pl-6 mt-4 text-slate-300">
          <li>Observation becomes incomplete or distorted</li>
          <li>Communication becomes ambiguous or impossible</li>
          <li>Decision-making becomes misaligned</li>
          <li>Correction mechanisms fail</li>
        </ul>

        <p className="mt-4 text-red-300">
          The system no longer knows what it does not know.
        </p>
      </section>

      {/* AUTHORITY COLLAPSE */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Epistemic Authority Collapse
        </h2>

        <p className="mt-4 text-red-200">
          Under meta-failure, outputs may still be generated—but they are no
          longer justified as knowledge.
        </p>

        <p className="mt-4 text-red-200">
          Confidence, consensus, and procedural rigor do not restore validity.
        </p>

        <p className="mt-4 text-red-200">
          The system retains output capability but loses epistemic legitimacy.
        </p>
      </section>

      {/* CONSEQUENCES */}
      <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
        <h2 className="text-xl font-semibold text-white">System Consequences</h2>

        <ul className="list-disc pl-6 mt-4 text-slate-300">
          <li>Insight becomes unreliable</li>
          <li>Communication degrades</li>
          <li>Decisions accumulate hidden risk</li>
          <li>Innovation stalls at representational limits</li>
          <li>Correction loops fail to converge</li>
        </ul>
      </section>

      {/* NON-CONCLUSIONS */}
      <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
        <h2 className="text-xl font-semibold text-white">
          Non-Admissible Conclusions
        </h2>

        <ul className="list-disc pl-6 mt-4 text-slate-300">
          <li>Confidence implies correctness</li>
          <li>Consensus implies validity</li>
          <li>Procedural rigor compensates for representational limits</li>
          <li>Unknown unknowns can be bounded without new tools</li>
        </ul>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
        <h2 className="text-xl font-semibold text-white">
          Invariant Framework
        </h2>

        <p className="mt-4 text-slate-300">
          <strong>G:</strong> Representation-preserving transformations
        </p>
        <p className="text-slate-300">
          <strong>Q:</strong> Underlying reality (unbounded)
        </p>
        <p className="text-slate-300">
          <strong>S:</strong> Representable subset of reality
        </p>

        <p className="mt-4 text-red-300">
          Failure: Q exceeds S while the system treats S as complete
        </p>
      </section>

      {/* CLAIM BOUNDARY */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Claim Eligibility Boundary
        </h2>

        <p className="mt-4 text-red-200">
          Any claim made beyond the representational capacity of the system is invalid.
        </p>

        <p className="mt-4 text-red-200">
          Outputs may exist—but they do not constitute knowledge.
        </p>
      </section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          When tools of knowing fail, systems do not merely produce error—they
          lose the right to claim knowledge. Recovery requires expansion of
          representation, not refinement within it.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Non-actionable · Representation-bound · Authority-limited · Versioned
      </div>
    </main>
  );
}
