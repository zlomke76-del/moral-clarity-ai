"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
};

type Mode = "anchor" | "analyst" | "coach";

type PendingFile = {
  name: string;
  file?: File;
  url: string;
};

/**
 * SolaceNewsDock
 *
 * A dedicated newsroom orb dock that is independent from the global SolaceDock.
 * - Modes: Anchor (neutral story), Analyst (bias report), Coach (interpretation / guidance)
 * - Always-on Abrahamic layer (non-negotiable, hard-coded true)
 * - Minimizable into a pill
 *
 * This component does NOT use the shared Solace store; it talks directly to
 * `/api/solace-news/:mode` and can be mounted only on /newsroom or a future
 * "neutral news only" product tier.
 */
export default function SolaceNewsDock() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>("anchor");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to the Solace Newsroom orb. Choose Story, Bias, or Coach above to begin, or load a daily story and ask what you need to see clearly.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const orbRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mount guard for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (!taRef.current) return;
    const el = taRef.current;
    el.style.height = "0px";
    const next = el.scrollHeight;
    el.style.height = Math.max(80, Math.min(next, 180)) + "px";
  }, [input]);

  // Cleanup object URLs on unmount
  useEffect(
    () => () => {
      pendingFiles.forEach((f) => {
        if (f.url.startsWith("blob:")) {
          URL.revokeObjectURL(f.url);
        }
      });
    },
    [pendingFiles]
  );

  function handleFileClick() {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const mapped: PendingFile[] = Array.from(files).map((file) => ({
      name: file.name,
      file,
      url: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...mapped]);
  }

  function removeFile(name: string) {
    setPendingFiles((prev) => {
      const keep: PendingFile[] = [];
      prev.forEach((f) => {
        if (f.name === name) {
          if (f.url.startsWith("blob:")) URL.revokeObjectURL(f.url);
        } else {
          keep.push(f);
        }
      });
      return keep;
    });
  }

  async function send() {
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;
    if (sending) return;

    const userContent =
      text || (pendingFiles.length ? "Attachments only (no typed question)." : "");
    setMessages((prev) => [...prev, { role: "user", content: userContent }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`/api/solace-news/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          mode,
          abrahamic: true,
          files: pendingFiles.map((f) => ({ name: f.name, url: f.url })),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I tried to reach the newsroom engine but something went wrong. You may want to try again in a moment.\n\n" +
              (errText || `Status: ${res.status}`),
          },
        ]);
        return;
      }

      const data = (await res.json()) as { reply?: string };
      const reply =
        data?.reply ||
        "I received your request, but the newsroom API did not return a response body. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      // If you want to clear attachments after each send, uncomment:
      // setPendingFiles([]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I wasn’t able to reach the newsroom engine (network error). Please check your connection or try again shortly.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  if (!mounted || !visible) return null;

  const root = typeof document !== "undefined" ? document.body : null;
  if (!root) return null;

  const modeLabel: Record<Mode, string> = {
    anchor: "Story",
    analyst: "Bias",
    coach: "Coach",
  };

  const placeholderByMode: Record<Mode, string> = {
    anchor: "Ask about this story, its context, or what you might be missing…",
    analyst: "Ask Solace to analyze framing, omissions, and bias in this story…",
    coach: "Ask how to interpret or respond to this story with wisdom…",
  };

  return createPortal(
    <>
      {/* Pill when collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid rgba(250, 204, 21, 0.6)",
            background:
              "radial-gradient(circle at 0% 0%, rgba(250,204,21,0.25), transparent 60%), rgba(12,10,24,0.96)",
            color: "#fefce8",
            fontSize: 13,
            fontWeight: 500,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 0% 0%, #facc15 0%, #f97316 35%, #22d3ee 85%)",
              boxShadow: "0 0 16px rgba(250,204,21,0.7)",
            }}
          />
          <span>Solace Newsroom</span>
        </button>
      )}

      {/* Full orb */}
      {!collapsed && (
        <div
          ref={orbRef}
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 60,
            width: 420,
            maxWidth: "100vw",
            maxHeight: "80vh",
            borderRadius: 24,
            border: "1px solid rgba(148,163,184,0.5)",
            background:
              "radial-gradient(circle at 0% 0%, rgba(250,204,21,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(56,189,248,0.07), transparent 60%), rgba(15,23,42,0.96)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid rgba(51,65,85,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "999px",
                  background:
                    "radial-gradient(circle at 0% 0%, #facc15 0%, #f97316 35%, #22d3ee 80%)",
                  boxShadow: "0 0 18px rgba(250,204,21,0.75)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Solace — Newsroom</span>
                <span
                  style={{
                    fontSize: 11,
                    opacity: 0.7,
                  }}
                >
                  Neutral News Anchor • Bias Analyst • Journalism Coach
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
              }}
            >
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: 999,
                  border: "1px solid rgba(190,242,100,0.7)",
                  background: "rgba(22,163,74,0.15)",
                  color: "#bbf7d0",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                Abrahamic ON
              </span>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background: "rgba(15,23,42,0.9)",
                  color: "#e5e7eb",
                  fontSize: 11,
                  padding: "3px 7px",
                  cursor: "pointer",
                }}
              >
                Hide
              </button>
            </div>
          </div>

          {/* Mode tabs */}
          <div
            style={{
              padding: "8px 12px 6px",
              borderBottom: "1px solid rgba(30,64,175,0.8)",
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {(["anchor", "analyst", "coach"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  style={{
                    padding: "4px 9px",
                    borderRadius: 999,
                    border:
                      mode === m
                        ? "1px solid rgba(191,219,254,0.9)"
                        : "1px solid rgba(148,163,184,0.5)",
                    background:
                      mode === m
                        ? "linear-gradient(to right, rgba(59,130,246,0.6), rgba(56,189,248,0.6))"
                        : "rgba(15,23,42,0.9)",
                    color: mode === m ? "#eff6ff" : "#e5e7eb",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {modeLabel[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript */}
          <div
            style={{
              flex: 1,
              padding: "10px 14px 6px",
              overflowY: "auto",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "100%",
                    padding: "6px 9px",
                    borderRadius:
                      m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background:
                      m.role === "user"
                        ? "rgba(30,64,175,0.85)"
                        : "rgba(15,23,42,0.95)",
                    border:
                      m.role === "user"
                        ? "1px solid rgba(129,140,248,0.9)"
                        : "1px solid rgba(51,65,85,0.9)",
                    color: "#e5e7eb",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {pendingFiles.length > 0 && (
              <div
                style={{
                  marginTop: 4,
                  paddingTop: 4,
                  borderTop: "1px dashed rgba(75,85,99,0.7)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {pendingFiles.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => removeFile(f.name)}
                    style={{
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 999,
                      border: "1px solid rgba(148,163,184,0.7)",
                      background: "rgba(15,23,42,0.9)",
                      color: "#e5e7eb",
                      cursor: "pointer",
                    }}
                  >
                      📎 {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div
            style={{
              padding: "8px 10px 10px",
              borderTop: "1px solid rgba(30,64,175,0.8)",
              background: "rgba(15,23,42,0.98)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={handleFileClick}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.8)",
                  background: "rgba(15,23,42,0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 15,
                }}
                title="Attach article or document"
              >
                📎
              </button>
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholderByMode[mode]}
                style={{
                  flex: 1,
                  resize: "none",
                  borderRadius: 14,
                  border: "1px solid rgba(55,65,81,0.9)",
                  background: "rgba(15,23,42,0.9)",
                  color: "#e5e7eb",
                  fontSize: 13,
                  padding: "8px 10px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={send}
                disabled={sending}
                style={{
                  minWidth: 70,
                  height: 32,
                  borderRadius: 999,
                  border: "none",
                  background: sending
                    ? "rgba(55,65,81,0.9)"
                    : "linear-gradient(to right, #22c55e, #bef264)",
                  color: sending ? "#9ca3af" : "#052e16",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: sending ? "default" : "pointer",
                }}
              >
                {sending ? "Thinking…" : "Send"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div
              style={{
                fontSize: 10,
                opacity: 0.65,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                Mode: {modeLabel[mode]} • Ledger digest • Abrahamic layer locked on
              </span>
            </div>
          </div>
        </div>
      )}
    </>,
    root
  );
}
