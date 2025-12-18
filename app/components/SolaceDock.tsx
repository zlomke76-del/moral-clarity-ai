"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";

import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useDockStyles } from "./useDockStyles";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import { useSpeechInput } from "./useSpeechInput";
import { IconPaperclip, IconMic } from "@/app/components/icons";
import { sendWithVision } from "./sendWithVision";
import SolaceTranscript from "./SolaceTranscript";
import { UI } from "./dock-ui";
import { useDockPosition } from "./useDockPosition";
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

// --------------------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------------------
type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

type EvidenceBlock = {
  id?: string;
  source?: string;
  summary?: string;
  text?: string;
};

type PendingFile = {
  name: string;
  mime: string;
  url: string;
  size?: number;
};

// --------------------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

// --------------------------------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------------------------------
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).__solaceDockMounted) return;

    (window as any).__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      (window as any).__solaceDockMounted = false;
    };
  }, []);

  const conversationIdRef = useRef<string | null>(null);
  if (!conversationIdRef.current) {
    conversationIdRef.current = crypto.randomUUID();
  }
  const conversationId = conversationIdRef.current;

  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral" as const;

  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = viewport.w > 0 ? viewport.w <= 768 : false;

  useEffect(() => {
    if (canRender && !isMobile && !visible) setVisible(true);
  }, [canRender, isMobile, visible, setVisible]);

  const [minimized, setMinimized] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo(0, transcriptRef.current.scrollHeight);
  }, [messages]);

  const { userKey, memReady } = useSolaceMemory();

  const { pendingFiles, handleFiles, handlePaste, clearPending } =
    useSolaceAttachments({
      onInfoMessage: (msg) =>
        setMessages((m) => [...m, { role: "assistant", content: msg }]),
    });

  const { listening, toggleMic } = useSpeechInput({
    onText: (text) => setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  useEffect(() => {
    try {
      if (localStorage.getItem(MINISTRY_KEY) === "1") {
        const next = new Set(filters);
        next.add("abrahamic");
        next.add("ministry");
        setFilters(next);
      }
    } catch {}
  }, [setFilters]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // --------------------------------------------------------------------
  // Payload ingestion (AUTHORITATIVE — FIXED)
  // --------------------------------------------------------------------
  function ingestPayload(data: any) {
    if (!data) throw new Error("Empty response payload");

    // ✅ FIRST: multi-message (this includes image responses)
    if (Array.isArray(data.messages)) {
      const normalized = data.messages.map((msg: any) => ({
        role: msg.role,
        content: (msg.content ?? "") as string,
        imageUrl: (msg.imageUrl ?? null) as string | null,
      }));
      setMessages((m) => [...m, ...normalized]);
      return;
    }

    // IMAGE: OpenAI raw base64
    if (
      Array.isArray(data.data) &&
      data.data[0] &&
      typeof data.data[0].b64_json === "string"
    ) {
      const base64 = data.data[0].b64_json;
      const imageUrl = `data:image/png;base64,${base64}`;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: " ", imageUrl },
      ]);
      return;
    }

    // IMAGE: single imageUrl
    const image =
      typeof data.imageUrl === "string"
        ? data.imageUrl
        : typeof data.image === "string"
        ? data.image
        : null;

    if (image) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: " ", imageUrl: image },
      ]);
      return;
    }

    // TEXT response
    if (data.ok === true && typeof data.response === "string") {
      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
      return;
    }

    // Evidence blocks
    if (Array.isArray(data.evidence)) {
      const evMsgs: Message[] = data.evidence.map((e: EvidenceBlock) => ({
        role: "assistant",
        content:
          `🧾 Evidence` +
          (e.source ? ` (${e.source})` : "") +
          `\n\n${e.summary || e.text || "[no content]"}`,
      }));
      setMessages((m) => [...m, ...evMsgs]);
      return;
    }

    throw new Error("Unrecognized response payload");
  }

  // (rest of file unchanged)


  // ====================================================================
  // SEND (VISION-AWARE) — TURBOPACK SAFE + IMAGE INTENT GATE
  // ====================================================================
  async function send(): Promise<void> {
    if (!input.trim() && pendingFiles.length === 0) return;
    if (streaming) return;

    const userMsg = input.trim() || "Attachments:";
    setInput("");
    setStreaming(true);

    setMessages((m) => [...m, { role: "user", content: userMsg }]);

    try {
      // ------------------------------------------------------------
      // FIX 2: IMAGE GENERATION MUST BYPASS sendWithVision()
      // ------------------------------------------------------------
      if (isImageIntent(userMsg)) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg,
            canonicalUserKey: userKey || undefined,
            workspaceId: MCA_WORKSPACE_ID,
            conversationId,
            ministryMode: ministryOn,
            modeHint,
          }),
        });

        const payload = await res.json();
        ingestPayload(payload);
        return;
      }

      // ------------------------------------------------------------
      // Normal path: vision analysis + chat
      // ------------------------------------------------------------
      const result = await sendWithVision({
        userMsg,
        pendingFiles,
        userKey,
        workspaceId: MCA_WORKSPACE_ID,
        conversationId,
        ministryOn,
        modeHint,
      });

      const visionResults = result?.visionResults;
      const chatPayload = result?.chatPayload;

      // Vision results (analysis bubbles)
      if (Array.isArray(visionResults) && visionResults.length > 0) {
        for (const v of visionResults) {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content: v?.answer ?? "",
              imageUrl: v?.imageUrl ?? null,
            },
          ]);
        }
      }

      // Chat payload (text/image/mixed)
      if (chatPayload) {
        ingestPayload(chatPayload);
      }

      // Safety net: never silent
      if ((!visionResults || visionResults.length === 0) && !chatPayload) {
        setMessages((m) => [...m, { role: "assistant", content: " " }]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      setMessages((m) => [...m, { role: "assistant", content: `⚠ ${message}` }]);
    } finally {
      setStreaming(false);
      clearPending();
    }
  }

  // --------------------------------------------------------------------
  // Enter-to-send handler
  // --------------------------------------------------------------------
  const onEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // --------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------
  const panel = (
    <section ref={containerRef} style={panelStyle}>
      <SolaceDockHeaderLite
        ministryOn={ministryOn}
        memReady={memReady}
        onToggleMinistry={() => {
          const next = new Set(filters);
          if (ministryOn) {
            next.delete("abrahamic");
            next.delete("ministry");
            try {
              localStorage.setItem(MINISTRY_KEY, "0");
            } catch {}
          } else {
            next.add("abrahamic");
            next.add("ministry");
            try {
              localStorage.setItem(MINISTRY_KEY, "1");
            } catch {}
          }
          setFilters(next);
        }}
        onMinimize={() => setMinimized(true)}
        onDragStart={onHeaderMouseDown}
      />

      {/* ---------------- Transcript ---------------- */}
      <SolaceTranscript
        messages={messages}
        transcriptRef={transcriptRef}
        transcriptStyle={transcriptStyle}
      />

      {/* ---------------- Composer ---------------- */}
      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        {pendingFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              paddingBottom: 8,
              overflowX: "auto",
            }}
          >
            {pendingFiles.map((f: PendingFile, i: number) => (
              <div
                key={i}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  border: UI.border,
                  background: UI.surface2,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={f.name}
              >
                {f.mime.startsWith("image/") ? (
                  <img
                    src={f.url}
                    alt={f.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 18 }}>
                    <IconPaperclip />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: UI.surface2,
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label="Attach files"
          >
            <IconPaperclip />
            <input
              type="file"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
            />
          </label>

          <button
            onClick={toggleMic}
            style={{
              width: 38,
              height: 38,
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: listening ? "rgba(255,0,0,.45)" : UI.surface2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-pressed={listening}
            aria-label={listening ? "Stop recording" : "Start recording"}
            type="button"
          >
            <IconMic />
          </button>

          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterSend}
            placeholder="Ask Solace..."
            aria-label="Message input"
            rows={1}
            spellCheck={false}
          />

          <button
            onClick={send}
            disabled={streaming}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: UI.radiusMd,
              background: "#fbbf24",
              border: "none",
              fontWeight: 600,
              cursor: streaming ? "not-allowed" : "pointer",
            }}
            type="button"
            aria-disabled={streaming}
          >
            Ask
          </button>
        </div>
      </div>

      <ResizeHandle onResizeStart={startResize} />
    </section>
  );

  return createPortal(panel, document.body);
}
