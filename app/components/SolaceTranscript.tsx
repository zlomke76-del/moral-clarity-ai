"use client";

import React, { useEffect, useState } from "react";
import { UI } from "./dock-ui";

/**
 * Toggle diagnostics here.
 * Leave false in production unless actively debugging.
 */
const DEV_DIAG = true;

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */
type ExportItem = {
  kind: "export";
  format: "docx" | "pdf" | "csv";
  filename: string;
  url: string;
};

type Message = {
  role: "user" | "assistant";
  content?: string | null;
  imageUrl?: string | null;
  export?: ExportItem | null;
};

type Props = {
  messages: Message[];
  transcriptRef: React.MutableRefObject<HTMLDivElement | null>;
  transcriptStyle: React.CSSProperties;
};

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------- */
export default function SolaceTranscript({
  messages,
  transcriptRef,
  transcriptStyle,
}: Props) {
  // --------------------------------------------------
  // DIAGNOSTIC: snapshot messages on change
  // --------------------------------------------------
  useEffect(() => {
    if (!DEV_DIAG) return;

    console.log("[DIAG-TRANSCRIPT] render", {
      count: messages.length,
      messages: messages.map((m, i) => ({
        i,
        role: m.role,
        hasImage: typeof m.imageUrl === "string",
        hasText: Boolean(m.content && m.content.trim()),
        hasExport: Boolean(m.export),
        exportFormat: m.export?.format ?? null,
      })),
    });
  }, [messages]);

  return (
    <div ref={transcriptRef} style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const hasImage = typeof msg.imageUrl === "string";
        const hasText = Boolean(msg.content && msg.content.trim());
        const hasExport = Boolean(msg.export);

        /**
         * NOTE:
         * Still index-based, but stable for append-only streams.
         * Upgrade to message.id when available.
         */
        const renderKey = `${i}-${msg.role}-${hasImage ? "img" : hasExport ? "export" : "txt"}`;

        if (DEV_DIAG) {
          console.log("[DIAG-MESSAGE-RENDER]", {
            i,
            key: renderKey,
            role: msg.role,
            hasImage,
            hasText,
            hasExport,
          });
        }

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
                minWidth: hasImage || hasExport ? 220 : undefined,
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
              {/* ---------------- Export Card ---------------- */}
              {hasExport && <ExportCard exportItem={msg.export!} />}

              {/* ---------------- Image ---------------- */}
              {hasImage && (
                <ImageWithFallback
                  src={msg.imageUrl!}
                  messageIndex={i}
                />
              )}

              {/* ---------------- Text ---------------- */}
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

/* ------------------------------------------------------------------
   Export Card
------------------------------------------------------------------- */
function ExportCard({ exportItem }: { exportItem: ExportItem }) {
  const label =
    exportItem.format === "docx"
      ? "Word Document"
      : exportItem.format === "pdf"
      ? "PDF Document"
      : "CSV File";

  return (
    <div
      style={{
        border: UI.edge,
        borderRadius: 10,
        padding: 10,
        background: UI.surface2,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 600 }}>{label}</div>

      <div style={{ fontSize: 12, color: UI.sub }}>
        {exportItem.filename}
      </div>

      <a
        href={exportItem.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          alignSelf: "flex-start",
          padding: "6px 10px",
          borderRadius: 8,
          background: "#fbbf24",
          color: "#000",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Download
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------
   Image with explicit load / error visibility
------------------------------------------------------------------- */
function ImageWithFallback({
  src,
  messageIndex,
}: {
  src: string;
  messageIndex: number;
}) {
  const [errored, setErrored] = useState(false);

  if (DEV_DIAG) {
    console.log("[DIAG-IMG-MOUNT]", {
      i: messageIndex,
      srcPrefix: src.slice(0, 32),
      srcLength: src.length,
    });
  }

  if (errored) {
    return (
      <div
        style={{
          width: "100%",
          padding: 12,
          borderRadius: UI.radiusMd,
          background: UI.surface2,
          color: UI.sub,
          fontSize: 13,
          textAlign: "center",
        }}
      >
        Image failed to load
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Generated"
      loading="lazy"
      onLoad={() => {
        if (DEV_DIAG) {
          console.log("[DIAG-IMG-LOADED]", {
            i: messageIndex,
            srcPrefix: src.slice(0, 32),
          });
        }
      }}
      onError={() => {
        console.error("[DIAG-IMG-ERROR]", {
          i: messageIndex,
          srcPrefix: src.slice(0, 32),
        });
        setErrored(true);
      }}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: UI.radiusMd,
        display: "block",
      }}
    />
  );
}
