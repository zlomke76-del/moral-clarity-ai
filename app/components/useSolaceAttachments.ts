"use client";

import { useState, useCallback, useEffect } from "react";

export interface SolaceFile {
  name: string;
  mime: string;
  url: string;
  size?: number;
  original?: File;
}

export function useSolaceAttachments({
  onInfoMessage,
}: {
  onInfoMessage: (msg: string) => void;
}) {
  const [pendingFiles, setPendingFiles] = useState<SolaceFile[]>([]);

  /** Cleanup object URLs on unmount */
  useEffect(() => {
    return () => {
      pendingFiles.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, [pendingFiles]);

  /** Convert a File object into our internal Solace file */
  const fileToSolace = useCallback((file: File): SolaceFile => {
    return {
      name: file.name,
      mime: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
      size: file.size,
      original: file,
    };
  }, []);

  /** Handle input[type=file] */
  const handleFiles = useCallback(
    (fileList: FileList | null, { prefix }: { prefix: string }) => {
      if (!fileList) return;

      const newFiles: SolaceFile[] = [];
      for (const file of Array.from(fileList)) {
        newFiles.push(fileToSolace(file));
      }

      setPendingFiles((prev) => [...prev, ...newFiles]);
      onInfoMessage(`${newFiles.length} file(s) attached.`);
    },
    [fileToSolace, onInfoMessage]
  );

  /** Handle paste event */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent, { prefix }: { prefix: string }) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const newFiles: SolaceFile[] = [];

      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            newFiles.push(fileToSolace(file));
          }
        }
      }

      if (newFiles.length > 0) {
        setPendingFiles((prev) => [...prev, ...newFiles]);
        onInfoMessage(`${newFiles.length} pasted file(s) attached.`);
      }
    },
    [fileToSolace, onInfoMessage]
  );

  /** Clear attachments */
  const clearPending = useCallback(() => {
    pendingFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setPendingFiles([]);
  }, [pendingFiles]);

  /** Helper for SolaceDock UI */
  const getAttachmentUrl = useCallback((f: SolaceFile) => f.url, []);

  return {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
    getAttachmentUrl,
  };
}


