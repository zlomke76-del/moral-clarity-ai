"use client";

import { useState } from "react";
import type { MemoryRecord } from "./types";

type Props = {
  workspaceId: string;
  record: MemoryRecord;
};

function normalizeContent(content: unknown): string {
  if (typeof content === "string") return content;

  if (content && typeof content === "object") {
    return JSON.stringify(content, null, 2);
  }

  return "";
}

export default function MemoryEditorPanel({
  workspaceId,
  record,
}: Props) {
  const [value, setValue] = useState<string>(
    normalizeContent(record.content)
  );

  return (
    <div className="h-full flex flex-col p-6">
      <textarea
        className="flex-1 w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm font-mono"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
