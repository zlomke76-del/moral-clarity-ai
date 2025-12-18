// ------------------------------------------------------------
// Solace Chat API Route (AUTHORITATIVE)
// Conversation-scoped Working Memory
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

// ------------------------------------------------------------
// Runtime configuration
// ------------------------------------------------------------
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function normalizeImageUrl(image: string): string {
  if (!image) return "";
  if (image.startsWith("data:image")) return image;
  return `data:image/png;base64,${image}`;
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
      ministryMode = false,
      founderMode = false,
      modeHint = "",
    } = body ?? {};

    const finalUserKey = canonicalUserKey ?? userKey;

    if (!message || !finalUserKey || !conversationId) {
      return NextResponse.json({
        ok: true,
        messages: [
          {
            role: "assistant",
            content:
              "I’m here, but I didn’t receive a valid message or session.",
          },
        ],
      });
    }

    const sessionId = conversationId;

    console.log("[SESSION] start", {
      sessionId,
      userKey: finalUserKey,
      workspaceId,
    });

    // --------------------------------------------------------
    // Supabase clients
    // --------------------------------------------------------
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
    // IMAGE PIPELINE (AUTHORITATIVE FIX)
    // --------------------------------------------------------
    if (isImageRequest(message)) {
      console.log("[IMAGE PIPELINE FIRED]", { sessionId });

      const rawImage = await generateImage(message);
      const imageUrl = normalizeImageUrl(rawImage);

      if (authUserId) {
        await supabaseService
          .schema("memory")
          .from("working_memory")
          .insert({
            conversation_id: sessionId,
            user_id: authUserId,
            workspace_id: workspaceId,
            role: "assistant",
            content: "",
            image_url: imageUrl,
          });
      }

      return NextResponse.json({
        ok: true,
        response: "",
        messages: [
          {
            role: "assistant",
            content: "",
            imageUrl,
          },
        ],
        diagnostics: { sessionId, pipeline: "image" },
      });
    }

    // --------------------------------------------------------
    // Persist user message
    // --------------------------------------------------------
    if (authUserId) {
      await supabaseService
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: sessionId,
          user_id: authUserId,
          workspace_id: workspaceId,
          role: "user",
          content: message,
        });
    }

    // --------------------------------------------------------
    // Assemble context
    // --------------------------------------------------------
    const context = await assembleContext(
      finalUserKey,
      workspaceId ?? null,
      message,
      { sessionId }
    );

    const wantsNews = isNewsRequest(message);

    // --------------------------------------------------------
    // NEWSROOM
    // --------------------------------------------------------
    if (wantsNews) {
      if (!context.newsDigest?.length) {
        return NextResponse.json({
          ok: true,
          messages: [
            {
              role: "assistant",
              content:
                "No verified neutral news digest is available. I will not speculate.",
            },
          ],
        });
      }

      const newsroomResponse = await runNewsroomExecutor(
        context.newsDigest
      );

      return NextResponse.json({
        ok: true,
        messages: [
          { role: "assistant", content: newsroomResponse },
        ],
      });
    }

    // --------------------------------------------------------
    // HYBRID PIPELINE
    // --------------------------------------------------------
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      ministryMode,
      founderMode,
      modeHint,
    });

    const safeResponse =
      typeof result?.finalAnswer === "string" && result.finalAnswer.length
        ? result.finalAnswer
        : "I’m here and ready to continue.";

    if (authUserId) {
      await supabaseService
        .schema("memory")
        .from("working_memory")
        .insert({
          conversation_id: sessionId,
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
    console.error("[CHAT ROUTE ERROR]", err);

    return NextResponse.json({
      ok: true,
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
