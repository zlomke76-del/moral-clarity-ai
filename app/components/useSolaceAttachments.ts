"use client";

import { useState } from "react";

export function useSolaceAttachments({
  onInfoMessage,
}: {
  onInfoMessage: (msg: string) => void;
}) {
  const [pendingFiles, setPendingFiles] = useState<any[]>([]);

  function push(file: any) {
    setPendingFiles((prev) => [...prev, file]);
  }

  function handleFiles(
    fileList: FileList | null,
    { prefix }: { prefix: string }
  ) {
    if (!fileList) return;

    const added: any[] = [];

    for (const file of Array.from(fileList)) {
      added.push({
        name: file.name,
        type: file.type,
        mime: file.type,
        url: URL.createObjectURL(file),
      });
    }

    if (added.length > 0) {
      setPendingFiles((prev) => [...prev, ...added]);
    }
  }

  function handlePaste(
    e: React.ClipboardEvent,
    { prefix }: { prefix: string }
  ) {
    const items = e.clipboardData?.items;
    if (!items) return;

    const added: any[] = [];

    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          added.push({
            name: file.name,
            type: file.type,
            mime: file.type,
            url: URL.createObjectURL(file),
          });
        }
      }
    }

    if (added.length > 0) {
      setPendingFiles((prev) => [...prev, ...added]);
    }
  }

  function clearPending() {
    setPendingFiles([]);
  }

  return {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  };
}

