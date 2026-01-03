// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Conversation-scoped Working Memory
// Rolling Compaction + Explicit Finalization
// NEXT 16 SAFE — NODE RUNTIME
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
// Compaction thresholds (Founder lane)
// ------------------------------------------------------------
const WM_TURN_TRIGGER = 25;
const WM_CHUNK_SIZE = 12;
const WM_TAIL_PROTECT = 10;

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type WMRow = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  created_at?: string;
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function isNewsKeywordFallback(message: string): boolean {
  const m = message.toLowerCase().trim();

  return (
    m === "news" ||
    m.includes("what is in the news") ||
    m.includes("what's in the news") ||
    m.includes("news today") ||
    m.includes("today's news") ||
    m.includes("latest news") ||
    m.includes("headlines") ||
    m.includes("current events")
  );
}

function looksLikeCode(text: string): boolean {
  return (
    text.includes("```") ||
    /function\s+\w+\s*\(/.test(text) ||
    /=>/.test(text) ||
    /const\s+\w+/.test(text) ||
    /;\s*$/.test(text)
  );
}

function isImageRequest(message: string): boolean {
  const m = message.trim().toLowerCase();
  if (looksLikeCode(message)) return false;

  return (
    /^generate (an )?image\b/.test(m) ||
    /^create (an )?image\b/.test(m) ||
    /^draw\b/.test(m) ||
    /^make (an )?(image|picture)\b/.test(m) ||
    /\b(image|picture) of\b/.test(m)
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

  const wm: WMRow[] = (wmRes.data ?? []) as WMRow[];

  if (wm.length <= WM_TURN_TRIGGER) return;

  const safeLimit = Math.max(0, wm.length - WM_TAIL_PROTECT);
  const chunk: WMRow[] = wm.slice(0, Math.min(WM_CHUNK_SIZE, safeLimit));
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
      .in("id", chunk.map((c) => c.id));
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
      action,
      payload,

      newsMode = false,
      newsLanguage,
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
    // ROLODEX — EXPLICIT WRITE ACTION (AUTHORITATIVE)
    // --------------------------------------------------------
    if (action === "rolodex.add" && authUserId) {
      if (!payload?.name || typeof payload.name !== "string") {
        return NextResponse.json(
          { ok: false, error: "Rolodex name is required" },
          { status: 400 }
        );
      }

      const origin = new URL(req.url).origin;

      const rolodexRes = await fetch(`${origin}/api/rolodex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!rolodexRes.ok) {
        const err = await rolodexRes.json();
        return NextResponse.json(
          { ok: false, error: err?.error ?? "Rolodex write failed" },
          { status: 500 }
        );
      }

      const { id } = await rolodexRes.json();

      return NextResponse.json({
        ok: true,
        response: "Saved to your Rolodex.",
        meta: { rolodexId: id },
        messages: [{ role: "assistant", content: "Saved to your Rolodex." }],
      });
    }

    // --------------------------------------------------------
    // FINALIZATION
    // --------------------------------------------------------
    if (action === "finalize" && authUserId) {
      await finalizeConversation({
        supabaseService,
        conversationId,
        userId: authUserId,
        reason: "explicit",
      });

      return NextResponse.json({ ok: true, response: "", messages: [] });
    }

    // --------------------------------------------------------
    // IMAGE PIPELINE
    // --------------------------------------------------------
    if (message && isImageRequest(message)) {
      const base64Image = await generateImage(message);
      return NextResponse.json({
        ok: true,
        response: "",
        messages: [{ role: "assistant", content: " ", imageUrl: base64Image }],
      });
    }

    // --------------------------------------------------------
    // WRITE USER MESSAGE
    // --------------------------------------------------------
    if (authUserId && message) {
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

    // --------------------------------------------------------
    // NEWSROOM
    // --------------------------------------------------------
    if (newsMode || (message && isNewsKeywordFallback(message))) {
      const origin = new URL(req.url).origin;

      const digestRes = await fetch(
        `${origin}/api/news/digest?limit=3`,
        { cache: "no-store" }
      );

      if (!digestRes.ok) {
        throw new Error("NEWS_DIGEST_FETCH_FAILED");
      }

      const digestJson = await digestRes.json();
      const stories = Array.isArray(digestJson?.stories)
        ? digestJson.stories
        : [];

      const newsroomResponse = await runNewsroomExecutor(stories);

      return NextResponse.json({
        ok: true,
        response: newsroomResponse,
        messages: [{ role: "assistant", content: newsroomResponse }],
        meta: { language: newsLanguage ?? "en" },
      });
    }

    // --------------------------------------------------------
    // HYBRID PIPELINE
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message ?? "",
      {
        sessionId: conversationId,
        sessionStartedAt: new Date().toISOString(),
      }
    );

    const result = await runHybridPipeline({
      userMessage: message ?? "",
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
