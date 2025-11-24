"use client";

import type { OutletDetailData, OutletTrendPoint } from "../types";
import OutletLogo from "./OutletLogo";

type Props = {
  open: boolean;
  outlet: OutletDetailData | null;
  trends: OutletTrendPoint[] | null;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
};

export default function OutletDetailModal({
  open,
  outlet,
  trends,
  onClose,
  onOpenChange,
}: Props) {
  if (!open || !outlet) return null;

  const handleClose = () => {
    onClose();
    onOpenChange?.(false);
  };

  const {
    canonical_outlet,
    display_name,
    storiesAnalyzed,
    lifetimePi,
    lifetimeBiasIntent,
    lifetimeLanguage,
    lifetimeSource,
    lifetimeFraming,
    lifetimeContext,
    firstScoredAt,
    lastScoredAt,
    ninetyDaySummary,
  } = outlet;

  const lifetimePiDisplay = lifetimePi.toFixed(1);
  const lifetimeLine = `${storiesAnalyzed} stories analyzed · PI based on lifetime.`;

  const firstLastLine =
    firstScoredAt || lastScoredAt
      ? [
          firstScoredAt ? `First scored: ${firstScoredAt}` : "",
          lastScoredAt ? `Most recent: ${lastScoredAt}` : "",
        ]
          .filter(Boolean)
          .join(" · ")
      : "";

  const lifetimeComponents: {
    label: string;
    value: number;
    key: "language" | "source" | "framing" | "context";
  }[] = [
    { label: "Language", value: lifetimeLanguage, key: "language" },
    { label: "Source", value: lifetimeSource, key: "source" },
    { label: "Framing", value: lifetimeFraming, key: "framing" },
    { label: "Context", value: lifetimeContext, key: "context" },
  ];

  let trendSummary: string | null = null;
  if (trends && trends.length > 0) {
    const sorted = [...trends].sort((a, b) =>
      a.story_day.localeCompare(b.story_day)
    );
    const start = sorted[0];
    const end = sorted[sorted.length - 1];

    trendSummary = `Scored on ${trends.length} day${
      trends.length === 1 ? "" : "s"
    } from ${start.story_day} to ${end.story_day}.`;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/95 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <OutletLogo domain={canonical_outlet} name={display_name} />
            <div>
              <div className="text-sm font-semibold text-neutral-100">
                {display_name}
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-400">
                {lifetimeLine}
              </div>
              {firstLastLine && (
                <div className="mt-0.5 text-[11px] text-neutral-500">
                  {firstLastLine}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
              Lifetime PI
            </div>
            <div className="font-mono text-2xl text-neutral-50">
              {lifetimePiDisplay}
            </div>
            <div className="text-[11px] text-neutral-400">
              Bias intent: {lifetimeBiasIntent.toFixed(2)} / 3.00
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Left: lifetime breakdown */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Lifetime component scores
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {lifetimeComponents.map((comp) => (
                <div
                  key={comp.key}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-3"
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{comp.label}</span>
                    <span className="font-mono text-xs text-neutral-200">
                      {comp.value.toFixed(2)} / 3.00
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-emerald-400/80"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, (comp.value / 3) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Lower is more neutral. 0.00 = highly neutral, 3.00 = strong,
                    consistent bias.
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-neutral-500">
              Each story is scored 0–3 on language, source, framing, and
              context. Those roll up into a single bias intent score, which we
              convert into a Predictability Index: PI = 1 − (bias_intent / 3).
            </p>
          </div>

          {/* Right: trend + summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Stability & trend
            </h2>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-3 text-[11px] text-neutral-300">
              <p>{ninetyDaySummary}</p>
              {trendSummary && (
                <p className="mt-2 text-neutral-400">{trendSummary}</p>
              )}
              {!trendSummary && (
                <p className="mt-2 text-neutral-500">
                  Trend data isn&apos;t available yet for this outlet. As more
                  days are scored, you&apos;ll see stability over time here.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-3 text-[11px] text-neutral-400">
              <p className="font-semibold text-neutral-200">
                How to read these numbers
              </p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>
                  Component scores (0–3) show *how* stories are told: wording,
                  sourcing, framing, and context.
                </li>
                <li>
                  Bias intent compresses those into one number per story,
                  representing overall slant.
                </li>
                <li>
                  PI turns that into a 0–1 scale of predictability and
                  neutrality: closer to 1.00 is steadier and more neutral.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 px-5 py-3 text-[11px] text-neutral-500">
          <span>
            Neutrality Cabinet · Story-level Predictability Index (PI) ·{" "}
            {canonical_outlet}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-100 hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
