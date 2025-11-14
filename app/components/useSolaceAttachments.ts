"use client";

import { useState } from "react";
import type React from "react";
import { uploadFromInput, uploadFromPasteEvent } from "@/lib/uploads/client";

export type Attachment = { name: string; url: string; type: string };

type UseSolaceAttachmentsArgs = {
  onInfoMessage: (content: string) => void;
};

export function useSolaceAttachments({ onInfoMessage }: UseSolaceAttachmentsArgs) {
  const [pendingFiles, setPendingFiles] = useState<Attachment[]>([]);

  async function handleFiles(
    fileList: FileList | null,
    opts?: { prefix?: string }
  ) {
    const { attachments, errors } = await uploadFromInput(fileList, opts);

    if (errors.length) {
      onInfoMessage(
        "⚠️ Some uploads failed: " +
          errors.map((e) => `${e.fileName} (${e.message})`).join("; ")
      );
    }

    if (attachments.length) {
      const mapped: Attachment[] = attachments.map((a) => ({
        name: a.name,
        url: a.url,
        type: a.type,
      }));

      setPendingFiles((prev) => [...prev, ...mapped]);
      onInfoMessage(
        `Attached ${mapped.length} file${
          mapped.length > 1 ? "s" : ""
        }. They will be included in your next message.`
      );
    }
  }

  function handlePaste(
    e: React.ClipboardEvent<HTMLDivElement>,
    opts?: { prefix?: string }
  ) {
    uploadFromPasteEvent(e.nativeEvent, opts).then(({ attachments, errors }) => {
      if (errors.length) {
        onInfoMessage(
          "⚠️ Some pasted items failed: " +
            errors.map((er) => `${er.fileName} (${er.message})`).join("; ")
        );
      }
      if (attachments.length) {
        const mapped: Attachment[] = attachments.map((a) => ({
          name: a.name,
          url: a.url,
          type: a.type,
        }));
        setPendingFiles((prev) => [...prev, ...mapped]);
        onInfoMessage(
          `Attached ${mapped.length} pasted item${
            mapped.length > 1 ? "s" : ""
          }. They will be included in your next message.`
        );
      }
    });
  }

  function clearPending() {
    setPendingFiles([]);
  }

  return { pendingFiles, handleFiles, handlePaste, clearPending };
}

