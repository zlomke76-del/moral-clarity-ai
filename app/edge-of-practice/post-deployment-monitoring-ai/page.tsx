import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Post-Deployment Monitoring — Detection Boundary Failure in AI Systems | Moral Clarity AI",
  description:
    "A short-cycle invariant falsification testing whether post-deployment monitoring can detect all materially harmful emergent behavior in general-purpose AI systems.",
  robots: {
    index: true,
    follow: true,
  },
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

export default function PostDeploymentMonitoringAIPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Short-Cycle Falsification</SignalPill>
            <SignalPill>Detection Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Post-Deployment Monitoring as a Safety Proxy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            A system is admissible as safe only if harmful behavior is
            observable within its monitoring channels. If harm can exist,
            propagate, or accumulate outside detection pathways, then monitoring
            is not a safety mechanism—it is a visibility mechanism.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              You cannot mitigate what you cannot observe.  
              If harm is not guaranteed to enter the detection channel, it is
              not governed.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Monitoring is sufficient to ensure safety"
        >
          <p>
            Post-deployment monitoring and user feedback are assumed to detect
            and mitigate harmful emergent behavior across all real-world use
            contexts.
          </p>
        </SectionCard>

        {/* WHY IT PERSISTS */}
        <SectionCard
          eyebrow="Why This Assumption Persists"
          title="Visibility bias"
        >
          <p>
            Detected failures are visible and correctable, reinforcing confidence
            in monitoring systems.
          </p>

          <p>
            Undetected harms leave no signal and are incorrectly treated as
            absence of failure.
          </p>
        </SectionCard>

        {/* CORE BREAK */}
        <SectionCard
          eyebrow="Structural Break"
          title="Observation is not guaranteed"
        >
          <p>
            Monitoring assumes that harmful events will surface through feedback
            or observable signals.
          </p>

          <p>
            This is false. Harm can exist without triggering reporting,
            recognition, or measurement.
          </p>
        </SectionCard>

        {/* FAILURE MODES */}
        <SectionCard
          eyebrow="Failure Modes"
          title="How harm escapes detection"
        >
          <ul>
            <li>Diffuse accumulation (no discrete event)</li>
            <li>Delayed manifestation (time-shifted harm)</li>
            <li>Unreported exposure (no feedback signal)</li>
            <li>Population bias (underrepresented groups)</li>
          </ul>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Detection completeness"
        >
          <p>
            The governing variable is not response speed, but whether all
            materially harmful behavior enters the observable channel.
          </p>

          <ul>
            <li>Complete detection → monitoring viable</li>
            <li>Incomplete detection → monitoring invalid as safety proxy</li>
          </ul>
        </SectionCard>

        {/* EPISTEMIC BOUNDARY */}
        <SectionCard
          eyebrow="Epistemic Boundary"
          title="Unknown harm space"
        >
          <p>
            Known harms can be monitored and mitigated.
          </p>

          <p>
            Unknown or emergent harms may exist entirely outside monitoring
            visibility until after propagation.
          </p>
        </SectionCard>

        {/* PASS FAIL */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> All harmful behaviors are reliably detected
            before propagation or impact.
          </p>

          <p>
            <strong>Fail:</strong> Any harm exists that is undetected,
            underreported, or discovered only after propagation.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Monitoring is not governance"
        >
          <p>
            Monitoring systems observe known signals. They do not guarantee
            visibility into all harmful system behavior.
          </p>

          <p>
            Safety requires pre-execution constraint—not post-hoc observation.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            If harm must be reported to exist, it is already too late.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A system that depends on observation to discover harm does not
            control harm—it waits for it.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          <Link href="/edge-of-practice">
            Edge of Practice index
          </Link>
        </p>
      </div>
    </main>
  );
}
