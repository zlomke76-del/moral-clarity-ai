// modules/streamer.ts
import { NextResponse } from "next/server";

export async function streamResult(stream: AsyncIterable<any>) {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          // handle text deltas
          if (
            event.type === "response.output_text.delta" &&
            typeof event.text === "string"
          ) {
            controller.enqueue(encoder.encode(event.text));
          }

          // handle final output_text
          if (
            event.type === "response.output_text.done" &&
            typeof event.text === "string"
          ) {
            controller.enqueue(encoder.encode(event.text));
          }

          // handle errors
          if (event.type === "response.error") {
            controller.enqueue(
              encoder.encode(`\n[Stream Error] ${event.error?.message || ""}\n`)
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
