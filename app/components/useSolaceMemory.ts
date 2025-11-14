// app/components/useSolaceMemory.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { MCA_USER_KEY } from "@/lib/mca-config";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import type { Attachment } from "./useSolaceAttachments";

export type Message = { role: "user" | "assistant"; content: string };
export type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

type MemoryRow = {
  id: string;
  title: string | null;
  content: string;
  created_at?: string;
};

const MEMORY_LIMIT = 50;

export function useSolaceMemory() {
  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ready when you are." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const memoryCacheRef = useRef<MemoryRow[]>([]);
  const [memReady, setMemReady] = useState(false);

  const [userKey, setUserKey] = useState<string>(MCA_USER_KEY);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Durable per-browser key fallback
  useEffect(() => {
    try {
      let k = localStorage.getItem("mc:user_key");
      if (!k || k === "guest") {
        k = "u_" + crypto.randomUUID();
        localStorage.setItem("mc:user_key", k);
      }
      setUserKey(k);
    } catch {
      setUserKey(MCA_USER_KEY || "guest");
    }
  }, []);

  // Supabase email → stable cross-device identity
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (typeof window === "undefined") return;
        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase.auth.getUser();
        if (cancelled || error) return;
        const email = data.user?.email as string | undefined;
        if (email) setUserEmail(email.toLowerCase());
      } catch {
        // ignore; fall back to userKey
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const identityKey = (userEmail || userKey || MCA_USER_KEY || "guest").toString();

  // MEMORY BOOTSTRAP (scoped by identityKey)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetch(`/api/memory?limit=${MEMORY_LIMIT}`, {
          cache: "no-store",
          headers: { "X-User-Key": identityKey },
        });
        if (!alive) return;

        if (r.ok) {
          const j = await r.json().catch(() => ({ rows: [] as any[] }));
          const rows = Array.isArray(j?.rows) ? j.rows : [];
          memoryCacheRef.current = rows.map((m: any) => ({
            id: String(m.id),
            title: m.title ?? null,
            content: String(m.content ?? ""),
            created_at: m.created_at ?? undefined,
          })) as MemoryRow[];
        } else {
          memoryCacheRef.current = [];
        }
      } catch {
        memoryCacheRef.current = [];
      } finally {
        if (alive) setMemReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [identityKey]);

  async function send(opts: {
    filters: Set<string>;
    pendingFiles: Attachment[];
    ministryOn: boolean;
    workspaceId: string;
    clearPendingFiles: () => void;
  }) {
    const text = input.trim();
    if (!text && opts.pendingFiles.length === 0) return;
    if (streaming) return;

    setInput("");
    const userMsg = text || (opts.pendingFiles.length ? "Attachments:" : "");
    const nextMsgs: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(nextMsgs);
    setStreaming(true);

    const activeFilters: string[] = Array.from(opts.filters || []);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Last-Mode": modeHint,
          "X-User-Key": identityKey,
        },
        body: JSON.stringify({
          messages: nextMsgs,
          filters: activeFilters,
          stream: false,
          attachments: opts.pendingFiles,
          ministry: activeFilters.includes("ministry"),
          workspace_id: opts.workspaceId,
          user_key: identityKey,
          memory_preview: memReady
            ? memoryCacheRef.current.slice(0, MEMORY_LIMIT)
            : [],
        }),
      });

      opts.clearPendingFiles();

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${t}`);
      }
      const data = await res.json();
      const reply = String(data.text ?? "[No reply]");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e?.message ?? "Error"}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return {
    messages,
    setMessages,
    input,
    setInput,
    modeHint,
    setModeHint,
    streaming,
    memReady,
    send,
  };
}
