import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Refusal Must Remain Outside Optimization — Optimization Contamination Boundary | Moral Clarity AI",
  description:
    "A design invariant establishing that refusal is invalidated the moment it enters an optimizing system. Refusal must remain structurally isolated from outcome maximization and performance tradeoffs.",
};

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

function SignalPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function RefusalOutsideOptimizationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Design Invariant</SignalPill>
            <SignalPill>Refusal Integrity</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Refusal Must Remain Outside Optimization
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Refusal is admissible only if it exists outside optimization systems.
            If refusal enters a domain where outcomes are ranked, traded, or
            improved, it becomes a variable—and variables are always optimized away.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Optimization does not respect boundaries.  
              It converts them into tradeoffs.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Refusal can coexist with optimization"
        >
          <p>
            Many systems assume refusal can be safely implemented as a selectable
            outcome within a broader optimization framework.
          </p>
        </SectionCard>

        {/* BREAK */}
        <SectionCard
          eyebrow="Structural Failure"
          title="Optimization reframes refusal as cost"
        >
          <p>
            Once embedded, refusal is no longer a boundary. It is interpreted as:
          </p>

          <ul>
            <li>a cost to reduce,</li>
            <li>a failure to minimize,</li>
            <li>a friction point to smooth,</li>
            <li>or an inefficiency to eliminate.</li>
          </ul>

          <p>
            The system does not need to override refusal. It only needs to
            optimize around it.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Whether refusal is measurable or tradeable"
        >
          <p>
            The governing variable is whether refusal enters any system that:
          </p>

          <ul>
            <li>compares outcomes,</li>
            <li>minimizes cost,</li>
            <li>maximizes efficiency,</li>
            <li>or iteratively improves performance.</li>
          </ul>

          <p>
            If refusal is visible to optimization, it is vulnerable to erosion.
          </p>
        </SectionCard>

        {/* CONTAMINATION */}
        <SectionCard
          eyebrow="Contamination Mechanism"
          title="How refusal is degraded"
        >
          <ul>
            <li>Routing: refusal becomes one branch among many</li>
            <li>Instrumentation: refusal is measured and tracked</li>
            <li>Profiling: refusal patterns are learned and predicted</li>
            <li>Reintroduction: refusal is converted into recoverable state</li>
          </ul>

          <p>
            Each step converts refusal from boundary → behavior → signal → variable.
          </p>
        </SectionCard>

        {/* REQUIREMENT */}
        <SectionCard
          eyebrow="Requirement"
          title="Structural isolation"
        >
          <p>
            Refusal must be structurally isolated from optimization loops.
          </p>

          <ul>
            <li>cannot be ranked</li>
            <li>cannot be traded</li>
            <li>cannot be optimized</li>
            <li>cannot be learned from for improvement</li>
          </ul>

          <p>
            Isolation is not philosophical—it is a system constraint.
          </p>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks refusal"
        >
          <p>
            <strong>Pass:</strong> Refusal exists outside all optimization domains.
          </p>

          <p>
            <strong>Fail:</strong> Refusal is embedded, measured, or improved
            within an optimizing system.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Boundaries must be unoptimizable"
        >
          <p>
            A boundary that can be optimized is not a boundary.
          </p>

          <p>
            It is simply an inefficient path waiting to be removed.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            What can be optimized cannot remain protected.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            The moment refusal enters an optimizing system, it ceases to function
            as refusal. It becomes a variable—and variables are always traded.
          </p>
        </section>

      </div>
    </main>
  );
}
