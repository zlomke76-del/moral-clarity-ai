"use client";

import React from "react";
import { UI } from "./dock-ui";

export type Message = {
  role: "user" | "assistant";
  content?: string | null;
  imageUrl?: string | null;
};

type Props = {
  messages: Message[];
  transcriptRef: React.MutableRefObject<HTMLDivElement | null>;
  transcriptStyle: React.CSSProperties;
};

export default function SolaceTranscript({
  messages,
  transcriptRef,
  transcriptStyle,
}: Props) {
  return (
    <div ref={transcriptRef} style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";

        const hasText =
          typeof msg.content === "string" &&
          msg.content.trim().length > 0;

        const hasImage =
          typeof msg.imageUrl === "string" &&
          msg.imageUrl.length > 0;

        // HARD GUARD: never render an empty bubble
        if (!hasText && !hasImage) {
          return null;
        }

        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 12px",
                borderRadius: UI.radiusLg,
                background: isUser ? UI.surface2 : UI.surface1,
                color: UI.text,
                boxShadow: UI.shadow,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {/* IMAGE — artifact lane (text-independent) */}
              {hasImage && (
                <img
                  src={msg.imageUrl!}
                  alt="Generated"
                  style={{
                    maxWidth: "100%",
                    borderRadius: UI.radiusMd,
                  }}
                />
              )}

              {/* TEXT — only if meaningful */}
              {hasText && <span>{msg.content}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
