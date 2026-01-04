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

type CodeArtifact = {
  type: "code";
  language: string;
  filename?: string;
  content: string;
};

type Message = {
  role: "user" | "assistant";
  content?: string | null;
  imageUrl?: string | null;
  export?: ExportItem | null;
  artifact?: CodeArtifact | null;
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
  useEffect(() => {
    if (!DEV_DIAG) return;
    console.log("[DIAG-TRANSCRIPT]", {
      count: messages.length,
      messages: messages.map((m, i) => ({
        i,
        role: m.role,
        hasImage: Boolean(m.imageUrl),
        hasText: Boolean(m.content && m.content.trim()),
        hasExport: Boolean(m.export),
        hasCode: Boolean(m.artifact),
      })),
    });
  }, [messages]);

  return (
    <div ref={transcriptRef} style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const hasImage = typeof msg.imageUrl === "string";
        const hasExport = Boolean(msg.export);
        const hasCode = Boolean(msg.artifact);
        const hasText = Boolean(msg.content && msg.content.trim());

        // 🔒 HARD SANITIZATION — NEVER RENDER HTML OR BASE64 FROM content
        const safeText =
          typeof msg.content === "string"
            ? msg.content.replace(/<img[\s\S]*?>/gi, "").trim()
            : "";

        const renderKey = `${i}-${msg.role}-${
          hasImage ? "img" : hasExport ? "export" : hasCode ? "code" : "txt"
        }`;

        if (DEV_DIAG) {
          console.log("[DIAG-MESSAGE]", {
            i,
            renderKey,
            hasImage,
            hasExport,
            hasCode,
            hasText,
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
                minWidth: hasImage || hasExport || hasCode ? 220 : undefined,
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
              {/* ---------------- Export ---------------- */}
              {hasExport && <ExportCard exportItem={msg.export!} />}

              {/* ---------------- Image (ONLY from imageUrl) ---------------- */}
              {hasImage && (
                <ImageWithFallback src={msg.imageUrl!} messageIndex={i} />
              )}

              {/* ---------------- Code Artifact ---------------- */}
              {hasCode && <CodeArtifactBlock artifact={msg.artifact!} />}

              {/* ---------------- Text ---------------- */}
              {!hasExport && !hasCode && safeText && (
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: 1.35,
                  }}
                >
                  {safeText}
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
   Image with load / error handling
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
    console.log("[DIAG-IMG]", {
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
      onError={() => setErrored(true)}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: UI.radiusMd,
        display: "block",
      }}
    />
  );
}

/* ------------------------------------------------------------------
   Code Artifact
------------------------------------------------------------------- */
function CodeArtifactBlock({ artifact }: { artifact: CodeArtifact }) {
  const { language, filename, content } = artifact;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(content).catch(() => {
      alert("Failed to copy code.");
    });
  };

  return (
    <div
      style={{
        background: UI.surface2,
        borderRadius: UI.radiusMd,
        boxShadow: UI.shadow,
        fontFamily: "source-code-pro, monospace",
        fontSize: 14,
        color: UI.text,
        padding: 12,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        position: "relative",
      }}
    >
      {(filename || language) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontWeight: 600,
            fontSize: 12,
            color: UI.sub,
          }}
        >
          <div>{filename || language.toUpperCase()}</div>
          <button
            onClick={copyToClipboard}
            style={{
              background: "transparent",
              border: "none",
              color: UI.sub,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ⧉
          </button>
        </div>
      )}

      <pre style={{ margin: 0, overflowX: "auto" }}>
        <code>{content}</code>
      </pre>
    </div>
  );
}
