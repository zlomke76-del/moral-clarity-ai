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

function normalizeImageSrc(src: string): string {
  if (!src) return "";
  // If already a data URL or http(s), return as-is
  if (src.startsWith("data:") || src.startsWith("http")) {
    return src;
  }
  // Otherwise assume raw base64 PNG
  return `data:image/png;base64,${src}`;
}

export default function SolaceTranscript({
  messages,
  transcriptRef,
  transcriptStyle,
}: Props) {
  return (
    <div ref={transcriptRef} style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const hasImage = Boolean(msg.imageUrl);
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
                padding: "10px 12px",
                borderRadius: UI.radiusLg,
                background: isUser ? UI.surface2 : UI.surface1,
                color: UI.text,
                boxShadow: UI.shadow,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                display: "flex",
                flexDirection: "column",
                gap: hasImage && hasText ? 8 : 0,
              }}
            >
              {hasImage && (
                <img
                  src={normalizeImageSrc(msg.imageUrl!)}
                  alt="Generated"
                  style={{
                    maxWidth: "100%",
                    borderRadius: UI.radiusMd,
                    display: "block",
                  }}
                />
              )}

              {hasText && <span>{msg.content}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
