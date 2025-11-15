// app/components/useSolaceMemory.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { MCA_USER_KEY } from "@/lib/mca-config";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

type MemoryRow = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  user_key: string;
  kind: string | null;
  workspace_id: string | null;
};

export function useSolaceMemory() {
  const [userKey, setUserKey] = useState<string>(MCA_USER_KEY || "guest");
  const [memReady, setMemReady] = useState(false);
  const memoryCacheRef = useRef<MemoryRow[]>([]);

  // Durable per-user key: prefer Supabase email, else per-browser UUID
  useEffect(() => {
    let cancelled = false;

    async function resolveUserKey() {
      // SSR safety
      if (typeof window === "undefined") {
        if (!cancelled) setUserKey(MCA_USER_KEY || "guest");
        return;
      }

      try {
        const supabase = createSupabaseBrowser();

        // Try to get the logged-in Supabase user
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          // No session, fall back to anonymous behavior
          const anonKey =
            localStorage.getItem("mc:user_key") && localStorage.getItem("mc:user_key") !== "guest"
              ? (localStorage.getItem("mc:user_key") as string)
              : (() => {
                  const k = "u_" + crypto.randomUUID();
                  localStorage.setItem("mc:user_key", k);
                  return k;
                })();

          if (!cancelled) setUserKey(anonKey);
          return;
        }

        const rawEmail = data.user?.email?.trim();
        if (rawEmail) {
          // Canonical identity: email
          const emailKey = rawEmail.toLowerCase();
          localStorage.setItem("mc:user_key", emailKey);
          if (!cancelled) setUserKey(emailKey);
          return;
        }

        // If somehow there is a user but no email, use anon key
        const existing =
          localStorage.getItem("mc:user_key") && localStorage.getItem("mc:user_key") !== "guest"
            ? (localStorage.getItem("mc:user_key") as string)
            : (() => {
                const k = "u_" + crypto.randomUUID();
                localStorage.setItem("mc:user_key", k);
                return k;
              })();

        if (!cancelled) setUserKey(existing);
      } catch {
        // Hard fallback: MCA_USER_KEY or guest
        if (!cancelled) {
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
        }
      }
    }

    resolveUserKey();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load most recent memories for this user_key (when resolved)
  useEffect(() => {
    if (!userKey) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/memory?user_key=${encodeURIComponent(userKey)}&limit=50`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-Key": userKey,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.warn("Solace memory bootstrap: GET /api/memory failed", res.status);
          if (!cancelled) setMemReady(true);
          return;
        }

        const data = await res.json().catch(() => null);
        if (!data || !Array.isArray(data.rows)) {
          if (!cancelled) setMemReady(true);
          return;
        }

        if (!cancelled) {
          memoryCacheRef.current = data.rows as MemoryRow[];
          setMemReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.warn("Solace memory bootstrap: error fetching memories", err);
          setMemReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userKey]);

  return { userKey, memReady, memoryCacheRef };
}
