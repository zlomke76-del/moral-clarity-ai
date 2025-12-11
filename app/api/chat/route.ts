// ------------------------------------------------------------------
// SOLACE CHAT ROUTE — TEXT + IMAGE SUPPORT
// ------------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { sanitizeForModel, sanitizeObjectDeep } from "@/lib/solace/sanitize";

import { assembleContext } from "./modules/assembleContext";
import { runHybridPipeline } from "./modules/hybrid";
import { updateGovernor } from "@/lib/solace/governor/governor-engine";
import { applyGovernorFormatting } from "@/lib/solace/governor/governor-icon-format";
import { writeMemory } from "./modules/memory-writer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const message = sanitizeForModel(String(body.message));

    const {
      history = [],
      workspaceId = null,
      ministryMode = false,
      founderMode = false,
      modeHint = "Neutral",
      userKey: explicit
    } = body;

    // session
    const cookieHeader = req.headers.get("cookie") ?? "";
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => {
            const m = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith(name + "="));
            return m ? m.split("=")[1] : undefined;
          },
          set() {},
          remove() {}
        }
      }
    );

    const { data } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const user = data?.user ?? null;

    const canonicalUserKey = user?.id ?? explicit ?? "guest";

    // context
    let context = await assembleContext(canonicalUserKey, workspaceId, message);
    context = sanitizeObjectDeep(context);

    // governor
    const gov = updateGovernor(message);

    // pipeline
    const result = await runHybridPipeline({
      userMessage: message,
      context,
      history,
      ministryMode,
      founderMode,
      modeHint,
      canonicalUserKey,
      governorLevel: gov.level,
      governorInstructions: gov.instructions
    });

    // formatting
    const formatted = applyGovernorFormatting(result.finalAnswer, {
      level: gov.level,
      isFounder: founderMode,
      emotionalDistress: false,
      decisionContext: false
    });

    // memory write
    try {
      await writeMemory(canonicalUserKey, message, formatted);
    } catch {}

    // response
    return NextResponse.json({
      text: formatted,
      imageUrl: result.imageUrl ?? null
    });
  } catch (err: any) {
    console.error("[CHAT ROUTE ERROR]", err);
    return NextResponse.json(
      { error: err?.message ?? "ChatRouteError", text: "[error]", imageUrl: null },
      { status: 500 }
    );
  }
}
