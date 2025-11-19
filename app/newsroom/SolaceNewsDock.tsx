"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/** ============================================================
 * Solace Newsroom Dock (Separate from main SolaceDock)
 * Modes: Anchor / Analyst / Coach
 * Always-on Abrahamic layer (non-negotiable)
 * Orb: newsroom dual-tone (gold × midnight)
 * Minimizable into a pill
 * ============================================================ */

export default function SolaceNewsDock() {
  const [visible, setVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<"anchor" | "analyst" | "coach">("anchor");

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Solace Newsroom ready." },
  ]);

  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<any[]>([]);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // auto-scroll
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // autoresize textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  function appendAssistant(content: string) {
    setMessages((m) => [...m, { role: "assistant", content }]);
  }

  function addFiles(fs: FileList | null) {
    if (!fs) return;
    const arr = Array.from(fs);
    const mapped = arr.map((f) => ({
      name: f.name,
      file: f,
      url: URL.createObjectURL(f),
    }));
    setPendingFiles((p) => [...p, ...mapped]);
  }

  async function send() {
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;

    setMessages((m) => [...m, { role: "user", content: text || "Attachments:" }]);
    setInput("");

    // prepare API call for newsroom specialization
    const res = await fetch(`/api/solace-news/${mode}`, {
      method: "POST",
      body: JSON.stringify({
        text,
        mode,
        abrahamic: true,
        files: pendingFiles.map((f) => ({
          name: f.name,
          url: f.url,
        })),
      }),
    });

    const data = await res.json();
    setPendingFiles([]);

    appendAssistant(data.text || "[No response]");
  }

  /** =============== MINIMIZED PILL ==================== */
  if (collapsed) {
    return createPortal(
      <button
        onClick={() => setCollapsed(false)}
        style={{
          position: "fixed",
          left: 20,
          right: 20,
          bottom: 20,
          padding: "12px 18px",
          borderRadius: 9999,
          background: "rgba(10,15,25,0.9)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 40%, #f9d66a 0%, #b7903a 40%, #0b101a 95%)",
              boxShadow: "0 0 20px rgba(255,215,125,0.6)",
            }}
          />
          <span style={{ font: "600 14px system-ui" }}>Solace News</span>
        </span>

        <span style={{ fontSize: 12, opacity: 0.7 }}>Tap to open</span>
      </button>,
      document.body
    );
  }

  /** =============== FULL PANEL ==================== */
  return createPortal(
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 420,
        height: 560,
        background: "rgba(12,18,28,0.92)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
        backdropFilter: "blur(14px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          color: "#fff",
          userSelect: "none",
        }}
      >
        {/* ORB + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 35%, #f9d66a 0%, #b7903a 38%, #0f1622 92%)",
              boxShadow: "0 0 30px rgba(255,215,125,0.7)",
            }}
          />
          <div>
            <div style={{ font: "600 14px system-ui" }}>Solace — Newsroom</div>
            <div
              style={{
                fontSize: 11,
                opacity: 0.6,
                marginTop: -2,
              }}
            >
              Neutral • Transparent • Abrahamic Core
            </div>
          </div>
        </div>

        {/* Minimize */}
        <button
          onClick={() => setCollapsed(true)}
          style={{
            background: "transparent",
            border: 0,
            color: "#aaa",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          —
        </button>
      </header>

      {/* ================= MODES ================= */}
      <nav
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {[
          { id: "anchor", label: "Anchor" },
          { id: "analyst", label: "Analyst" },
          { id: "coach", label: "Coach" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id as any)}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "transparent",
              border: "none",
              color: mode === t.id ? "#f9d66a" : "#ccc",
              borderBottom:
                mode === t.id
                  ? "2px solid #f9d66a"
                  : "2px solid transparent",
              font: "600 13px system-ui",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ================= TRANSCRIPT ================= */}
      <div
        ref={transcriptRef}
        style={{
          flex: "1 1 auto",
          padding: "14px 16px",
          overflowY: "auto",
          color: "#eee",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              padding: "8px 10px",
              borderRadius: 10,
              whiteSpace: "pre-wrap",
              background:
                m.role === "user"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,217,125,0.12)",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* ================= COMPOSER ================= */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(10,15,23,0.6)",
        }}
      >
        {pendingFiles.length > 0 && (
          <div
            style={{
              marginBottom: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {pendingFiles.map((f, idx) => (
              <a
                key={idx}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "4px 8px",
                  background: "#0b111b",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 12,
                  color: "#ddd",
                }}
              >
                📎 {f.name}
              </a>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          {/* Attach */}
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "#0b111b",
              cursor: "pointer",
              color: "#fff",
            }}
            type="button"
            onClick={() =>
              document.getElementById("newsroom-file-input")?.click()
            }
          >
            📎
          </button>

          <input
            id="newsroom-file-input"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {/* Textarea */}
          <textarea
            ref={taRef}
            value={input}
            placeholder={`Ask Solace as the ${mode}…`}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            style={{
              flex: 1,
              minHeight: 40,
              maxHeight: 200,
              borderRadius: 12,
              padding: "10px 12px",
              background: "#0f1622",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              font: "14px system-ui",
              resize: "none",
            }}
          />

          {/* Send */}
          <button
            onClick={send}
            style={{
              width: 70,
              borderRadius: 12,
              background: "#f9d66a",
              border: 0,
              color: "#000",
              font: "600 14px system-ui",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
