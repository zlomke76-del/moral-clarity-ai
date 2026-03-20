import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Takeover Blackout Interval — Temporal Admissibility Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining the temporal boundary where human takeover in autonomous systems becomes non-admissible due to irreducible cognitive reconstruction limits.",
  openGraph: {
    title: "Takeover Blackout Interval",
    description:
      "Defines the boundary where human takeover becomes physically impossible.",
    url: "https://moralclarity.ai/edge-of-practice/autonomous-handoff-blackout",
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

export default function AutonomousHandoffBlackoutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex gap-2 flex-wrap">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Temporal Boundary</SignalPill>
                <SignalPill>RCS Constraint</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Takeover Blackout Interval
              </h1>

              <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl">
                Human takeover in autonomous systems is valid only if sufficient
                time exists for cognitive state reconstruction. Below this
                threshold, intervention becomes physically non-admissible.
              </p>

              <div className="mt-8 rounded-2xl border bg-black text-white p-6">
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Core Boundary Doctrine
                </div>
                <p className="text-lg">
                  Intervention is <strong>non-admissible</strong> when available
                  time is less than required human cognitive reconstruction time.
                  No training, alerting, or intent can overcome this boundary.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 text-white p-10 space-y-4">
              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  Time-to-intervention exceeds perception, comprehension, and
                  action latency.
                </p>
              </div>

              <div className="border border-rose-400/20 bg-rose-500/10 p-4 rounded-xl">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Available time is shorter than required cognitive recovery,
                  creating a blackout interval.
                </p>
              </div>

              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing scale
                </div>
                <p className="text-sm">
                  Human perception, context reconstruction, and motor response latency.
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
            The Takeover Blackout Interval (TBI) is the irreducible time window
            after automation disengagement during which a human cannot reconstruct
            sufficient situational awareness to act safely.
          </p>

          <p>
            During this interval, safe intervention is not degraded—it is
            physically impossible.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="Time determines admissibility"
        >
          <ul>
            <li>Time-to-collision or hazard (TTC)</li>
            <li>Perception latency</li>
            <li>Context reconstruction time</li>
            <li>Decision and motor execution latency</li>
          </ul>

          <p>
            If TTC &lt; total cognitive reconstruction time → intervention is non-admissible.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Modes"
          title="Falsification conditions"
        >
          <ul>
            <li>Delayed or absent corrective steering or braking</li>
            <li>Incorrect situational interpretation during takeover</li>
            <li>Collision despite immediate driver intent to intervene</li>
          </ul>

          <p>
            <strong>
              Behavioral framing is non-admissible. Failure is physiological.
            </strong>
          </p>
        </SectionCard>

        {/* WHY FAIL */}
        <SectionCard
          eyebrow="Failure of Prevailing Models"
          title="Why current approaches break"
        >
          <ul>
            <li>Assume continuous recoverability of human supervision</li>
            <li>Treat takeover as instantaneous</li>
            <li>Frame failure as attention or behavior</li>
            <li>Rely on alerts that cannot compress biology</li>
          </ul>

          <p>
            Alerts shift awareness, not time. Time remains the limiting variable.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="Irreversible blackout intervals"
        >
          <ul>
            <li>There exist intervals where no human action can succeed</li>
            <li>Longer automation increases latent takeover risk</li>
            <li>Responsibility becomes structurally incoherent</li>
          </ul>

          <p>
            When the blackout interval is entered, control transfer is an illusion.
          </p>
        </SectionCard>

        {/* RELATION */}
        <SectionCard
          eyebrow="Constraint Class"
          title="Related cognitive boundaries"
        >
          <ul>
            <li>
              <Link href="/edge-of-practice/irreversible-cognitive-dead-zones">
                Aviation handoff failures
              </Link>
            </li>
            <li>
              <Link href="/edge-of-practice/alarm-parsing-collapse-threshold">
                Medical alarm collapse thresholds
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
              Sufficient time exists for perception, understanding, and action.
              Human takeover remains physically possible.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              Time is insufficient for cognitive reconstruction. Intervention is
              physically impossible regardless of intent or training.
            </p>
          </div>
        </section>

        {/* INVARIANT */}
        <section className="bg-zinc-950 text-white p-10 rounded-2xl">
          <p className="text-2xl font-semibold">
            Time cannot be compressed below biology.
          </p>
          <p className="mt-4 text-zinc-300">
            When required cognition exceeds available time, control is not lost—
            it never exists.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          ← <Link href="/edge-of-practice">Back to Edge of Practice</Link>
        </p>
      </div>
    </main>
  );
}
