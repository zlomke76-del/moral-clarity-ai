import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Stewardship Canon | Moral Clity AI",
  description:
    "A foundational doctrine defining responsible action in a post-experimental civilization where irreversibility, uncertainty, and scale dominate.",
  openGraph: {
    title: "The Stewardship Canon",
    description:
      "A framework for responsible action when experimentation, reversal, and centralized control no longer suffice.",
    url: "https://moralclarity.ai/stewardship-canon",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CANON_SECTIONS = [
  {
    numeral: "I",
    title: "The Core Failure Mode",
    body: [
      "The fundamental error of modern civilization is treating irreversible, large-scale collective action as if it were an experiment—proceeding as though consequences are knowable, reversible, and subject to later correction.",
      "In reality, each such action irreversibly alters a shared world beyond the comprehension or control of any individual, institution, or model.",
    ],
  },
  {
    numeral: "II",
    title: "The Non-Negotiable Shift",
    body: [
      "Decision-making must move from seeking optimal or maximal outcomes to making bounded, provisional commitments under explicit uncertainty.",
      "Actions are not final solutions. They are enduring responsibilities undertaken within systems whose stability cannot be guaranteed.",
      "Stewardship replaces mastery.",
    ],
  },
  {
    numeral: "III",
    title: "The New Unit of Responsibility",
    body: [
      "Responsibility no longer resides primarily in individuals or centralized authorities.",
      "It is carried by overlapping, adaptive collectives: groups, practices, and embedded networks that continuously monitor, signal, and constrain one another.",
      "Moral action emerges from reciprocal vigilance and correction, not isolated virtue or singular command.",
    ],
  },
  {
    numeral: "IV",
    title: "The Constraint That Replaces Optimization",
    body: [
      "Optimization must be permanently subordinated to constraint.",
      "Every action must be bounded in advance by limits designed to prevent cascading, unrecoverable harm, regardless of incentives, momentum, partial knowledge, or perceived benefit.",
      "What cannot be safely constrained must not be pursued.",
    ],
  },
  {
    numeral: "V",
    title: "What This Makes Possible",
    body: [
      "Within this framework, progress remains possible—but it takes a different form.",
      "Progress becomes the stabilization of resilient patterns, cooperative feedback loops, distributed safeguards, and adaptive practices that preserve livability over time.",
      "Improvement is measured not by scale, speed, or dominance, but by continuity, adaptability, and sustained coexistence.",
    ],
  },
  {
    numeral: "VI",
    title: "What Must Be Permanently Abandoned",
    body: [
      "To act responsibly at irreversible scale, humanity must relinquish the pursuit of comprehensive control, the expectation of absolute certainty, the belief in fully reversible trial-and-error, the assumption of clear causal attribution after harm, the notion that individual or institutional rectitude alone is sufficient, and the drive for unbounded expansion or unchecked efficiency.",
      "These ambitions are no longer compatible with shared survival.",
    ],
  },
];

const ABANDONMENTS = [
  "the pursuit of comprehensive control",
  "the expectation of absolute certainty",
  "the belief in fully reversible trial-and-error",
  "the assumption of clear causal attribution after harm",
  "the notion that individual or institutional rectitude alone is sufficient",
  "the drive for unbounded expansion or unchecked efficiency",
];

const STABILIZATIONS = [
  "resilient patterns",
  "cooperative feedback loops",
  "distributed safeguards",
  "adaptive practices that preserve livability over time",
];

export default function StewardshipCanonPage() {
  return (
    <main className="relative overflow-hidden bg-[#020817]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.14),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.08),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-8 lg:px-10 lg:py-20 space-y-8">
        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#20160a]/95 via-[#12141b]/92 to-black/92 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-100/85">
                  Stewardship Canon
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Canonical
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Immutable
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                  The Stewardship Canon
                </h1>
                <p className="max-w-4xl text-lg leading-8 text-white/82">
                  A framework for responsible action in a post-experimental
                  civilization.
                </p>
                <p className="max-w-4xl text-base leading-8 text-white/68 md:text-lg">
                  Stewardship begins where irreversibility, uncertainty, and
                  scale strip away the illusion of mastery. This canon defines
                  the discipline required when correction is incomplete,
                  authority is insufficient, and consequences outlive intention.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Condition
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Irreversible intervention into shared systems.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Shift
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  From optimization and mastery to bounded responsibility.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Orientation
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Preserve viability when certainty and control no longer hold.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PREAMBLE + DOCTRINE */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Preamble
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              Humanity has entered an era in which many of its most
              consequential actions are no longer experiments. They are
              irreversible interventions into shared systems whose full dynamics
              cannot be known in advance and cannot be cleanly corrected after
              the fact.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              In this condition, responsibility cannot be grounded in
              prediction, optimization, authority, or intent alone. It must be
              grounded in stewardship: the disciplined maintenance of shared
              viability under permanent uncertainty and accelerating power.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              The Stewardship Canon defines how action remains possible when
              experimentation, reversal, and centralized control no longer
              suffice.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Canonical Orientation
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Stewardship replaces mastery.
            </p>
            <p className="mt-4 text-base leading-8 text-white/66">
              Responsibility is no longer measured by how much can be controlled,
              but by how faithfully shared viability is preserved under
              uncertainty, scale, and irreversible consequence.
            </p>
          </div>
        </section>

        {/* SECTION STACK */}
        <section className="grid gap-5">
          {CANON_SECTIONS.map((section) => (
            <section
              key={section.numeral}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.025] via-transparent to-transparent opacity-80" />
              <div className="relative grid gap-6 md:grid-cols-[90px_1fr]">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                    Canon
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight text-amber-100/90 md:text-4xl">
                    {section.numeral}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
                    {section.title}
                  </h2>
                  {section.body.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-8 text-white/70 md:text-[1.02rem]"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.numeral === "V" && (
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                        Stabilization Targets
                      </div>
                      <ul className="mt-4 grid gap-3 md:grid-cols-2">
                        {STABILIZATIONS.map((item) => (
                          <li
                            key={item}
                            className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/78"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.numeral === "VI" && (
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                        Permanent Abandonments
                      </div>
                      <ul className="mt-4 grid gap-3 md:grid-cols-2">
                        {ABANDONMENTS.map((item) => (
                          <li
                            key={item}
                            className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/78"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </section>

        {/* CLOSING */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Closing Orientation
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              The Stewardship Canon does not promise safety, control, or
              redemption.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              It offers a discipline.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              Responsibility is grounded not in hope for mastery or reversal,
              but in a commitment to limit harm, preserve viability, and sustain
              common life—especially when certainty, authority, and consensus
              are unavailable.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              This is the condition of our time. Stewardship is how action
              remains possible within it.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/72 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Invariant
            </div>
            <p className="mt-3 text-xl leading-8 text-white md:text-2xl">
              What cannot be safely constrained must not be pursued.
            </p>
            <p className="mt-4 text-base leading-7 text-white/64">
              Stewardship does not eliminate uncertainty. It disciplines action
              inside it.
            </p>
          </div>
        </section>

        {/* STATUS */}
        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                Status
              </div>
              <p className="mt-2 text-sm leading-7 text-white/72">
                Canonical · Immutable
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                Revision Policy
              </div>
              <p className="mt-2 text-sm leading-7 text-white/72">
                The Canon is fixed. Interpretations may evolve; the text does
                not.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
