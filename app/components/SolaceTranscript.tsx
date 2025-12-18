"use client";

import React from "react";
import { UI } from "./dock-ui";
import MessageRenderer from "./MessageRenderer";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  messages: Message[];
};

export default function SolaceTranscript({ messages }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "12px 14px",
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
              <MessageRenderer content={msg.content} />
            </UI.Bubble>
          </div>
        );
      })}
    </div>
  );
}

