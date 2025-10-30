"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

interface MemoryDockProps {
  workspaceId: string;
}

export default function MemoryDock({ workspaceId }: MemoryDockProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveMemory() {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabaseBrowser
        .schema("mca")
        .from("memories")
        .insert([{ workspace_id: workspaceId, title, content }]);
      if (error) throw error;
      toast("Saved ✅");
      setTitle("");
      setContent("");
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast("Save failed ❌");
    } finally {
      setSaving(false);
    }
  }

  // Keyboard shortcut: ⌘/Ctrl + M to toggle dock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-800 transition-transform duration-300 ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 py-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-neutral-300">New Memory</h2>
          <button
            className="text-xs text-neutral-400 hover:text-neutral-200"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts…"
          rows={4}
          className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none"
        />

        <div className="flex justify-end">
          <button
            onClick={saveMemory}
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
