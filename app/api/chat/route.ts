// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Conversation-scoped Working Memory
// Explicit Finalization Installed
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./modules/context.constants";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";
import { runNewsroomExecutor } from "./modules/newsroom-executor";
import { writeMemory } from "./modules/memory-writer";
import { generateImage } from "./modules/image-router";
import { runSessionCompaction } from "@/lib/memory/runSessionCompaction";
import { finalizeConversation } from "@/lib/memory/finalizeConversation";

// ------------------------------------------------------------
// Runtime configuration
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ------------------------------------------------------------
// Compaction thresholds
// ------------------------------------------------------------
const WM_TURN_TRIGGER = 25;
const WM_CHUNK_SIZE = 12;
const WM_TAIL_PROTECT = 10;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function isNewsRequest(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("news") ||
    m.includes("headlines") ||
    m.includes("what is happening") ||
    m.includes("what's happening") ||
    m.includes("current events") ||
    m.includes("latest news")
  );
}

function isImageRequest(message: string): boolean {
  const m = message.toLowerCase().trim();
  return (
    m.startsWith("generate an image") ||
    m.startsWith("create an image") ||
    m.startsWith("draw ") ||
    m.includes("image of") ||
    m.includes("picture of")
  );
}

// ------------------------------------------------------------
// ROLLING COMPACTION (NON-BLOCKING)
// ------------------------------------------------------------
async function maybeRunRollingCompaction(params: {
  supabaseService: ReturnType<typeof createServerClient>;
  conversationId: string;
  userId: string;
}) {
  const { supabaseService, conversationId, userId } = params;

  const wmRes = await supabaseService
    .schema("memory")
    .from("working_memory")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  const wm = wmRes.data ?? [];

  if (wm.length <= WM_TURN_TRIGGER) return;

  const safeLimit = Math.max(0, wm.length - WM_TAIL_PROTECT);
  const chunk = wm.slice(0, Math.min(WM_CHUNK_SIZE, safeLimit));
  if (chunk.length === 0) return;

  try {
    const compaction = await runSessionCompaction(conversationId, chunk);

    await supabaseService.schema("memory").from("memories").insert({
      user_id: userId,
      email: "system",
      workspace_id: null,
      memory_type: "session_compaction",
      source: "system",
      content: JSON.stringify(compaction),
      conversation_id: conversationId,
      confidence: 1.0,
    });

    await supabaseService
      .schema("memory")
      .from("working_memory")
      .delete()
      .in(
        "id",
        chunk.map((c) => c.id)
      );
  } catch (err) {
    console.error("[WM-COMPACTION] failed", err);
  }
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      canonicalUserKey,
      userKey,
      workspaceId,
      conversationId,
      action, // <-- NEW
      ministryMode = false,
      founderMode = false,
      modeHint = "",
    } = body ?? {};

    const finalUserKey = canonicalUserKey ?? userKey;

    if (!finalUserKey || !conversationId) {
      throw new Error("userKey and conversationId are required");
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const supabaseService = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() {
            return undefined;
          },
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const authUserId = user?.id ?? null;

    // --------------------------------------------------------
    // EXPLICIT FINALIZATION
    // --------------------------------------------------------
    if (action === "finalize" && authUserId) {
      await finalizeConversation({
        supabaseService,
        conversationId,
        userId: authUserId,
        reason: "explicit",
      });

      return NextResponse.json({
        ok: true,
        response: "",
        messages: [],
        diagnostics: {
          conversationId,
          finalized: true,
        },
      });
    }

    // --------------------------------------------------------
    // Normal chat flow continues below
    // --------------------------------------------------------
    if (!message) {
      return NextResponse.json({
        ok: true,
        response: "",
        messages: [],
      });
    }

    if (authUserId) {
      await supabaseService.schema("memory").from("working_memory").insert({
        conversation_id: conversationId,
        user_id: authUserId,
        workspace_id: workspaceId,
        role: "user",
        content: message,
      });
    }

    if (authUserId) {
      void maybeRunRollingCompaction({
        supabaseService,
        conversationId,
        userId: authUserId,
      });
    }

    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message,
      {
        sessionId: conversationId,
        sessionStartedAt: new Date().toISOString(),
      }
    );

    if (isNewsRequest(message)) {
      const newsroomResponse = await runNewsroomExecutor(context.newsDigest);
      return NextResponse.json({
        ok: true,
        response: newsroomResponse,
        messages: [{ role: "assistant", content: newsroomResponse }],
      });
    }

    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
    });

    const safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "I’m here and ready to continue.";

    if (authUserId) {
      await supabaseService.schema("memory").from("working_memory").insert({
        conversation_id: conversationId,
        user_id: authUserId,
        workspace_id: workspaceId,
        role: "assistant",
        content: safeResponse,
      });
    }

    return NextResponse.json({
      ok: true,
      response: safeResponse,
      messages: [{ role: "assistant", content: safeResponse }],
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    return NextResponse.json({
      ok: true,
      response:
        "An internal error occurred. I’m still here and ready to continue.",
      messages: [
        {
          role: "assistant",
          content:
            "An internal error occurred. I’m still here and ready to continue.",
        },
      ],
    });
  }
}
