// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Conversation-scoped Working Memory
// Rolling Compaction + Explicit Finalization
// NEXT 16 SAFE — NODE RUNTIME
// ------------------------------------------------------------

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
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
// ADDITIVE — ROLODEX INTENT
// ------------------------------------------------------------
function detectRolodexIntent(message: string): boolean {
  const m = message.toLowerCase();
  return (
    /(add|save|store|remember|guardar|ajouter|speichern|salva)/i.test(m) &&
    /(rolodex|contact|person|email|phone|telefono|correo|kontakt)/i.test(m)
  );
}

function extractRolodexPayload(message: string) {
  const email =
    message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;

  const phone =
    message.match(/(\+?\d[\d\s\-()]{7,})/)?.[0] ?? null;

  const nameMatch =
    message.match(/(?:name|contact|person)[:\-]?\s*([A-Za-z\s]+)/i);

  if (!email && !phone && !nameMatch) return null;

  return {
    name: nameMatch?.[1]?.trim() ?? "Unknown",
    primary_email: email,
    primary_phone: phone,
    notes: message,
  };
}

// ------------------------------------------------------------
// ROLLING COMPACTION (NON-BLOCKING)
// ------------------------------------------------------------
async function maybeRunRollingCompaction(params: {
  supabaseAdmin: ReturnType<typeof createClient>;
  conversationId: string;
  userId: string;
}) {
  const { supabaseAdmin, conversationId, userId } = params;

  const wmRes = await supabaseAdmin
    .schema("memory")
    .from("working_memory")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  const wm: WMRow[] = (wmRes.data ?? []) as WMRow[];

  if (wm.length <= WM_TURN_TRIGGER) return;

  const safeLimit = Math.max(0, wm.length - WM_TAIL_PROTECT);
  const chunk = wm.slice(0, Math.min(WM_CHUNK_SIZE, safeLimit));
  if (chunk.length === 0) return;

  try {
    const compaction = await runSessionCompaction(conversationId, chunk);

    await supabaseAdmin.schema("memory").from("memories").insert({
      user_id: userId,
      email: "system",
      workspace_id: null,
      memory_type: "session_compaction",
      source: "system",
      content: JSON.stringify(compaction),
      conversation_id: conversationId,
      confidence: 1.0,
    });

    await supabaseAdmin
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

    let parsedAction = action;
    let parsedPayload = payload;

    if (!parsedAction && typeof message === "string") {
      try {
        const maybe = JSON.parse(message);
        if (maybe?.action && maybe?.payload) {
          parsedAction = maybe.action;
          parsedPayload = maybe.payload;
        }
      } catch {}
    }

    if (!parsedAction && typeof message === "string") {
      if (detectRolodexIntent(message)) {
        const extracted = extractRolodexPayload(message);
        if (extracted?.name) {
          parsedAction = "rolodex.add";
          parsedPayload = extracted;
        }
      }
    }

    const cookieStore = await cookies();

    // --------------------------------------------------------
    // USER SSR CLIENT (AUTH ONLY)
    // --------------------------------------------------------
    const supabaseSSR = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabaseSSR.auth.getUser();

    const authUserId = user?.id ?? null;

    // --------------------------------------------------------
    // TRUE ADMIN CLIENT (RLS BYPASS)
    // --------------------------------------------------------
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // --------------------------------------------------------
    // ROLODEX — AUTHORITATIVE ADMIN WRITE
    // --------------------------------------------------------
    if (parsedAction === "rolodex.add" && authUserId) {
      const { data, error } = await supabaseAdmin
        .schema("memory")
        .from("rolodex")
        .insert({
          user_id: authUserId,
          ...parsedPayload,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[ROLODEX WRITE FAILED]", error);
        throw error;
      }

      return NextResponse.json({
        ok: true,
        response: "Saved to your Rolodex.",
        meta: { rolodexId: data.id },
        messages: [{ role: "assistant", content: "Saved to your Rolodex." }],
      });
    }

    // --------------------------------------------------------
    // WRITE USER MESSAGE (NON-BLOCKING, ADMIN)
    // --------------------------------------------------------
    if (authUserId && message) {
      void supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: conversationId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "user",
          content: message,
        })
        .catch((err) =>
          console.error("[WM USER WRITE FAILED]", err)
        );
    }

    if (authUserId) {
      void maybeRunRollingCompaction({
        supabaseAdmin,
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

    // --------------------------------------------------------
    // WRITE ASSISTANT MESSAGE (NON-BLOCKING, ADMIN)
    // --------------------------------------------------------
    if (authUserId) {
      void supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: conversationId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "assistant",
          content: safeResponse,
        })
        .catch((err) =>
          console.error("[WM ASSISTANT WRITE FAILED]", err)
        );
    }

    // --------------------------------------------------------
    // PERSIST SMS DRAFT (APPROVAL REQUIRED)
    // --------------------------------------------------------
    if (authUserId && (context as any).__draftSms) {
      void supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: conversationId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "system",
          content: JSON.stringify((context as any).__draftSms),
        })
        .catch((err) =>
          console.error("[WM SMS DRAFT WRITE FAILED]", err)
        );
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
