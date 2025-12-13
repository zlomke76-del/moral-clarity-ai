"use client";

import { useRef } from "react";
import {
  uploadFiles,
  uploadFromPasteEvent,
} from "@/lib/uploads/client";

export type SolaceFile = {
  name: string;
  type: string;
  mime: string;
  url: string;        // PUBLIC HTTPS URL (server usable)
  publicUrl?: string;
  path?: string;
};

export function useSolaceAttachments({
  onInfoMessage,
}: {
  onInfoMessage: (msg: string) => void;
}) {
  // Stable container (no rerenders required)
  const pendingFilesRef = useRef<SolaceFile[]>([]);

  function addMany(files: SolaceFile[]) {
    pendingFilesRef.current.push(...files);
  }

  // --------------------------------------------------
  // FILE INPUT (📎)
  // --------------------------------------------------
  async function handleFiles(
    fileList: FileList | null,
    { prefix }: { prefix: string }
  ) {
    if (!fileList || fileList.length === 0) return;

    try {
      const { attachments, errors } = await uploadFiles(fileList, { prefix });

      if (attachments.length > 0) {
        addMany(
          attachments.map((a) => ({
            name: a.name,
            type: a.type,
            mime: a.type,
            url: a.url, // PUBLIC URL
            publicUrl: a.url,
          }))
        );

        onInfoMessage(`${attachments.length} file(s) attached.`);
      }

      if (errors.length > 0) {
        onInfoMessage(
          `⚠️ ${errors.length} file(s) failed to upload.`
        );
      }
    } catch (err: any) {
      onInfoMessage(
        `⚠️ Upload failed: ${err?.message || "unknown error"}`
      );
    }
  }

  // --------------------------------------------------
  // PASTE HANDLER (📋)
  // --------------------------------------------------
  async function handlePaste(
    e: React.ClipboardEvent,
    { prefix }: { prefix: string }
  ) {
    try {
      const { attachments, errors } =
        await uploadFromPasteEvent(
          e.nativeEvent as ClipboardEvent,
          { prefix }
        );

      if (attachments.length > 0) {
        addMany(
          attachments.map((a) => ({
            name: a.name,
            type: a.type,
            mime: a.type,
            url: a.url,
            publicUrl: a.url,
          }))
        );

        onInfoMessage(`${attachments.length} file(s) pasted.`);
      }

      if (errors.length > 0) {
        onInfoMessage(
          `⚠️ ${errors.length} pasted file(s) failed to upload.`
        );
      }
    } catch (err: any) {
      onInfoMessage(
        `⚠️ Paste upload failed: ${err?.message || "unknown error"}`
      );
    }
  }

  // --------------------------------------------------
  // CLEAR
  // --------------------------------------------------
  function clearPending() {
    pendingFilesRef.current.length = 0;
  }

  return {
    pendingFiles: pendingFilesRef.current,
    handleFiles,
    handlePaste,
    clearPending,
  };
}
