"use client";

import React, { useEffect } from "react";
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
  // --------------------------------------------------
  // DIAGNOSTIC: snapshot messages every render
  // --------------------------------------------------
  useEffect(() => {
    console.log("[DIAG-TRANSCRIPT] render", {
      count: messages.length,
      messages: messages.map((m, i) => ({
        i,
        role: m.role,
        hasImage: typeof m.imageUrl === "string",
        imageUrlPrefix:
          typeof m.imageUrl === "string"
            ? m.imageUrl.slice(0, 32)
            : null,
        imageUrlLength:
          typeof m.imageUrl === "string" ? m.imageUrl.length : 0,
        hasText: Boolean(m.content && m.content.trim()),
        contentLength: m.content?.length ?? 0,
      })),
    });
  }, [messages]);

  return (
    <div ref={transcriptRef} style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const hasImage = typeof msg.imageUrl === "string";
        const hasText = Boolean(msg.content && msg.content.trim());

        const renderKey = `${i}-${msg.role}-${hasImage ? "img" : "txt"}`;

        // --------------------------------------------------
        // DIAGNOSTIC: per-message render
        // --------------------------------------------------
        console.log("[DIAG-MESSAGE-RENDER]", {
          i,
          key: renderKey,
          role: msg.role,
          hasImage,
          hasText,
          imageUrlPrefix: hasImage
            ? msg.imageUrl!.slice(0, 32)
            : null,
          imageUrlLength: hasImage ? msg.imageUrl!.length : 0,
        });

        return (
          <div
            key={renderKey}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                minWidth: hasImage ? 220 : undefined,
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
                <>
                  {console.log("[DIAG-IMG-MOUNT]", {
                    i,
                    srcPrefix: msg.imageUrl!.slice(0, 32),
                    srcLength: msg.imageUrl!.length,
                  })}
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
                </>
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
