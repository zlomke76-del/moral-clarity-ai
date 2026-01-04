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
   IMAGE EXTRACTION (AUTHORITATIVE)
------------------------------------------------------------------- */
function extractImageFromContent(content?: string | null): string | null {
  if (!content) return null;

  // data:image/... anywhere
  const dataMatch = content.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/);
  if (dataMatch) return dataMatch[0];

  // <img src="..."> anywhere
  const imgMatch = content.match(
    /<img\s+[^>]*src=(["'])(data:image\/[^"']+)\1[^>]*>/i
  );
  if (imgMatch && imgMatch[2]) return imgMatch[2];

  return null;
}

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
        hasImageUrl: Boolean(m.imageUrl),
        contentLength: m.content?.length ?? 0,
        hasExport: Boolean(m.export),
        hasArtifact: Boolean(m.artifact),
      })),
    });
  }, [messages]);

  return (
    <div ref={transcriptRef} style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";

        const extractedImage =
          msg.imageUrl ||
          (msg.role === "assistant"
            ? extractImageFromContent(msg.content)
            : null);

        const hasImage = typeof extractedImage === "string";
        const hasExport = Boolean(msg.export);
        const hasCodeArtifact = Boolean(msg.artifact?.type === "code");

        const shouldRenderText =
          !hasImage &&
          !hasExport &&
          !hasCodeArtifact &&
          Boolean(msg.content && msg.content.trim());

        const renderKey = `${i}-${msg.role}-${
          hasImage ? "img" : hasExport ? "export" : hasCodeArtifact ? "code" : "txt"
        }`;

        if (DEV_DIAG) {
          console.log("[DIAG-MESSAGE]", {
            i,
            key: renderKey,
            hasImage,
            hasExport,
            hasCodeArtifact,
            shouldRenderText,
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
                minWidth: hasImage || hasExport || hasCodeArtifact ? 220 : undefined,
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
              {/* EXPORT */}
              {hasExport && <ExportCard exportItem={msg.export!} />}

              {/* IMAGE */}
              {hasImage && (
                <ImageWithFallback src={extractedImage!} messageIndex={i} />
              )}

              {/* CODE */}
              {hasCodeArtifact && <CodeArtifactBlock artifact={msg.artifact!} />}

              {/* TEXT */}
              {shouldRenderText && (
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
      <div style={{ fontSize: 12, color: UI.sub }}>{exportItem.filename}</div>
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
