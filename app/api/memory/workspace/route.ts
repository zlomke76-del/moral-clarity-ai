import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    // Auth: Bearer token in Authorization header
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const accessToken = auth.replace("Bearer ", "").trim();
    const supabase = createSupabaseServerClient(accessToken);

    // Validate Supabase session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Get workspaceId from query
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing workspaceId" },
        { status: 400 }
      );
    }

    // Query memory.memories relation in the memory schema
    const { data, error } = await supabase
      .schema("memory")
      .from("memories")
      .select(`
        id,
        workspace_id,
        title,
        content,
        created_at,
        updated_at
      `)
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[MEMORY API] query error", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (err: any) {
    console.error("[MEMORY API] fatal", err);
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
```

---

### 2. `app/w/[workspaceId]/memory/MemoryWorkspaceClient.tsx`
> Client logic for fetching, displaying, and editing memories.  
> Uses Supabase client helpers to set `Authorization: Bearer` headers.

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import MemoryIndexPanel from "@/app/components/memory/MemoryIndexPanel";
import MemoryEditorPanel from "@/app/components/memory/MemoryEditorPanel";
import type { MemoryRecord } from "@/app/components/memory/types";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  const [items, setItems] = useState<MemoryRecord[]>(initialItems);
  const [selected, setSelected] = useState<MemoryRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMemories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createPagesBrowserClient();
      const {
        data: { session }, error: supabaseError
      } = await supabase.auth.getSession();

      if (supabaseError || !session?.access_token) {
        setError("Not authenticated. Please log in.");
        setItems([]);
        setLoading(false);
        return;
      }
      const access_token = session.access_token;
      const res = await fetch(
        `/api/memory/workspace?workspaceId=${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (!res.ok) {
        setError("Failed to load workspace memories.");
        setItems([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.items)) {
        setItems(data.items);
        if (selected && !data.items.find((x) => x.id === selected.id)) {
          setSelected(null);
        }
      } else {
        setError("Unexpected memory list format.");
        setItems([]);
      }
    } catch (err) {
      setError("An error occurred while loading memories.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, selected]);

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  function handleUpdate(updated: MemoryRecord) {
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelected(updated);
  }

  return (
    <div data-memory-grid className="flex-1 grid grid-cols-[420px_1fr] min-h-0">
      <aside className="border-r border-neutral-800 overflow-y-auto">
        <MemoryIndexPanel
          items={items}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          loading={loading}
          error={error}
          refetch={loadMemories}
        />
      </aside>
      <main className="overflow-hidden">
        {selected ? (
          <MemoryEditorPanel
            workspaceId={workspaceId}
            record={selected}
            onSave={async (newContent) => {
              // Parse as JSON if original was object
              let content: any = newContent;
              if (selected.content && typeof selected.content === "object") {
                try {
                  content = JSON.parse(newContent);
                } catch {
                  // Optionally: indicate invalid JSON
                  return;
                }
              }
              const supabase = createPagesBrowserClient();
              const { data: { session } } = await supabase.auth.getSession();
              const access_token = session?.access_token;
              if (!access_token) return;
              const res = await fetch(`/api/memory/${selected.id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ content }),
              });
              if (res.ok) {
                const updated = await res.json();
                handleUpdate(updated);
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500 px-4">
            {loading
              ? "Loading workspace memories..."
              : error
              ? error
              : "Select a memory to view or edit"}
          </div>
        )}
      </main>
    </div>
  );
}
