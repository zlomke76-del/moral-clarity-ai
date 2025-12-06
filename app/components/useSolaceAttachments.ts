"use client";

export function useSolaceAttachments({ onInfoMessage }: { onInfoMessage: (msg: string) => void }) {
  const pendingFiles: any[] = [];

  function push(file: any) {
    pendingFiles.push(file);
  }

  function handleFiles(fileList: FileList | null, { prefix }: { prefix: string }) {
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      push({
        name: file.name,
        type: file.type,
        mime: file.type,
        url: URL.createObjectURL(file),
      });
    }
  }

  function handlePaste(e: React.ClipboardEvent, { prefix }: { prefix: string }) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          push({
            name: file.name,
            type: file.type,
            mime: file.type,
            url: URL.createObjectURL(file),
          });
        }
      }
    }
  }

  function clearPending() {
    pendingFiles.splice(0, pendingFiles.length);
  }

  return {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  };
}

