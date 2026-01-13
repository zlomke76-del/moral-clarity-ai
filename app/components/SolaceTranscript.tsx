"use client";

import React, { useEffect, useState } from "react";
import { UI } from "./dock-ui";
import ReactMarkdown from "react-markdown";

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

type TextArtifact = {
  type: "text";
  format: "plain" | "markdown";
  title?: string;
  content: string;
};

type Message = {
  role: "user" | "assistant";
  content?: string | null;
  imageUrl?: string | null;
  export?: ExportItem | null;
  artifact?: CodeArtifact | TextArtifact | null;
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
  return (
    <div ref={transcriptRef} style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const artifactType = msg.artifact?.type;

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
                padding: 12,
                borderRadius: UI.radiusLg,
                background: isUser ? UI.surface2 : UI.surface1,
                color: UI.text,
                boxShadow: UI.shadow,
              }}
            >
              {artifactType === "code" && (
                <CodeArtifactBlock artifact={msg.artifact as CodeArtifact} />
              )}

              {artifactType === "text" && (
                <TextArtifactBlock artifact={msg.artifact as TextArtifact} />
              )}

              {!artifactType && msg.content && (
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.35 }}>
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
   Code Artifact
------------------------------------------------------------------- */
function CodeArtifactBlock({ artifact }: { artifact: CodeArtifact }) {
  const copy = () => navigator.clipboard.writeText(artifact.content);

  return (
    <div
      style={{
        background: UI.surface2,
        borderRadius: UI.radiusMd,
        padding: 12,
        fontFamily: "monospace",
      }}
    >
      <Header title={artifact.filename || artifact.language} onCopy={copy} />
      <pre style={{ margin: 0, overflowX: "auto" }}>
        <code>{artifact.content}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------
   Text Artifact (NEW)
------------------------------------------------------------------- */
function TextArtifactBlock({ artifact }: { artifact: TextArtifact }) {
  const copy = () => navigator.clipboard.writeText(artifact.content);

  return (
    <div
      style={{
        background: UI.surface2,
        borderRadius: UI.radiusMd,
        padding: 12,
      }}
    >
      <Header title={artifact.title || "Response"} onCopy={copy} />

      <div style={{ lineHeight: 1.45 }}>
        {artifact.format === "markdown" ? (
          <ReactMarkdown>{artifact.content}</ReactMarkdown>
        ) : (
          <div style={{ whiteSpace: "pre-wrap" }}>{artifact.content}</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Shared Header
------------------------------------------------------------------- */
function Header({
  title,
  onCopy,
}: {
  title?: string;
  onCopy: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8,
        fontSize: 12,
        fontWeight: 600,
        color: UI.sub,
      }}
    >
      <div>{title}</div>
      <button
        onClick={onCopy}
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
  );
}
