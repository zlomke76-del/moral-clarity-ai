// app/newsroom/methodology/page.tsx
// ============================================================
// NEWSROOM METHODOLOGY
// Informative Infrastructure — Non-Authoritative
// ============================================================
// This page describes how Newsroom signals are computed.
// It does not justify conclusions or confer legitimacy.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import {
  Shield,
  Sigma,
  Radar,
  Eye,
  Ban,
  TriangleAlert,
  ScrollText,
  ChevronLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Newsroom Methodology | Moral Clarity AI",
  description:
    "An informative description of how Newsroom signals are mechanically aggregated. Scores are descriptive only and do not assess truth, intent, credibility, or ethics.",
  openGraph: {
    title: "Newsroom Methodology",
    description:
      "How Newsroom signals are calculated — informative only, non-authoritative, and canon-bounded.",
    url: "https://moralclarity.ai/newsroom/methodology",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function SectionCard({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-[28px] border border-white/8 bg-white/[0.025] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-7"
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="space-y-4 text-[15px] leading-7 text-white/68">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/90" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
      {children}
    </div>
  );
}

export default function NewsroomMethodologyPage() {
  return (
    <main className="grid h-screen min-h-0 w-screen grid-cols-[260px_minmax(0,1fr)] overflow-hidden bg-transparent text-white">
      <aside className="h-full overflow-y-auto border-r border-white/8 bg-neutral-950/70 backdrop-blur-xl">
        <NeuralSidebar />
      </aside>

      <section className="relative flex min-h-0 h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_22%),linear-gradient(180deg,rgba(4,10,24,0.96)_0%,rgba(3,7,18,0.995)_100%)]" />

        <div className="relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden px-8 py-8">
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="mx-auto w-full max-w-6xl">
              <header className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_28%),radial-gradient(circle_at_left,rgba(56,189,248,0.08),transparent_22%)]" />

                <div className="relative z-10">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <Link
                      href="/newsroom/cabinet"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/72 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to Cabinet
                    </Link>

                    <div className="inline-flex items-center rounded-full border border-amber-300/15 bg-amber-300/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">
                      Informative Infrastructure
                    </div>

                    <div className="inline-flex items-center rounded-full border border-sky-300/15 bg-sky-300/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100/80">
                      Non-Authoritative
                    </div>
                  </div>

                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Newsroom Methodology
                  </h1>

                  <p className="mt-4 max-w-3xl text-base leading-7 text-white/58 sm:text-lg">
                    How Newsroom signals are mechanically aggregated. Scores are
                    descriptive only and do not assess truth, intent,
                    credibility, trustworthiness, or ethics.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <SmallLabel>Status</SmallLabel>
                      <div className="text-sm font-medium text-white/90">
                        Informative infrastructure
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <SmallLabel>Authority</SmallLabel>
                      <div className="text-sm font-medium text-white/90">
                        None
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <SmallLabel>Function</SmallLabel>
                      <div className="text-sm font-medium text-white/90">
                        Signal visibility
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <SmallLabel>Alignment</SmallLabel>
                      <div className="text-sm font-medium text-white/90">
                        Canon-compliant
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="mt-10 grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="h-fit rounded-[28px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.2)] backdrop-blur-sm xl:sticky xl:top-0">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                    On this page
                  </div>

                  <nav className="space-y-2 text-sm">
                    {[
                      ["purpose", "Purpose"],
                      ["scores", "What Scores Are / Are Not"],
                      ["constraints", "Design Constraints"],
                      ["signals", "Signal Classes"],
                      ["asymmetry", "Structural Asymmetry"],
                      ["interpretation", "Score Interpretation"],
                      ["why", "Why Scores Exist"],
                      ["refusals", "What Newsroom Refuses"],
                      ["limitations", "Known Limitations"],
                      ["boundary", "Interpretation Boundary"],
                      ["revision", "Revision Policy"],
                      ["status", "Status"],
                    ].map(([id, label]) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        className="block rounded-xl border border-transparent px-3 py-2 text-white/58 transition hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
                      >
                        {label}
                      </a>
                    ))}
                  </nav>
                </aside>

                <article className="space-y-8">
                  <SectionCard
                    id="purpose"
                    title="Purpose"
                    icon={<Eye className="h-5 w-5" />}
                  >
                    <p>
                      This page explains how Newsroom scores and signals are
                      generated.
                    </p>
                    <p>
                      It exists to make mechanical signal aggregation visible —
                      not to justify conclusions, assign credibility, evaluate
                      truth, or recommend belief or action.
                    </p>
                    <p>
                      No score displayed in the Newsroom constitutes a claim
                      about correctness, intent, morality, reliability, or
                      trustworthiness.
                    </p>
                  </SectionCard>

                  <SectionCard
                    id="scores"
                    title="What Newsroom Scores Are — and Are Not"
                    icon={<Sigma className="h-5 w-5" />}
                  >
                    <div className="grid gap-5 lg:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-400/12 bg-emerald-400/[0.05] p-5">
                        <SmallLabel>What they are</SmallLabel>
                        <p>
                          Newsroom scores are{" "}
                          <strong className="text-white">
                            descriptive aggregates
                          </strong>{" "}
                          derived from observable, non-semantic signals present
                          in published news content and its update history.
                        </p>
                        <p className="mt-3">
                          They summarize{" "}
                          <em>patterns of publication behavior</em>, not the
                          meaning, validity, or intent of claims.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-rose-400/12 bg-rose-400/[0.05] p-5">
                        <SmallLabel>What they are not</SmallLabel>
                        <BulletList
                          items={[
                            "Judgments of truth or falsity",
                            "Rankings of credibility, quality, or trust",
                            "Endorsements or warnings",
                            "Measures of intent, morality, or ethics",
                            "Recommendations for belief or action",
                          ]}
                        />
                        <p className="mt-4">No optimization target exists behind the scores.</p>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard
                    id="constraints"
                    title="Design Constraints (Non-Negotiable)"
                    icon={<Shield className="h-5 w-5" />}
                  >
                    <p>
                      The Newsroom scoring system is constrained by the following
                      invariants:
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        [
                          "No semantic interpretation",
                          "Content meaning is not evaluated.",
                        ],
                        [
                          "No moral weighting",
                          "Signals are not ranked by virtue, harm, or value.",
                        ],
                        [
                          "No hidden assumptions",
                          "All contributing signal classes are disclosed.",
                        ],
                        [
                          "No authority emission",
                          "Scores do not instruct, advise, or recommend.",
                        ],
                        [
                          "No optimization loop",
                          "The system does not adapt to influence outcomes.",
                        ],
                      ].map(([title, body]) => (
                        <div
                          key={title}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                        >
                          <div className="text-sm font-semibold text-white">
                            {title}
                          </div>
                          <div className="mt-2 text-sm leading-6 text-white/55">
                            {body}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard
                    id="signals"
                    title="Signal Classes Used"
                    icon={<Radar className="h-5 w-5" />}
                  >
                    <p>
                      Scores are computed from the presence, frequency, and
                      timing of observable publication signals. These include,
                      but are not limited to:
                    </p>

                    <div className="grid gap-5 xl:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                        <SmallLabel>Publication Structure Signals</SmallLabel>
                        <BulletList
                          items={[
                            "Article count and publication cadence",
                            "Update and revision frequency",
                            "Correction presence (binary, not qualitative)",
                            "Retraction events and latency",
                          ]}
                        />
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                        <SmallLabel>Attribution Signals</SmallLabel>
                        <BulletList
                          items={[
                            "Use of named sources (presence only)",
                            "Citation density",
                            "External reference linking (presence only)",
                          ]}
                        />
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                        <SmallLabel>Temporal Signals</SmallLabel>
                        <BulletList
                          items={[
                            "Update timing relative to breaking events",
                            "Revision clustering or delay patterns",
                          ]}
                        />
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                        <SmallLabel>Cross-Source Signals</SmallLabel>
                        <BulletList
                          items={[
                            "Divergence and convergence patterns across outlets",
                            "Story persistence or decay over time",
                          ]}
                        />
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 xl:col-span-2">
                        <SmallLabel>Editorial Surface Signals</SmallLabel>
                        <BulletList
                          items={[
                            "Headline volatility",
                            "Structural consistency across updates",
                          ]}
                        />
                      </div>
                    </div>

                    <p>
                      No signal is interpreted as “good” or “bad.” Signals are
                      counted, not judged.
                    </p>
                  </SectionCard>

                  <SectionCard
                    id="asymmetry"
                    title="Structural Asymmetry Signals (Commonly Described as Bias)"
                    icon={<ScrollText className="h-5 w-5" />}
                  >
                    <p>
                      Some Newsroom signals surface{" "}
                      <strong className="text-white">
                        structural asymmetries
                      </strong>{" "}
                      in publication behavior that are commonly labeled as
                      “bias” in public discourse.
                    </p>
                    <p>
                      In Newsroom, these signals are treated strictly as{" "}
                      <em>observable structural patterns</em>, not as indicators
                      of intent, ideology, or ethics.
                    </p>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {[
                        [
                          "Structural Directionality",
                          "Persistence of directional coverage patterns over time.",
                        ],
                        [
                          "Linguistic Polarity Density",
                          "Frequency of high-polarity language tokens without semantic interpretation.",
                        ],
                        [
                          "Source Concentration Pattern",
                          "Recurrence and diversity of cited sources, without credibility assessment.",
                        ],
                        [
                          "Framing Persistence Signal",
                          "Repeated structural framing patterns across related coverage.",
                        ],
                        [
                          "Contextual Inclusion Variance",
                          "Variance in contextual elements included or omitted across comparable events.",
                        ],
                      ].map(([title, body]) => (
                        <div
                          key={title}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                        >
                          <div className="text-sm font-semibold text-white">
                            {title}
                          </div>
                          <div className="mt-2 text-sm leading-6 text-white/55">
                            {body}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p>
                      These signals describe structure, not motive. They do not
                      imply correctness, fault, or trustworthiness.
                    </p>
                  </SectionCard>

                  <SectionCard
                    id="interpretation"
                    title="What a Higher or Lower Score Means"
                    icon={<Sigma className="h-5 w-5" />}
                  >
                    <p>
                      A higher or lower score reflects only a difference in the
                      aggregate configuration of observable signals.
                    </p>
                    <p>It does not imply:</p>
                    <BulletList
                      items={[
                        "Higher accuracy",
                        "Greater reliability",
                        "Better or worse journalism",
                        "Malicious or benevolent intent",
                      ]}
                    />
                    <p>
                      Scores are comparative descriptors, not evaluative
                      measures.
                    </p>
                  </SectionCard>

                  <SectionCard
                    id="why"
                    title="Why Scores Are Shown At All"
                    icon={<Eye className="h-5 w-5" />}
                  >
                    <p>Scores exist to:</p>
                    <BulletList
                      items={[
                        "Make structural patterns visible",
                        "Prevent hidden authority or opaque summarization",
                        "Allow independent scrutiny of aggregation logic",
                        "Reduce reliance on reputation or narrative framing",
                      ]}
                    />
                    <p>They are a lens, not a verdict.</p>
                  </SectionCard>

                  <SectionCard
                    id="refusals"
                    title="What Newsroom Refuses to Do"
                    icon={<Ban className="h-5 w-5" />}
                  >
                    <p>The Newsroom explicitly refuses to:</p>
                    <BulletList
                      items={[
                        "Rank outlets by trust",
                        "Recommend sources",
                        "Suppress or promote stories",
                        "Collapse signal complexity into moral conclusions",
                        "Replace human judgment",
                      ]}
                    />
                    <p>
                      Any system that does so would exceed its legitimacy.
                    </p>
                  </SectionCard>

                  <SectionCard
                    id="limitations"
                    title="Known Limitations"
                    icon={<TriangleAlert className="h-5 w-5" />}
                  >
                    <BulletList
                      items={[
                        "Scores do not capture truth or falsity",
                        "Scores do not account for context or intent",
                        "Scores may surface neutral or incidental patterns",
                        "Scores can be misinterpreted if treated as authority",
                      ]}
                    />
                    <p>
                      Misuse or over-interpretation is a known risk and is not
                      mitigated by additional scoring.
                    </p>
                  </SectionCard>

                  <SectionCard
                    id="boundary"
                    title="Interpretation Boundary"
                    icon={<Shield className="h-5 w-5" />}
                  >
                    <p>If you find yourself asking:</p>

                    <div className="rounded-2xl border border-amber-300/15 bg-amber-300/8 px-5 py-4 text-lg font-medium leading-8 text-white">
                      “What should I believe or do based on this score?”
                    </div>

                    <p>You have crossed the intended boundary.</p>
                    <p>The Newsroom provides visibility, not guidance.</p>
                  </SectionCard>

                  <SectionCard
                    id="revision"
                    title="Revision Policy"
                    icon={<ScrollText className="h-5 w-5" />}
                  >
                    <p>This methodology is:</p>
                    <BulletList
                      items={["Public", "Versioned", "Additive only"]}
                    />
                    <p>
                      Any change to signal classes or aggregation logic is
                      documented and historically accessible. Silent edits are
                      prohibited.
                    </p>
                  </SectionCard>

                  <SectionCard
                    id="status"
                    title="Status"
                    icon={<Shield className="h-5 w-5" />}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Status", "Informative infrastructure"],
                        ["Authority", "None"],
                        ["Function", "Signal visibility"],
                        ["Alignment", "Canon-compliant"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                        >
                          <SmallLabel>{label}</SmallLabel>
                          <div className="text-sm font-medium text-white/90">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="border-t border-white/8 pt-4 text-sm text-white/40">
                      Newsroom Methodology · Canonical · Informative Only ·
                      Moral Clarity AI
                    </p>
                  </SectionCard>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
