"use client";

import React from "react";
import { UI } from "./dock-ui";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

type Props = {
  messages: Message[];
  transcriptRef?: React.MutableRefObject<HTMLDivElement | null>;
  transcriptStyle?: React.CSSProperties;
};

export default function SolaceTranscript({
  messages,
  transcriptRef,
  transcriptStyle,
}: Props) {
  return (
    <div
      ref={transcriptRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "12px 14px",
        ...(transcriptStyle || {}),
      }}
    >
      {messages.map((msg, idx) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={idx}
            style={{
              alignSelf: isUser ? "flex-end" : "flex-start",
              maxWidth: "92%",
            }}
          >
            {/* Message bubble */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: UI.radiusMd,
                border: UI.border,
                background: isUser ? UI.surface2 : UI.surface1,
                color: UI.text,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                boxShadow: UI.shadow,
              }}
            >
              {msg.content}
            </div>

            {/* Optional image */}
            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="Assistant generated"
                style={{
                  marginTop: 8,
                  maxWidth: "100%",
                  borderRadius: UI.radiusMd,
                  border: UI.border,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
