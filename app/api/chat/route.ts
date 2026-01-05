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
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// ------------------------------------------------------------
// Context constants
// ------------------------------------------------------------
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./modules/context.constants";

// ------------------------------------------------------------
// Core pipelines
// ------------------------------------------------------------
import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";
import { runNewsroomExecutor } from "./modules/newsroom-executor";
import { writeMemory } from "./modules/memory-writer";
import { generateImage } from "./modules/image-router";

// ------------------------------------------------------------
// Memory lifecycle
// ------------------------------------------------------------
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
// Helpers — intent detection
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

function isExplicitSendApproval(message?: string): boolean {
  if (!message) return false;
  const m = message.toLowerCase().trim();
  return (
    m === "send" ||
    m === "send it" ||
    m === "yes" ||
    m === "yes send" ||
    m === "approve" ||
    m === "go ahead"
  );
}

// ------------------------------------------------------------
// ADDITIVE — EXECUTOR DIRECTIVE (same-turn authority)
// ------------------------------------------------------------
function isExecutorDirective(text?: string): boolean {
  if (!text) return false;
  return /execute outbound sms|proceed with immediate outbound sms/i.test(text);
}

// ------------------------------------------------------------
// TERMINAL APPROVAL (TAAT)
// ------------------------------------------------------------
function isTerminalApproval(message?: string): boolean {
  if (!message) return false;
  return /finalize the decision and proceed/i.test(message);
}

function terminalApprovalResponse(): string {
  return [
    "Acknowledged.",
    "",
    "- The decision has been finalized.",
    "- No execution has occurred.",
    "- No tools, APIs, or integrations are available.",
    "",
    "There is nothing further to state.",
  ].join("\n");
}

// ------------------------------------------------------------
// PHANTOM EXECUTION LANGUAGE SCRUBBER (HARD GUARD)
// ------------------------------------------------------------
function scrubPhantomExecutionLanguage(text: string): string {
  if (!text) return text;

  const patterns = [
    /\bexecut(e|ing|ed)\b[^.]*\./gi,
    /\bproceed(ing|ed)?\b[^.]*\./gi,
    /\binitiat(e|ing|ed)\b[^.]*\./gi,
    /\blaunch(ing|ed)?\b[^.]*\./gi,
    /\btrigger(ing|ed)?\b[^.]*\./gi,
    /\brun(ning|ran)?\b[^.]*\./gi,
    /\bperform(ing|ed)?\b[^.]*\./gi,
    /\ballocat(e|ing|ed)\b[^.]*\./gi,
    /\binternal execution[^.]*\./gi,
    /\btask allocation[^.]*\./gi,
    /\bworkflow has started[^.]*\./gi,
    /\boperation underway[^.]*\./gi,
    /\bi will (now )?(execute|proceed|initiate)[^.]*\./gi,
  ];

  let out = text;
  for (const p of patterns) {
    out = out.replace(p, "");
  }

  return out.trim();
}

function assertNoPhantomLanguage(text: string): string {
  const forbidden = /(execut|proceed|initiat|launch|trigger|allocat|perform|run)\b/i;
  if (forbidden.test(text)) {
    return "I can reason, explain, and advise — but no actions or executions occur.";
  }
  return text;
}

// ------------------------------------------------------------
// ROLLING COMPACTION (NON-BLOCKING)
// ------------------------------------------------------------
async function maybeRunRollingCompaction(params: {
  supabaseAdmin: any;
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
  if (!chunk.length) return;

  try {
    const compaction = await runSessionCompaction(conversationId, chunk);

    await supabaseAdmin
      .schema("memory")
      .from("memories")
      .insert({
        user_id: userId,
        email: "system",
        workspace_id: null,
        memory_type: "session_compaction",
        source: "system",
        content: JSON.stringify(compaction),
        conversation_id: conversationId,
        confidence: 1.0,
      } as any);

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
// POST handler (AUTHORITATIVE)
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
      newsMode = false,
      newsLanguage,
      ministryMode = false,
      founderMode = false,
      modeHint = "",
      newsDigest,
    } = body ?? {};

    const finalUserKey = canonicalUserKey ?? userKey;

    // --------------------------------------------------------
    // AUTHORITATIVE CONVERSATION BOOTSTRAP (SINGLE-USE)
    // --------------------------------------------------------
    let resolvedConversationId: string | null = conversationId ?? null;

    if (!resolvedConversationId && finalUserKey) {
      const supabaseAdminBootstrap = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: { persistSession: false, autoRefreshToken: false },
        }
      );

      const { data, error } = await supabaseAdminBootstrap
        .schema("memory")
        .from("conversations")
        .insert({
          user_id: finalUserKey,
          workspace_id: workspaceId ?? null,
          source: "chat_bootstrap",
        })
        .select("id")
        .single();

      if (error || !data?.id) {
        throw new Error("Failed to bootstrap conversation");
      }

      resolvedConversationId = data.id;
    }

    if (!finalUserKey || !resolvedConversationId) {
      throw new Error("userKey and conversationId are required");
    }

    // --------------------------------------------------------
// SSR AUTH CONTEXT (READ-ONLY) — NEXT 16 SAFE
// --------------------------------------------------------
const cookieStore = await cookies();

const supabaseSSR = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  }
);

    // --------------------------------------------------------
    // Persist user message
    // --------------------------------------------------------
    if (authUserId && message) {
      await supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: resolvedConversationId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "user",
          content: message,
        } as any);
    }

    if (authUserId) {
      void maybeRunRollingCompaction({
        supabaseAdmin,
        conversationId: resolvedConversationId,
        userId: authUserId,
      });
    }

    // --------------------------------------------------------
    // TERMINAL APPROVAL SHORT-CIRCUIT
    // --------------------------------------------------------
    if (isTerminalApproval(message)) {
      const terminalResponse = terminalApprovalResponse();

      if (authUserId) {
        await supabaseAdmin
          .schema("memory")
          .from("working_memory")
          .insert({
            conversation_id: resolvedConversationId,
            user_id: authUserId,
            workspace_id: workspaceId,
            role: "assistant",
            content: terminalResponse,
          } as any);
      }

      return NextResponse.json({
        ok: true,
        conversationId: resolvedConversationId,
        response: terminalResponse,
        messages: [{ role: "assistant", content: terminalResponse }],
      });
    }

    // --------------------------------------------------------
    // CONTEXT ASSEMBLY
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message ?? "",
      {
        sessionId: resolvedConversationId,
        sessionStartedAt: new Date().toISOString(),
      }
    );

    // --------------------------------------------------------
    // IMAGE REQUEST BRANCH
    // --------------------------------------------------------
    if (message && isImageRequest(message)) {
      const imageUrl = await generateImage(message);
      const imageHtml = `<img src="${imageUrl}" style="max-width:100%;border-radius:12px;" />`;

      if (authUserId) {
        await supabaseAdmin
          .schema("memory")
          .from("working_memory")
          .insert({
            conversation_id: resolvedConversationId,
            user_id: authUserId,
            workspace_id: workspaceId,
            role: "assistant",
            content: imageHtml,
          } as any);
      }

      return NextResponse.json({
        ok: true,
        conversationId: resolvedConversationId,
        response: imageHtml,
        messages: [{ role: "assistant", content: imageHtml }],
      });
    }

    // --------------------------------------------------------
    // NEWSROOM EXECUTION
    // --------------------------------------------------------
    const wantsNews =
      newsMode === true ||
      (typeof message === "string" && isNewsKeywordFallback(message));

    if (wantsNews) {
      const newsroomResponse = await runNewsroomExecutor(newsDigest ?? []);
      if (authUserId) {
        await supabaseAdmin
          .schema("memory")
          .from("working_memory")
          .insert({
            conversation_id: resolvedConversationId,
            user_id: authUserId,
            workspace_id: workspaceId,
            role: "assistant",
            content: newsroomResponse,
          } as any);
      }

      return NextResponse.json({
        ok: true,
        conversationId: resolvedConversationId,
        response: newsroomResponse,
        messages: [{ role: "assistant", content: newsroomResponse }],
      });
    }

    // --------------------------------------------------------
    // HYBRID PIPELINE
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message ?? "",
      context,
      ministryMode,
      founderMode,
      modeHint,
    });

    const rawResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length > 0
        ? result.finalAnswer
        : "I’m here and ready to continue.";

    const scrubbed = scrubPhantomExecutionLanguage(rawResponse);
    const safeResponse = assertNoPhantomLanguage(scrubbed);

    if (authUserId) {
      await supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: resolvedConversationId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "assistant",
          content: safeResponse,
        } as any);
    }

    return NextResponse.json({
      ok: true,
      conversationId: resolvedConversationId,
      response: safeResponse,
      messages: [{ role: "assistant", content: safeResponse }],
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err?.message);

    return NextResponse.json({
      ok: false,
      response: "An internal error occurred. I’m still here.",
      messages: [
        { role: "assistant", content: "An internal error occurred. I’m still here." },
      ],
    });
  }
}
