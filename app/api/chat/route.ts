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
import { requiresEPPE01 } from "@/lib/solace/policies/materials";
import { validateEPPE01 } from "@/lib/solace/validators/eppe";

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

/*-----------------------------------------------------------------------
   CONTEXT ASSEMBLY (ADD: executionProfile SAFE EXTENSION)
   NOTE: Disabled at top-level to preserve AUTHORITATIVE file shape.
------------------------------------------------------------------------ */
/*
const context = await assembleContext(
  finalUserKey,
  resolvedWorkspaceId,
  message ?? "",
  ({
    sessionId: resolvedConversationId,
    sessionStartedAt: new Date().toISOString(),
    executionProfile,
  } as {
    sessionId: string;
    sessionStartedAt: string;
    executionProfile?: "demo" | "studio";
  })
);
*/

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
    // DEMO SAFE — EXECUTION PROFILE
    // --------------------------------------------------------
    const executionProfile =
      finalUserKey === "webflow-guest" ? "demo" : "studio";

    // --------------------------------------------------------
    // OPTION B2 — DEMO SENTINEL + SESSION WM
    // --------------------------------------------------------
    const DEMO_USER_ID = "demo-session";
    const allowSessionWM = executionProfile === "demo";

    // --------------------------------------------------------
    // CANONICAL WORKSPACE RESOLUTION
    // --------------------------------------------------------
    const resolvedWorkspaceId =
      workspaceId ??
      process.env.MCA_WORKSPACE_ID ??
      "global_news";

    // --------------------------------------------------------
    // ADMIN CLIENT (SINGLE AUTHORITATIVE DECLARATION)
    // --------------------------------------------------------
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // --------------------------------------------------------
    // AUTHORITATIVE CONVERSATION RESOLUTION
    // --------------------------------------------------------
    let resolvedConversationId: string | null = conversationId ?? null;

    // DEMO MODE — STABLE SESSION CONVERSATION (NO DB BOOTSTRAP)
    if (executionProfile === "demo") {
      resolvedConversationId =
        resolvedConversationId ?? `demo-${finalUserKey}`;
    }

    // STUDIO MODE — DURABLE CONVERSATION BOOTSTRAP
    if (
      executionProfile === "studio" &&
      !resolvedConversationId &&
      finalUserKey
    ) {
      const { data, error } = await supabaseAdmin
        .schema("memory")
        .from("conversations")
        .insert({
          user_id: finalUserKey,
          workspace_id: resolvedWorkspaceId,
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
// DEMO MODE — SESSION WM READ (10 TURN CAP)
// --------------------------------------------------------
let sessionWM: Array<{ role: "user" | "assistant"; content: string }> = [];

if (executionProfile === "demo" && resolvedConversationId) {
  const { data: wmRows } = await supabaseAdmin
    .schema("memory")
    .from("working_memory")
    .select("role, content, created_at")
    .eq("conversation_id", resolvedConversationId)
    .eq("user_id", DEMO_USER_ID)
    .order("created_at", { ascending: false })
    .limit(10);

  if (Array.isArray(wmRows) && wmRows.length > 0) {
    sessionWM = wmRows
      .reverse()
      .map((r) => ({
        role: r.role as "user" | "assistant",
        content: r.content,
      }));
  }
}

    // --------------------------------------------------------
    // SSR AUTH CONTEXT
    // --------------------------------------------------------
    const cookieStore: ReadonlyRequestCookies = await cookies();

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

    const {
      data: { user },
    } = await supabaseSSR.auth.getUser();

    // --------------------------------------------------------
    // AUTH USER RESOLUTION
    // --------------------------------------------------------
    const authUserId =
      executionProfile === "demo"
        ? DEMO_USER_ID
        : user?.id ?? finalUserKey;

    // --------------------------------------------------------
    // Persist user message (STUDIO + DEMO SESSION WM)
    // --------------------------------------------------------
    if ((authUserId || allowSessionWM) && message) {
      await supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: resolvedConversationId,
          user_id: authUserId ?? finalUserKey,
          workspace_id: resolvedWorkspaceId,
          role: "user",
          content: message,
        });
    }

    if (authUserId) {
      void maybeRunRollingCompaction({
        supabaseAdmin,
        conversationId: resolvedConversationId,
        userId: authUserId,
      });
    }

    // --------------------------------------------------------
    // CONTEXT ASSEMBLY (REQUIRED PATTERN)
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      resolvedWorkspaceId,
      message ?? "",
      ({
        sessionId: resolvedConversationId,
        sessionStartedAt: new Date().toISOString(),
        executionProfile,
      } as {
        sessionId: string;
        sessionStartedAt: string;
        executionProfile?: "demo" | "studio";
      })
    );

    // --------------------------------------------------------
    // DEMO SAFE — EARLY EXIT (CRITICAL FIX)
    // --------------------------------------------------------
    if (executionProfile === "demo" && isImageRequest(message)) {
      const demoResponse = "I’m here in demo mode. Ask me anything.";

      return NextResponse.json({
        ok: true,
        conversationId: resolvedConversationId,
        response: demoResponse,
        messages: [{ role: "assistant", content: demoResponse }],
      });
    }

    // --------------------------------------------------------
    // TERMINAL APPROVAL SHORT-CIRCUIT
    // --------------------------------------------------------
    if (isTerminalApproval(message)) {
      const terminalResponse = terminalApprovalResponse();

      if (authUserId || allowSessionWM) {
        await supabaseAdmin
          .schema("memory")
          .from("working_memory")
          .insert({
            conversation_id: resolvedConversationId,
            user_id: authUserId ?? finalUserKey,
            workspace_id: resolvedWorkspaceId,
            role: "assistant",
            content: terminalResponse,
          });
      }

      return NextResponse.json({
        ok: true,
        conversationId: resolvedConversationId,
        response: terminalResponse,
        messages: [{ role: "assistant", content: terminalResponse }],
      });
    }

    // --------------------------------------------------------
    // IMAGE REQUEST BRANCH
    // --------------------------------------------------------
    if (message && isImageRequest(message)) {
      const imageUrl = await generateImage(message);
      const imageHtml = `<img src="${imageUrl}" style="max-width:100%;border-radius:12px;" />`;

      if (authUserId || allowSessionWM) {
        await supabaseAdmin
          .schema("memory")
          .from("working_memory")
          .insert({
            conversation_id: resolvedConversationId,
            user_id: authUserId,
            workspace_id: resolvedWorkspaceId,
            role: "assistant",
            content: imageHtml,
          });
      }

      return NextResponse.json({
        ok: true,
        conversationId: resolvedConversationId,
        response: imageHtml,
        messages: [{ role: "assistant", content: imageHtml }],
      });
    }

    // --------------------------------------------------------
    // NEWSROOM EXECUTION (MINIMAL CONNECT RESTORED)
    // --------------------------------------------------------
    const wantsNews =
      newsMode === true ||
      (typeof message === "string" && isNewsKeywordFallback(message));

    if (wantsNews) {
      const { data: digestRows, error } = await supabaseAdmin
        .from("solace_news_digest_view")
        .select(
          "story_title, outlet, neutral_summary, story_url, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        throw new Error("NEWSROOM_DIGEST_FETCH_FAILED");
      }

      const newsroomResponse = await runNewsroomExecutor(digestRows ?? []);

      await supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: resolvedConversationId,
          user_id: finalUserKey,
          workspace_id: resolvedWorkspaceId,
          role: "assistant",
          content: newsroomResponse,
        });

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

    // --------------------------------------------------------
// EPPE-01 POLICY GATE (POST-REASONING, PRE-PERSISTENCE)
// --------------------------------------------------------
let gatedResponse = rawResponse;

// Build a conservative, type-safe policy context
const policyContext = {
  workspace: {
    id: resolvedWorkspaceId,
    mode: modeHint || undefined,
  },
  intent: {
    domain: founderMode ? "materials" : undefined,
    keywords:
      typeof message === "string"
        ? message.toLowerCase().split(/\W+/).filter(Boolean)
        : [],
  },
};

// Enforce EPPE-01 if required
if (requiresEPPE01(policyContext)) {
  let parsed: any;

  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    return NextResponse.json({
      ok: false,
      conversationId: resolvedConversationId,
      response:
        "This evaluation must be returned as structured EPPE-01 JSON. Required fields are missing or the format is invalid.",
      messages: [
        {
          role: "assistant",
          content:
            "EPPE-01 enforcement: output must be valid JSON conforming to the evaluation schema.",
        },
      ],
    });
  }

  const { valid, errors } = validateEPPE01(parsed);

  if (!valid) {
    return NextResponse.json({
      ok: false,
      conversationId: resolvedConversationId,
      response:
        "This evaluation does not meet EPPE-01 requirements and cannot be finalized.",
      messages: [
        {
          role: "assistant",
          content: `EPPE-01 validation failed:\n${errors
            ?.map(
              (e: any) => `- ${e.instancePath || "(root)"} ${e.message}`
            )
            .join("\n")}`,
        },
      ],
    });
  }

  // EPPE-01 passed → emit canonical structured output
  gatedResponse = JSON.stringify(parsed, null, 2);
}

// --------------------------------------------------------
// SAFETY SCRUB + FINAL ASSERTION
// --------------------------------------------------------
const scrubbed = scrubPhantomExecutionLanguage(gatedResponse);
const safeResponse = assertNoPhantomLanguage(scrubbed);

// --------------------------------------------------------
// PERSIST ASSISTANT MESSAGE
// --------------------------------------------------------
if (authUserId || allowSessionWM) {
  await supabaseAdmin
    .schema("memory")
    .from("working_memory")
    .insert({
      conversation_id: resolvedConversationId,
      user_id: authUserId,
      workspace_id: resolvedWorkspaceId,
      role: "assistant",
      content: safeResponse,
      });
  }

  // --------------------------------------------------------
  // RESPONSE
  // --------------------------------------------------------
  return NextResponse.json({
    ok: true,
    conversationId: resolvedConversationId,
    response: safeResponse,
    messages: [{ role: "assistant", content: safeResponse }],
  });
}
