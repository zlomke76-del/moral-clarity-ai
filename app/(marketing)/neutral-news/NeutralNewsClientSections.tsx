"use client";

import dynamic from "next/dynamic";

const DailyDigestFeedClient = dynamic(
  () =>
    import("@/components/news/DailyDigestFeedClient").then(
      (m) => m.DailyDigestFeedClient
    ),
  { ssr: false }
);

const OutletNeutralityScoreboardClient = dynamic(
  () =>
    import("@/components/news/OutletNeutralityScoreboardClient").then(
      (m) => m.OutletNeutralityScoreboardClient
    ),
  { ssr: false }
);

export default function NeutralNewsClientSections() {
  return (
    <>
      {/* DAILY DIGEST */}
      <section className="border-b border-slate-800 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-xl font-semibold">
            Today’s Neutral Digest
          </h2>
          <DailyDigestFeedClient limit={20} />
        </div>
      </section>

      {/* SCOREBOARD */}
      <section className="border-b border-slate-800 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-xl font-semibold">
            Outlet Neutrality Scoreboard
          </h2>
          <OutletNeutralityScoreboardClient limit={200} minStories={3} />
        </div>
      </section>
    </>
  );
}
