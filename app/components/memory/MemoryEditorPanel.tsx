"use client";

import { useState } from "react";
import type { MemoryRecord } from "./types";

type Props = {
  workspaceId: string;
  record: MemoryRecord;
};

export default function MemoryEditorPanel({
  workspaceId,
  record,
}: Props) {
  const [value, setValue] = useState(record.content);

  return (
    <div className="h-full flex flex-col p-6">
      <textarea
        className="flex-1 w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
