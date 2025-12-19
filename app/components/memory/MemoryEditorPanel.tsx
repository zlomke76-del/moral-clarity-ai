"use client";

import { useState } from "react";
import type { MemoryRecord } from "@/app/w/[workspaceId]/memory/MemoryWorkspaceClient";

type Props = {
  workspaceId: string;
  record: MemoryRecord;
};

export default function MemoryEditorPanel({
  workspaceId,
  record,
}: Props) {
  const [content, setContent] = useState(record.content);

  return (
    <div className="h-full flex flex-col p-6 gap-4">
      <div className="text-xs text-neutral-500">
        Workspace: {workspaceId}
      </div>

      <textarea
        className="flex-1 w-full rounded-md bg-neutral-900 border border-neutral-800 p-4 text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <button className="px-3 py-1 text-sm rounded-md border border-neutral-700">
          Cancel
        </button>
        <button className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white">
          Save
        </button>
      </div>
    </div>
  );
}
