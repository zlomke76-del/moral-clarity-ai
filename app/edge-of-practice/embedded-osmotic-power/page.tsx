import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Embedded Osmotic Power — Constructive Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact testing whether incidental salinity gradients can produce continuous embedded energy under strict passive conditions using reverse electrodialysis.",
  openGraph: {
    title: "Embedded Osmotic Power — Constructive Constraint Boundary",
    description:
      "A governed Edge of Practice experiment testing embedded osmotic energy harvesting under real-world salinity gradients.",
    url: "https://moralclarity.ai/edge-of-practice/embedded-osmotic-power",
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

export default function EmbeddedOsmoticPowerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="pass">Constructive Constraint</SignalPill>
                <SignalPill>Osmotic Gradient</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Embedded Osmotic Power
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Salinity gradients become constructively usable only if
                continuous, passive, embedded systems can extract net energy
                without storage, control, or system disruption.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  Embedded osmotic energy is <strong>admissible</strong> only if
                  continuous passive operation produces stable output without
                  external energy, intervention, or degradation events.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">
                Boundary Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  Continuous net power emerges from real salinity gradients with
                  no intervention or auxiliary input.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Any collapse, fouling step, or external dependency appears.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM */}
        <SectionCard eyebrow="A) System Definition" title="Fixed passive system">
          <p>
            A reverse electrodialysis device embedded in existing water
            infrastructure harvests energy from real salinity gradients under
            continuous flow with no storage, control, or intervention.
          </p>
        </SectionCard>

        {/* ASSUMPTION */}
        <SectionCard eyebrow="B) Assumption" title="Widely held constraint">
          <p>
            Incidental salinity gradients cannot be practically exploited for
            continuous embedded energy under real-world conditions.
          </p>
        </SectionCard>

        {/* CANONICAL */}
        <SectionCard eyebrow="C) Canonical Structure" title="Invariant system">
          <ul>
            <li>Energy source: electrochemical gradient only</li>
            <li>No storage, buffering, or external input</li>
            <li>No optimization or averaging metrics</li>
            <li>Binary state only: stable or failed</li>
          </ul>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard eyebrow="Failure Signatures" title="Categorical triggers">
          <ul>
            <li>Output collapses below noise floor</li>
            <li>Voltage decays irreversibly</li>
            <li>Any maintenance is required</li>
            <li>External input becomes necessary</li>
          </ul>
        </SectionCard>

        {/* PROTOCOL */}
        <SectionCard eyebrow="Test Protocol" title="Minimal admissible test">
          <ul>
            <li>1 m² membrane system</li>
            <li>Real-world salinity interface</li>
            <li>14–30 days continuous operation</li>
            <li>No mitigation, no optimization</li>
          </ul>
        </SectionCard>

        {/* NON CLAIMS */}
        <SectionCard eyebrow="Non-Claims" title="Explicit exclusions">
          <ul>
            <li>No economic claims</li>
            <li>No grid relevance</li>
            <li>No scalability inference</li>
            <li>No policy or climate conclusions</li>
          </ul>
        </SectionCard>

        {/* SOLACE */}
        <SectionCard eyebrow="Solace Role" title="Enforcement only">
          <p>
            Solace enforces invariants and rejects interpretation, optimization,
            and extrapolation.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-900">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              No failure signatures occur over the test period.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-900">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              Any failure signature occurs → assumption upheld.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50">
          <p className="text-2xl font-semibold">
            Embedded gradients are valid only if they survive reality unassisted.
          </p>
          <p className="mt-4 text-zinc-300">
            Continuous passive operation is the only admissible proof. Anything
            else is interpretation.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          Governed by the{" "}
          <Link href="/edge-of-practice/canon">
            Edge Canon: Invariants, Not Interpretations
          </Link>
        </p>
      </div>
    </main>
  );
}
