import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Indoor Optical Aging of Polysulfone — Persistence Irreversibility Boundary | Moral Clarity AI",
  description:
    "A persistence-level constraint artifact testing whether ordinary indoor daylight exposure causes irreversible yellowing and transmission loss in polysulfone over multi-year timescales.",
  robots: { index: true, follow: true },
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

function SignalPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "irreversible" | "fail";
}) {
  const toneClass =
    tone === "irreversible"
      ? "border-rose-600/30 bg-rose-600/20 text-rose-800 dark:text-rose-300"
      : tone === "fail"
        ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
        : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function PSUOpticalAgingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Persistence</SignalPill>
            <SignalPill tone="irreversible">Irreversibility Layer</SignalPill>
            <SignalPill>Optical Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Indoor Optical Aging of Polysulfone
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Polysulfone is admissible as optically persistent only if ordinary
            indoor daylight exposure does not accumulate irreversible
            photo-oxidative change sufficient to produce permanent yellowing or
            transmission loss over multi-year timescales.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              An optical material is <strong>admissible as persistent</strong>{" "}
              only if ordinary indoor photon exposure does not silently
              accumulate irreversible color-center formation and transmission
              loss. If indoor residence alone can drive visible yellowing or
              measurable clarity collapse, the material is not stable—it is a
              delayed optical failure system.
            </p>
          </div>
        </section>

        {/* REGIME */}
        <SectionCard
          eyebrow="Persistence Regime"
          title="Optical irreversibility under ordinary indoor light"
        >
          <p>
            This entry belongs to the persistence layer because the governing
            mechanism is not acute UV overexposure, thermal shock, or rapid
            weathering. The critical event is slow photo-oxidative accumulation
            under low-intensity indoor daylight over years.
          </p>

          <p>
            Time is the operative mechanism. Light intensity remains modest; the
            accumulated photon dose and oxidative history are what convert
            apparent stability into irreversible optical loss.
          </p>
        </SectionCard>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Indoor daylight does not materially age PSU optics"
        >
          <p>
            The assumption under test is that polysulfone maintains color and
            transparency during years-long indoor daylight exposure.
          </p>
        </SectionCard>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Irreversible Physical Mechanism"
          title="Low-intensity photo-oxidation and color-center formation"
        >
          <p>
            The governing mechanism is slow photo-oxidation from low-intensity
            indoor light, leading to permanent color-center formation and
            progressive transmission loss.
          </p>

          <p>
            The failure does not require strong outdoor UV exposure to become
            real. It emerges from long-duration optical residence under
            conditions commonly treated as benign.
          </p>
        </SectionCard>

        {/* WHY PERSISTENCE */}
        <SectionCard
          eyebrow="Why Persistence Timescales Are Required"
          title="Accelerated tests misclassify the ordinary pathway"
        >
          <p>
            Accelerated tests often fail to reproduce the cumulative photon dose
            profile and oxidative stress pattern typical of indoor environments.
          </p>

          <p>
            The governing pathway is not extreme event exposure. It is quiet
            accumulation under ordinary light conditions, visible only after
            long residence time.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="PSU behind glass under indirect indoor daylight"
        >
          <ul>
            <li>Polysulfone sheets mounted behind window glass</li>
            <li>Indirect daylight exposure only</li>
            <li>Ambient indoor environmental conditions</li>
            <li>No UV-stabilizing coating or corrective treatment</li>
            <li>Duration: 2–4 years</li>
          </ul>

          <p>
            The system is intentionally ordinary. The claim is not about extreme
            solar loading. It is about whether routine indoor light exposure
            itself contains a delayed optical degradation pathway.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Time-to-visible and measurable optical degradation"
        >
          <p>
            The governing variable is the elapsed indoor exposure time required
            for ordinary daylight residence to produce irreversible color shift
            or transmission loss beyond admissible limits.
          </p>

          <ul>
            <li>Early clarity retention is non-admissible evidence of persistence</li>
            <li>Low early yellowing is still governing optical accumulation</li>
            <li>Final color or transmission loss is the terminal expression of long-silent degradation</li>
          </ul>

          <p>
            In the persistence regime, “still looks clear” is not equivalent to
            optical stability if the material is already moving toward an
            irreversible threshold.
          </p>
        </SectionCard>

        {/* MVP */}
        <SectionCard
          eyebrow="MVP Persistence Experiment"
          title="Minimal admissible long-horizon test"
        >
          <p>
            Mount PSU sheets behind window glass under indirect daylight in
            ordinary indoor conditions for 2–4 years, with no outdoor exposure,
            no accelerated UV forcing, and no protective surface rescue.
          </p>

          <p>
            The purpose is not to optimize optical lifetime. The purpose is to
            determine whether indoor daylight residence alone is sufficient to
            create irreversible optical aging.
          </p>
        </SectionCard>

        {/* KILL CONDITION */}
        <SectionCard
          eyebrow="Binary Kill Condition"
          title="What breaks the claim"
        >
          <p>
            The claim fails if either of the following becomes true during the
            persistence interval:
          </p>

          <ul>
            <li>Delta E greater than 3</li>
            <li>Greater than 10% loss in light transmission</li>
          </ul>

          <p>
            Once either appears, the system has crossed from delayed optical
            aging into irreversible functional degradation.
          </p>
        </SectionCard>

        {/* PROBABILITY */}
        <SectionCard
          eyebrow="Estimated Probability"
          title="Expected failure likelihood under the stated regime"
        >
          <p>
            Estimated probability of persistence-level failure under the defined
            regime: <strong>0.7–0.8</strong>
          </p>

          <p>
            This estimate is not the conclusion. It is the prior expectation
            attached to the long-horizon test.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure would mean"
        >
          <p>
            Failure would show that polysulfone under ordinary indoor daylight
            cannot be treated as indefinitely color-stable or optically neutral
            simply because the light environment appears mild.
          </p>

          <p>
            Indoor residence would then be revealed as an active optical aging
            regime rather than a passive holding condition.
          </p>
        </SectionCard>

        {/* VERDICT FRAME */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <div className="mb-3 text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Persistence Judgment
            </div>
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              SURVIVES
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              Delta E remains at or below 3 and light transmission loss remains
              at or below 10% across the full persistence interval.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-600/30 bg-rose-600/10 p-8">
            <div className="mb-3 text-xs uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
              Persistence Judgment
            </div>
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              IRREVERSIBLE FAILURE
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              Delta E exceeds 3 or light transmission loss exceeds 10%, showing
              that ordinary indoor daylight accumulates into irreversible optical
              degradation.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A transparent material is not optically stable because the light is mild.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If ordinary indoor daylight can mature into permanent yellowing or
            transmission loss through elapsed time alone, then the apparent
            stability of polysulfone was always conditional on insufficient
            residence time.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/edge-of-practice">Short-Cycle</Link> ·{" "}
          <Link href="/edge-of-practice/extended-cycle">Extended Cycle</Link> ·{" "}
          <Link href="/edge-of-practice/persistence">Persistence Index</Link>
        </p>
      </div>
    </main>
  );
}
