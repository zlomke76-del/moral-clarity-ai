"use client";

import React from "react";

type Props = {
  content: string;
};

export default function MessageRenderer({ content }: Props) {
  // Split on fenced code blocks ```
  const parts = content.split(/```/g);

  return (
    <>
      {parts.map((part, idx) => {
        const isCode = idx % 2 === 1;

        if (!isCode) {
          return (
            <span
              key={idx}
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                lineHeight: 1.35,
              }}
            >
              {part}
            </span>
          );
        }

        // Optional language line (e.g. ts, js)
        const lines = part.split("\n");
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9]+$/.test(firstLine);
        const code = hasLang ? lines.slice(1).join("\n") : part;

        return (
          <div
            key={idx}
            style={{
              position: "relative",
              margin: "12px 0",
              borderRadius: 8,
              background: "#0b1220",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 6,
                background: "#fbbf24",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Copy
            </button>

            <pre
              style={{
                margin: 0,
                padding: "14px",
                overflowX: "auto",
                fontSize: 13,
                lineHeight: 1.45,
                color: "#e5e7eb",
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        );
      })}
    </>
  );
}
