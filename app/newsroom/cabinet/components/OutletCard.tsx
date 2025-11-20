"use client";

export default function OutletCard({
  outlet,
  rank,
  highlight,
  selected,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl border px-5 py-4
        transition
        ${highlight ? "border-yellow-400/80 shadow-yellow-500/20 shadow-lg" : "border-neutral-700"}
        ${selected ? "bg-neutral-800/60" : "bg-neutral-900/40"}
      `}
    >
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">{rank}. {outlet.outlet}</div>
        {highlight && (
          <span className="text-yellow-400 font-bold">⭐ Golden Anchor</span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 text-sm text-neutral-400">
        <div>
          <div className="font-bold text-neutral-200">{outlet.avg_pi.toFixed(3)}</div>
          PI Score
        </div>
        <div>
          <div className="font-bold text-neutral-200">{outlet.article_count}</div>
          Articles
        </div>
        <div>
          <div className="font-bold text-neutral-200">
            {new Date(outlet.last_story_at).toLocaleDateString()}
          </div>
          Last Rated
        </div>
      </div>
    </div>
  );
}
