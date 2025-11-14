"use client";

import { useEffect, useRef, useState } from "react";
import { MCA_USER_KEY } from "@/lib/mca-config";

export type MemoryRow = {
  id: string;
  title: string | null;
  content: string;
  created_at?: string;
};

export function useSolaceMemory() {
  const [userKey, setUserKey] = useState<string>(MCA_USER_KEY);
  const [memReady, setMemReady] = useState(false);
  const memoryCacheRef = useRef<MemoryRow[]>([]);

  // Durable per-browser user key (fallback to MCA_USER_KEY / guest)
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

  // Bootstrap: fetch recent memory rows for this user key
  useEffect(() => {
    if (!userKey) return;
    let alive = true;

    (async () => {
      try {
        const r = await fetch(`/api/memory?limit=50`, {
          cache: "no-store",
          headers: { "X-User-Key": userKey || MCA_USER_KEY || "guest" },
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
  }, [userKey]);

  return { userKey, memReady, memoryCacheRef };
}
