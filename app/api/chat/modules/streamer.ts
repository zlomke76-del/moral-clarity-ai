// modules/streamer.ts

import { NextResponse } from "next/server";

export async function streamResult(stream: AsyncIterable<any>) {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          // ---- Output text streaming -----------------------
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta));
          }

          if (event.type === "response.output_text.done") {
            if (event.text) {
              controller.enqueue(encoder.encode(event.text));
            }
          }

          // ---- Tool call events (future extension) ---------
          if (event.type === "response.tool_call") {
            controller.enqueue(
              encoder.encode(`[TOOL_CALL] ${JSON.stringify(event)}\n`)
            );
          }

          // ---- Errors -------------------------------------
          if (event.type === "response.error") {
            controller.enqueue(
              encoder.encode(
                `\n[Stream Error] ${event.error?.message || "Unknown error"}\n`
              )
            );
          }
        }
      } catch (err: any) {
        controller.enqueue(
          encoder.encode(`\n[Stream Error] ${err?.message || ""}\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
