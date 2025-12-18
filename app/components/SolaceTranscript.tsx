"use client";

import React from "react";
import { UI } from "./dock-ui";

type Message = {
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
        const hasImage = typeof msg.imageUrl === "string";
        const hasText = Boolean(msg.content && msg.content.trim());

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
                minWidth: hasImage ? 220 : undefined, // 🔑 RESTORED
                padding: 12,
                borderRadius: UI.radiusLg,
                background: isUser ? UI.surface2 : UI.surface1,
                color: UI.text,
                boxShadow: UI.shadow,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {hasImage && (
                <img
                  src={msg.imageUrl!}
                  alt="Generated"
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: UI.radiusMd,
                    display: "block",
                  }}
                />
              )}

              {hasText && (
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: 1.35,
                  }}
                >
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
