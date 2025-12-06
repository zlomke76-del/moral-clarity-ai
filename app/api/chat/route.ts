// app/api/chat/route.ts

import { NextResponse } from "next/server";

import { assembleContext } from "./modules/context";
import { assemblePrompt } from "./modules/assemble";
import { runModel } from "./modules/model-router";
import { streamResult } from "./modules/streamer";
import { executeTool } from "./modules/tools";
import { extractToolCall } from "./modules/types";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userKey = "guest", workspaceId = null } = body;

    // 1. Context --------------------------------------------------
    const context = await assembleContext(userKey, workspaceId, message);

    // 2. Prompt assembly ------------------------------------------
    const messages = assemblePrompt(context, message);

    // 3. Run model ------------------------------------------------
    let stream = await runModel(messages);

    // 4. Detect tool call -----------------------------------------
    const iterator = stream[Symbol.asyncIterator]();
    const firstChunk = await iterator.next();

    // firstChunk.value → chunk is already the object
    const tool = extractToolCall(firstChunk.value ?? firstChunk);

    if (tool) {
      // ---- 4A. Collect the full arguments stream ----------------
      let argsText = "";

      for await (const chunk of stream) {
        const t = extractToolCall(chunk);
        if (t?.arguments) {
          argsText += JSON.stringify(t.arguments);
        }
      }

      // Parse JSON safely
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(argsText || "{}");
      } catch {
        parsedArgs = {};
      }

      // ---- 4B. Execute tool -------------------------------------
      const toolResult = await executeTool(
        tool.toolName,
        parsedArgs,
        userKey
      );

      // ---- 4C. Re-run model with tool result ---------------------
      const followupMessages = [
        ...messages,
        {
          role: "tool",
          content: JSON.stringify(toolResult),
          name: tool.toolName,
        },
      ];

      stream = await runModel(followupMessages);
      return await streamResult(stream);
    }

    // 5. Normal streaming -----------------------------------------
    return await streamResult({
      async *[Symbol.asyncIterator]() {
        // same here — firstChunk.value removed
        yield firstChunk.value ?? firstChunk;
        for await (const c of stream) yield c;
      },
    });

  } catch (err: any) {
    console.error("[chat route] fatal error", err);
    return NextResponse.json(
      { error: err?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}


