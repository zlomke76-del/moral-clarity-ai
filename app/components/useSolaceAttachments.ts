// app/components/useSolaceAttachments.ts
"use client";

import { useRef, useState } from "react";
import {
  uploadFromInput,
  uploadFromPasteEvent,
} from "@/lib/uploads/client";
import type { UploadResult } from "@/lib/uploads/types";

export type Attachment = {
  name: string;
  url: string;
  type: string;
};

export function useSolaceAttachments(opts?: { prefix?: string }) {
  const [pendingFiles, setPendingFiles] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prefix = opts?.prefix ?? "solace";

  async function handleFiles(fileList: FileList | null): Promise<UploadResult> {
    if (!fileList || fileList.length === 0) {
      return { attachments: [], errors: [] };
    }

    const result = await uploadFromInput(fileList, { prefix });

    if (result.attachments.length) {
      const mapped: Attachment[] = result.attachments.map((a) => ({
        name: a.name,
        url: a.url,
        type: a.type,
      }));
      setPendingFiles((prev) => [...prev, ...mapped]);
    }

    return result;
  }

  async function handlePaste(nativeEvent: ClipboardEvent): Promise<UploadResult> {
    const result = await uploadFromPasteEvent(nativeEvent, { prefix });

    if (result.attachments.length) {
      const mapped: Attachment[] = result.attachments.map((a) => ({
        name: a.name,
        url: a.url,
        type: a.type,
      }));
      setPendingFiles((prev) => [...prev, ...mapped]);
    }

    return result;
  }

  function clearPendingFiles() {
    setPendingFiles([]);
  }

  return {
    pendingFiles,
    fileInputRef,
    handleFiles,
    handlePaste,
    clearPendingFiles,
  };
}
