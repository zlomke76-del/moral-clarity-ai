// app/newsroom/cabinet/page.tsx
import AnchorRail from "@/components/newsroom/AnchorRail";
import OutletGrid from "@/components/newsroom/OutletGrid";
import WatchlistRail from "@/components/newsroom/WatchlistRail";

export default function NewsroomCabinetPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Golden Anchor — primary epistemic signal */}
      <AnchorRail />

      {/* Neutral sources — distributed context */}
      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-neutral-300">
          Neutral
        </h2>
        <OutletGrid />
      </section>

      {/* Watchlist — explicitly downstream */}
      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-red-400">
          Watchlist
        </h2>
        <WatchlistRail />
      </section>
    </div>
  );
}
