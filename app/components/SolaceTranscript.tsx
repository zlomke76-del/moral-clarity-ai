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
            <UI.Bubble
              role={msg.role}
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {msg.content}
            </UI.Bubble>

            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="Assistant generated"
                style={{
                  marginTop: 8,
                  maxWidth: "100%",
                  borderRadius: 8,
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
