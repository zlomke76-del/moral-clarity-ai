"use client";

import { useState, useRef } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "@/lib/toast";

type Props = {
  workspaceId: string;
};

export default function MemoryComposer({ workspaceId }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [kind, setKind] = useState("note");

  const supabase = createSupabaseBrowser();

  async function submit() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        toast("Not signed in.");
        return;
      }

      const body = {
        title: title.trim() || null,
        content: content.trim(),
        kind,
        workspace_id: workspaceId,
        user_email: user.email,
      };

      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const j = await res.json();
      if (!res.ok) {
        toast(j.error ?? "Failed to save memory.");
        return;
      }

      toast("Saved.");
      setTitle("");
      setContent("");

      window.location.reload();
    } catch (e: any) {
      toast(e?.message ?? "Failed.");
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <input
        className="w-full rounded bg-neutral-800/50 p-2 text-sm"
        placeholder="Memory title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full rounded bg-neutral-800/50 p-2 text-sm h-32"
        placeholder="Write memory..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-medium"
        onClick={submit}
      >
        Save Memory
      </button>
    </div>
  );
}

