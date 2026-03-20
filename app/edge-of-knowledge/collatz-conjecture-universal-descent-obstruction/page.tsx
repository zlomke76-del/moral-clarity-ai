// app/edge-of-knowledge/collatz-conjecture-universal-descent-obstruction/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Collatz Conjecture — Universal Descent Obstruction | Moral Clarity AI",
  description:
    "A structural reduction identifying the universal descent assumption as the decisive epistemic obstruction in the Collatz conjecture.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8 shadow-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300 leading-7">
        {children}
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/60 p-4">
      <div className="text-xs uppercase tracking-widest text-sky-300">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Structural Obstruction
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Collatz Conjecture
          <br />
          Universal Descent Obstruction
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          All approaches depend on a descent mechanism that has not been shown to exist.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Epistemic Obstruction" />
          <Signal label="Dependency" value="Universal Descent" />
          <Signal label="Status" value="Unresolved / Blocking" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Regime-bounded · Non-actionable · No proof strategy implied
        </div>
      </section>

      {/* CORE STATEMENT */}
      <Section title="Core Statement">
        <p>
          The Collatz conjecture depends on the assumption that every trajectory
          is ultimately forced to descend to <code>1</code>.
        </p>
        <p>
          No structural mechanism has been identified that guarantees this
          behavior across all integers.
        </p>
      </Section>

      {/* SYSTEM DEFINITION */}
      <Section title="System Definition">
        <p>Define iteration on positive integers:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <code>aₖ₊₁ = aₖ / 2</code> if even
          </li>
          <li>
            <code>aₖ₊₁ = 3aₖ + 1</code> if odd
          </li>
        </ul>
        <p>
          The conjecture asserts convergence to <code>1</code> for all starting
          values.
        </p>
      </Section>

      {/* HIDDEN DEPENDENCY */}
      <Section title="Hidden Dependency">
        <p>
          All known approaches rely on a universal descent condition:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>No divergent trajectories</li>
          <li>No nontrivial cycles</li>
          <li>Eventual contraction of all orbits</li>
        </ul>
        <p>This dependency is assumed, not established.</p>
      </Section>

      {/* FAILURE OF METHODS */}
      <Section title="Why Existing Methods Fail">
        <ul className="list-disc pl-6 space-y-2">
          <li>Finite computation cannot establish universality</li>
          <li>Probabilistic decay does not exclude rare exceptions</li>
          <li>Modular analysis fragments but does not unify behavior</li>
          <li>No monotonic invariant governs all trajectories</li>
        </ul>
        <p>
          Each approach presupposes descent without proving it.
        </p>
      </Section>

      {/* OBSTRUCTION */}
      <Section title="Obstruction Mechanism">
        <p>
          The conjecture cannot close without demonstrating that every trajectory
          is constrained by a universal descent structure.
        </p>
        <p>
          In the absence of such a structure, divergence or cycling cannot be
          excluded.
        </p>
      </Section>

      {/* FALSIFIABLE */}
      <Section title="Falsifiable Constraint">
        <p>Resolution requires one of the following:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            A universal mechanism that guarantees descent for all integers
          </li>
          <li>
            A counterexample demonstrating divergence or nontrivial cycling
          </li>
        </ul>
        <p>
          Neither condition has been satisfied.
        </p>
      </Section>

      {/* NON-CONCLUSIONS */}
      <Section title="Invalid Conclusions">
        <ul className="list-disc pl-6 space-y-2">
          <li>Extensive computation implies truth</li>
          <li>Statistical decay implies universality</li>
          <li>Absence of counterexample implies nonexistence</li>
        </ul>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Structural Judgment
        </h2>
        <p className="mt-4 text-red-200">
          The Collatz conjecture is blocked by the absence of a universal descent
          mechanism. Without resolving this dependency, the conjecture cannot
          close.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Canonical · Regime-bounded · Versioned · Non-actionable
      </div>
    </main>
  );
}
