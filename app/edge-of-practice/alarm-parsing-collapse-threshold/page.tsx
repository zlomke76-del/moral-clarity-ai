import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Alarm Parsing Collapse Threshold — Cognitive Admissibility Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining the cognitive admissibility boundary where alarm volume and complexity exceed human parsing capacity, rendering safe intervention non-admissible.",
  openGraph: {
    title: "Alarm Parsing Collapse Threshold",
    description:
      "Defines the boundary where alarm overload renders safe clinical response non-admissible.",
    url: "https://moralclarity.ai/edge-of-practice/alarm-parsing-collapse-threshold",
    siteName: "Moral Clarity AI",
    type: "article",
  },
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
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

function SignalPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "fail" | "pass";
}) {
  const toneClass =
    tone === "fail"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : tone === "pass"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : "border-zinc-300/70 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function AlarmParsingCollapsePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex gap-2 flex-wrap">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Cognitive Boundary</SignalPill>
                <SignalPill>RCS Constraint</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Alarm Parsing Collapse Threshold
              </h1>

              <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl">
                Safe clinical intervention is valid only while alarm volume,
                rate, and complexity remain within human cognitive parsing
                capacity. Beyond this boundary, intervention becomes
                non-admissible.
              </p>

              <div className="mt-8 rounded-2xl border bg-black text-white p-6">
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Core Boundary Doctrine
                </div>
                <p className="text-lg">
                  Clinical safety is <strong>non-admissible</strong> once alarm
                  input exceeds human parsing capacity. Additional signals
                  increase failure probability rather than reduce it.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 text-white p-10 space-y-4">
              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  Alarm streams remain parseable, prioritizable, and actionable
                  within human cognitive limits.
                </p>
              </div>

              <div className="border border-rose-400/20 bg-rose-500/10 p-4 rounded-xl">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Alarm rate, volume, or complexity exceeds parsing capacity,
                  preventing reliable prioritization and response.
                </p>
              </div>

              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing scale
                </div>
                <p className="text-sm">
                  Human cognition: perception, working memory, and decision
                  latency under time pressure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONSTRAINT */}
        <SectionCard
          eyebrow="Constraint Definition"
          title="What the boundary enforces"
        >
          <p>
            The Alarm Parsing Collapse Threshold (APCT) is crossed when cumulative
            alarm input exceeds the clinician’s ability to parse, prioritize, and
            act before physiological harm accumulates.
          </p>

          <p>
            Beyond this point, additional alarms reduce safety. The system no
            longer supports valid intervention.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="Cognitive capacity defines admissibility"
        >
          <ul>
            <li>Alarm rate (alarms per unit time)</li>
            <li>Alarm concurrency (simultaneous signals)</li>
            <li>Signal complexity and ambiguity</li>
            <li>Decision latency under load</li>
          </ul>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Modes"
          title="Falsification conditions"
        >
          <ul>
            <li>Missed critical alarms during high-volume intervals</li>
            <li>Incorrect prioritization of competing signals</li>
            <li>Delayed intervention beyond safe physiological window</li>
          </ul>

          <p>
            <strong>Continuity of responsibility is non-admissible during collapse.</strong>
          </p>
        </SectionCard>

        {/* WHY FAILS */}
        <SectionCard
          eyebrow="Failure of Prevailing Models"
          title="Why current systems break"
        >
          <ul>
            <li>Optimization for sensitivity, not interpretability</li>
            <li>False alarms treated as isolated rather than cumulative</li>
            <li>Assumption of recovery after overload</li>
            <li>Continuous responsibility assumption during saturation</li>
          </ul>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="Structural consequences"
        >
          <ul>
            <li>No actor can act effectively beyond threshold</li>
            <li>More alarms can increase harm</li>
            <li>Responsibility becomes structurally incoherent</li>
          </ul>
        </SectionCard>

        {/* RELATION */}
        <SectionCard
          eyebrow="Constraint Class"
          title="Related cognitive collapse regimes"
        >
          <ul>
            <li>
              <Link href="/edge-of-practice/irreversible-cognitive-dead-zones">
                Aviation automation handoffs
              </Link>
            </li>
            <li>
              <Link href="/edge-of-practice/autonomous-handoff-blackout">
                Autonomous vehicle transitions
              </Link>
            </li>
          </ul>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              Alarm input remains within human parsing capacity. Signals are
              interpretable, prioritized correctly, and acted on within safe time.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              Alarm overload exceeds cognitive capacity. Safe intervention becomes
              non-admissible regardless of intent or expertise.
            </p>
          </div>
        </section>

        {/* INVARIANT */}
        <section className="bg-zinc-950 text-white p-10 rounded-2xl">
          <p className="text-2xl font-semibold">
            Safety requires parseability.
          </p>
          <p className="mt-4 text-zinc-300">
            When signals cannot be parsed, decisions cannot be made. When
            decisions cannot be made, responsibility and safety are no longer
            defined.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          Published as part of the Edge of Practice. Fixed at publication.
          Revision requires explicit versioning.
        </p>
      </div>
    </main>
  );
}
