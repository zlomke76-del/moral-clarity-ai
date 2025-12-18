"use client";

import React from "react";
import { UI } from "./dock-ui";
import MessageRenderer from "./MessageRenderer";

type Message = {
  role: "user" | "assistant";
  content: string;
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
              }}
            >
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Generated"
                  style={{
                    maxWidth: "100%",
                    borderRadius: UI.radiusMd,
                    marginBottom: msg.content ? 8 : 0,
                  }}
                />
              )}

              <MessageRenderer content={msg.content} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
