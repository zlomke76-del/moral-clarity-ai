// app/newsroom/page.tsx
"use client";

import { useState } from "react";
import Tabs from "./components/Tabs";
import AnchorPanel from "./components/AnchorPanel";
import AnalystPanel from "./components/AnalystPanel";
import CoachPanel from "./components/CoachPanel";
import type { NewsroomTab } from "./types";

export default function NewsroomPage() {
  const [tab, setTab] = useState<NewsroomTab>("anchor");

  return (
    <div className="flex flex-col gap-10">
      <Tabs active={tab} onChange={setTab} />

      {tab === "anchor" && <AnchorPanel />}
      {tab === "analyst" && <AnalystPanel />}
      {tab === "coach" && <CoachPanel />}
    </div>
  );
}
