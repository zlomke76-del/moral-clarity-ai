"use client";

import { useRef } from "react";

export type SolaceFile = {
  name: string;
  type: string;
  mime: string;
  url: string;
  publicUrl?: string;
  path?: string;
};

export function useSolaceAttachments({
  onInfoMessage,
}: {
  onInfoMessage: (msg: string) => void;
}) {
  // ⭐ Stable container for attachments
  const pendingFilesRef = useRef<SolaceFile[]>([]);

  function add(file: SolaceFile) {
    pendingFilesRef.current.push(file);
  }

  /* ----------------------
     HANDLE FILE INPUT
  ----------------------- */
  function handleFiles(
    fileList: FileList | null,
    { prefix }: { prefix: string }
  ) {
    if (!fileList) return;

    for (const file of Array.from(fileList)) {
      add({
        name: file.name,
        type: file.type,
        mime: file.type,
        url: URL.createObjectURL(file),
      });
    }

    onInfoMessage(`${fileList.length} file(s) attached.`);
  }

  /* ----------------------
     HANDLE PASTE INPUT
  ----------------------- */
  function handlePaste(
    e: React.ClipboardEvent,
    { prefix }: { prefix: string }
  ) {
    const items = e.clipboardData?.items;
    if (!items) return;

    let count = 0;

    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          add({
            name: file.name,
            type: file.type,
            mime: file.type,
            url: URL.createObjectURL(file),
          });
          count++;
        }
      }
    }

    if (count > 0) {
      onInfoMessage(`${count} file(s) pasted.`);
    }
  }

  /* ----------------------
     CLEAR ATTACHMENTS
  ----------------------- */
  function clearPending() {
    pendingFilesRef.current.splice(0, pendingFilesRef.current.length);
  }

  return {
    pendingFiles: pendingFilesRef.current,
    handleFiles,
    handlePaste,
    clearPending,
  };
}

