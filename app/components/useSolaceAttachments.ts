"use client";

import { useRef } from "react";
import {
  uploadFiles,
  uploadFromPasteEvent,
} from "@/lib/uploads/client";

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */
export type SolaceFile = {
  name: string;
  type: string;
  mime: string;
  url: string; // PUBLIC HTTPS URL (Supabase)
  size?: number;
};

/* ------------------------------------------------------------------
   Hook
------------------------------------------------------------------- */
export function useSolaceAttachments() {
  // Stable, non-reactive container (intentional)
  const pendingFilesRef = useRef<SolaceFile[]>([]);

  /* ------------------------------------------------------------------
     INTERNAL ADD (NO SIDE EFFECTS)
  ------------------------------------------------------------------- */
  function add(file: SolaceFile) {
    pendingFilesRef.current.push(file);
  }

  /* ------------------------------------------------------------------
     HANDLE FILE INPUT (<input type="file" />)
     NOTE: Does NOT emit assistant messages
  ------------------------------------------------------------------- */
  async function handleFiles(
    fileList: FileList | null,
    { prefix }: { prefix: string }
  ) {
    if (!fileList || fileList.length === 0) return;

    console.info("[ATTACHMENTS] upload start", {
      count: fileList.length,
      prefix,
    });

    const { attachments, errors } = await uploadFiles(fileList, { prefix });

    if (errors.length > 0) {
      console.error("[ATTACHMENTS] upload errors", errors);
      // UI may react separately if desired
    }

    for (const a of attachments) {
      console.info("[ATTACHMENTS] uploaded", {
        name: a.name,
        url: a.url,
        type: a.type,
        size: a.size,
      });

      add({
        name: a.name,
        type: a.type,
        mime: a.type,
        url: a.url,
        size: a.size,
      });
    }
  }

  /* ------------------------------------------------------------------
     HANDLE PASTE (clipboard images/files)
     NOTE: Does NOT emit assistant messages
  ------------------------------------------------------------------- */
  async function handlePaste(
    e: React.ClipboardEvent,
    { prefix }: { prefix: string }
  ) {
    console.info("[ATTACHMENTS] paste detected");

    const { attachments, errors } = await uploadFromPasteEvent(
      e.nativeEvent,
      { prefix }
    );

    if (errors.length > 0) {
      console.error("[ATTACHMENTS] paste upload errors", errors);
      // UI may react separately if desired
    }

    for (const a of attachments) {
      console.info("[ATTACHMENTS] pasted upload", {
        name: a.name,
        url: a.url,
        type: a.type,
        size: a.size,
      });

      add({
        name: a.name,
        type: a.type,
        mime: a.type,
        url: a.url,
        size: a.size,
      });
    }
  }

  /* ------------------------------------------------------------------
     CLEAR (CALLED AFTER SEND)
  ------------------------------------------------------------------- */
  function clearPending() {
    console.info("[ATTACHMENTS] clearing pending files", {
      count: pendingFilesRef.current.length,
    });
    pendingFilesRef.current.splice(0, pendingFilesRef.current.length);
  }

  /* ------------------------------------------------------------------
     RETURN API
  ------------------------------------------------------------------- */
  return {
    pendingFiles: pendingFilesRef.current,
    handleFiles,
    handlePaste,
    clearPending,
  };
}
