// components/MemoryComposer.tsx
"use client";

import { useRef, useState } from "react";
import { toast } from "@/lib/toast";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

const UPLOAD_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_BUCKET || "uploads";

type Props = { workspaceId: string };

export default function MemoryComposer({ workspaceId }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createSupabaseBrowser();

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPendingFiles((prev) => [...prev, ...files]);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadAll(): Promise<string[]> {
    if (!pendingFiles.length) return [];

    setUploading(true);
    const out: string[] = [];

    try {
      for (const f of pendingFiles) {
        const safe = f.name.replace(/[^\w.\-]+/g, "_");
        const key = `workspace/${workspaceId}/${Date.now()}_${safe}`;

        const { error } = await supabase.storage
          .from(UPLOAD_BUCKET)
          .upload(key, f);

        if (error) throw error;

        const { data: pub } = supabase.storage
          .from(UPLOAD_BUCKET)
          .getPublicUrl(key);

        out.push(pub.publicUrl);
      }

      return out;
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    try {
      const attachmentUrls = await uploadAll();

      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: workspaceId,
          title: title || null,
          content:
            (content || "") +
            (attachmentUrls.length
              ? "\n\nAttachments:\n" +
                attachmentUrls.map((u) => `• ${u}`).join("\n")
              : ""),
        }),
      });

      const j = await res.json();

      if (!res.ok) return toast(j.error || "Failed to save.");

      toast("Saved.");
      setTitle("");
      setContent("");
      setPendingFiles([]);
      window.location.reload();
    } catch (err) {
      toast("Failed.");
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-4">
      <input
        className="w-full rounded-md bg-black/30 border border-neutral-700 p-2 text-sm"
        placeholder="Memory title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full rounded-md bg-black/30 border border-neutral-700 p-2 text-sm h-32"
        placeholder="Write content…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div>
        <input
          ref={fileRef}
          type="file"
          multiple
          onChange={onPickFiles}
          className="text-sm"
        />
      </div>

      <button
        onClick={submit}
        disabled={uploading}
        className="rounded-md bg-amber-600 px-4 py-2 text-sm hover:bg-amber-500 disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Save memory"}
      </button>
    </div>
  );
}
