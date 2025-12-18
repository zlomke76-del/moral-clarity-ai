"use client";

import React from "react";
import { UI } from "./dock-ui";
import { MessageRenderer } from "./MessageRenderer";

type Message = {
  role: "user" | "assistant";
  content?: string;
  imageUrl?: string;
};

type Props = {
  messages: Message[];
  transcriptRef: React.RefObject<HTMLDivElement>;
  transcriptStyle: React.CSSProperties;
};

export function SolaceTranscript({
  messages,
  transcriptRef,
  transcriptStyle,
}: Props) {
  return (
    <div
      ref={transcriptRef}
      style={transcriptStyle}
      tabIndex={-1}
      aria-live="polite"
    >
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            margin: "6px 0",
            padding: "10px 12px",
            borderRadius: UI.radiusLg,
            background:
              m.role === "user"
                ? "rgba(39,52,74,.6)"
                : "rgba(28,38,54,.6)",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            lineHeight: 1.35,
            color: "white",
          }}
        >
          {/* -------- Image (hard-rendered) -------- */}
          {typeof m.imageUrl === "string" && m.imageUrl.length > 0 && (
            <img
              src={m.imageUrl}
              alt="Solace visual"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 12,
                marginBottom: m.content ? 6 : 0,
              }}
            />
          )}

          {/* -------- Text -------- */}
          {m.content && <MessageRenderer content={m.content} />}
        </div>
      ))}
    </div>
  );
}
