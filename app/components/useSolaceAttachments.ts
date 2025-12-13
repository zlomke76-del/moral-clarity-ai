"use client";

import { useRef } from "react";
import { uploadFiles } from "@/lib/uploads/client";

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
  // Stable container for pending attachments
  const pendingFilesRef = useRef<SolaceFile[]>([]);

  function add(file: SolaceFile) {
    pendingFilesRef.current.push(file);
  }

  /* ----------------------
     HANDLE FILE INPUT
  ----------------------- */
  async function handleFiles(
    fileList: FileList | null,
    { prefix }: { prefix: string }
  ) {
    if (!fileList || fileList.length === 0) return;

    const { attachments, errors } = await uploadFiles(fileList, { prefix });

    for (const a of attachments) {
      add({
        name: a.name,
        type: a.type,
        mime: a.type,
        url: a.url,
        publicUrl: a.url,
      });
    }

    if (attachments.length > 0) {
      onInfoMessage(`${attachments.length} file(s) uploaded.`);
    }

    if (errors.length > 0) {
      onInfoMessage(`⚠️ ${errors.length} file(s) failed to upload.`);
    }
  }

  /* ----------------------
     HANDLE PASTE INPUT
  ----------------------- */
  async function handlePaste(
    e: React.ClipboardEvent,
    { prefix }: { prefix: string }
  ) {
    const files = e.clipboardData?.files;
    if (!files || files.length === 0) return;

    const { attachments, errors } = await uploadFiles(files, { prefix });

    for (const a of attachments) {
      add({
        name: a.name,
        type: a.type,
        mime: a.type,
        url: a.url,
        publicUrl: a.url,
      });
    }

    if (attachments.length > 0) {
      onInfoMessage(`${attachments.length} file(s) uploaded.`);
    }

    if (errors.length > 0) {
      onInfoMessage(`⚠️ ${errors.length} file(s) failed to upload.`);
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
