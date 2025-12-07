// app/api/chat/modules/memory-writer.ts

import { createClient } from "@/lib/supabase/server";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";
import type { Database } from "@/lib/supabase/types";

/**
 * Writes new memory items into the appropriate base tables.
 * All Solace memory types are supported:
 *  - fact
 *  - episode
 *  - episode_chunk
 *  - autobio
 *
 * IMPORTANT:
 *  - vw_unified_memory is READ-ONLY (materialized view)
 *  - We always write into the underlying tables (user_memories, memory_episodes, user_autobiography)
 */

export async function writeMemory({
  workspaceId,
  memoryType,
  content,
  importance = 1,
  episodeId = null,
  seq = null,
}: {
  workspaceId: string | null;
  memoryType: "fact" | "episode" | "episode_chunk" | "autobio";
  content: string;
  importance?: number;
  episodeId?: string | null;
  seq?: number | null;
}) {
  const supabase = createClient<Database>();

  // -------------------------------------------------------------
  // Identity → canonical_user_key (NEVER NULL)
  // -------------------------------------------------------------
  const identity = await getCanonicalUserKey({});
  const canonicalKey = identity.canonicalKey;

  if (!canonicalKey || canonicalKey === "guest") {
    console.warn("[writeMemory] guest mode — memory will not persist");
    return { success: false, reason: "guest_mode" };
  }

  // -------------------------------------------------------------
  // ROUTE BY memoryType
  // -------------------------------------------------------------
  switch (memoryType) {
    // -----------------------------------------------------------
    // FACTS → user_memories
    // -----------------------------------------------------------
    case "fact": {
      const { error } = await supabase.from("user_memories").insert({
        user_key: canonicalKey,
        workspace_id: workspaceId,
        content,
        weight: importance,
      });

      if (error) {
        console.error("[writeMemory] fact insert error:", error);
        return { success: false, error };
      }
      return { success: true };
    }

    // -----------------------------------------------------------
    // EPISODE SUMMARY → memory_episodes
    // -----------------------------------------------------------
    case "episode": {
      const episode_uuid = episodeId || crypto.randomUUID();

      const { error } = await supabase.from("memory_episodes").insert({
        id: episode_uuid,
        user_key: canonicalKey,
        workspace_id: workspaceId,
        content,
        weight: importance,
      });

      if (error) {
        console.error("[writeMemory] episode insert error:", error);
        return { success: false, error };
      }
      return { success: true, episodeId: episode_uuid };
    }

    // -----------------------------------------------------------
    // EPISODE CHUNK → memory_episode_chunks
    // -----------------------------------------------------------
    case "episode_chunk": {
      if (!episodeId) {
        console.error("[writeMemory] episode_chunk requires episodeId");
        return { success: false, reason: "missing_episodeId" };
      }

      const { error } = await supabase
        .from("memory_episode_chunks")
        .insert({
          episode_id: episodeId,
          user_key: canonicalKey,
          workspace_id: workspaceId,
          seq: seq ?? 0,
          content,
        });

      if (error) {
        console.error("[writeMemory] episode_chunk error:", error);
        return { success: false, error };
      }
      return { success: true };
    }

    // -----------------------------------------------------------
    // AUTOBIOGRAPHY ENTRY → user_autobiography
    // -----------------------------------------------------------
    case "autobio": {
      const { error } = await supabase.from("user_autobiography").insert({
        user_key: canonicalKey,
        workspace_id: workspaceId,
        title: "Autobiographical Entry",
        narrative: content,
        importance,
      });

      if (error) {
        console.error("[writeMemory] autobio insert error:", error);
        return { success: false, error };
      }
      return { success: true };
    }

    default:
      console.error("[writeMemory] unknown memory type:", memoryType);
      return { success: false, reason: "unknown_memory_type" };
  }
}

