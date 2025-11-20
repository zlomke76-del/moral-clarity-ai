// app/components/SolaceDock.tsx — Final Stable Version (Orb + Mobile Pill, No Scroll Lock)
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { generateImage } from "@/lib/sendImage";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

const POS_KEY = "solace:pos:v3";
const ORB_POS_KEY = "solace:orb-pos";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

const ui = {
  panelBg:
    "radial-gradient(140% 160% at 50% -60%, rgba(26,35,53,.85) 0%, rgba(14,21,34,.88) 60%)",
  border: "1px solid var(--mc-border)",
  edge: "1px solid rgba(255,255,255,.06)",
  text: "var(--mc-text)",
  sub: "var(--mc-muted)",
  surface2: "rgba(12,19,30,.85)",
  glowOn:
    "0 0 0 1px rgba(251,191,36,.25) inset, 0 0 90px rgba(251,191,36,.14), 0 22px 70px rgba(0,0,0,.55)",
  shadow: "0 14px 44px rgba(0,0,0,.45)",
};

export default function SolaceDock() {
  // mount guard
  const [canRender, setCanRender] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;
    window.__solaceDockMounted = true;
    setCanRender(true);
    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  const { visible, x, y, setPos, filters, setFilters } = useSolaceStore();

  // state
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ready when you are." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");
  const [imgLoading, setImgLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);
  const [posReady, setPosReady] = useState(false);

  // orb minimize
  const [minimized, setMinimized] = useState(false);
  const [orbPos, setOrbPos] = useState({ ox: 40, oy: 40 });
  const [dragOrb, setDragOrb] = useState(false);
  const orbOffset = useRef({ dx: 0, dy: 0 });

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const recogRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // memory
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  // attachments
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: (c) =>
      setMessages((m) => [...m, { role: "assistant", content: c }]),
  });

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // scroll transcript
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // measure
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelW(r.width);
      setPanelH(r.height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // mobile detection
  useEffect(() => {
    if (!canRender) return;
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [canRender]);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // restore panel position
  useEffect(() => {
    if (!canRender || !visible) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isMobile) {
      setPosReady(true);
      return;
    }

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setPos(
          Math.max(PAD, Math.min(vw - PAD - 400, s.x)),
          Math.max(PAD, Math.min(vh - PAD - 300, s.y))
        );
        setPosReady(true);
        return;
      }
    } catch {}

    setPos(
      Math.round((vw - 720) / 2),
      Math.round((vh - 520) / 2)
    );
    setPosReady(true);
  }, [canRender, visible, isMobile, setPos]);

  // persist panel pos
  useEffect(() => {
    if (isMobile || !posReady) return;
    localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
  }, [x, y, posReady, isMobile]);

  // restore orb pos
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORB_POS_KEY);
      if (raw) setOrbPos(JSON.parse(raw));
    } catch {}
  }, []);

  // persist orb pos
  useEffect(() => {
    localStorage.setItem(ORB_POS_KEY, JSON.stringify(orbPos));
  }, [orbPos]);

  // autoresize input
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // default ministry
  useEffect(() => {
    try {
      if (localStorage.getItem(MINISTRY_KEY) === "0") return;
    } catch {}
    const next = new Set(filters);
    next.add("abrahamic");
    next.add("ministry");
    setFilters(next);
    localStorage.setItem(MINISTRY_KEY, "1");
  }, []);

  // dragging panel
  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left ?? 0),
      dy: e.clientY - (rect?.top ?? 0),
    });
    setDragging(true);
  };
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) =>
      setPos(e.clientX - offset.dx, e.clientY - offset.dy);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset, setPos]);

  // dragging orb
  const startDragOrb = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    orbOffset.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };
    setDragOrb(true);
  };
  useEffect(() => {
    if (!dragOrb) return;
    const onMove = (e: MouseEvent) =>
      setOrbPos({
        ox: e.clientX - orbOffset.current.dx,
        oy: e.clientY - orbOffset.current.dy,
      });
    const onUp = () => setDragOrb(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragOrb]);

  // send msg
  async function send() {
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;
    if (streaming) return;

    setInput("");
    const nextUser: Message = {
      role: "user",
      content: text || "Attachments:",
    };
    const nextMsgs = [...messages, nextUser];
    setMessages(nextMsgs);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Last-Mode": modeHint,
          "X-User-Key": userKey,
        },
        body: JSON.stringify({
          messages: nextMsgs,
          filters: Array.from(filters),
          stream: false,
          attachments: pendingFiles,
          ministry: filters.has("ministry"),
          workspace_id: MCA_WORKSPACE_ID,
          user_key: userKey,
          memory_preview: memReady ? memoryCacheRef.current.slice(0, 50) : [],
        }),
      });

      clearPending();

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.text || "[No reply]" },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e.message ?? "Error"}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  // generate image
  async function generateImageFromInput() {
    const text = input.trim();
    if (!text || imgLoading) return;

    setImgLoading(true);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);

    try {
      const url = await generateImage(text);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `🎨 Generated image:\n${url}` },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e.message}` },
      ]);
    } finally {
      setImgLoading(false);
    }
  }

  // toggle ministry
  function toggleMinistry() {
    if (ministryOn) {
      const next = Array.from(filters).filter(
        (f) => f !== "abrahamic" && f !== "ministry"
      );
      setFilters(next);
      localStorage.setItem(MINISTRY_KEY, "0");
    } else {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
      localStorage.setItem(MINISTRY_KEY, "1");
    }
  }

  // mic
  function toggleMic() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "🎤 Mic unsupported." },
      ]);
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const sr = new SR();
    sr.lang = "en-US";
    sr.interimResults = false;
    sr.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      setInput((p) => (p ? p + " " + t : t));
    };
    sr.onend = () => setListening(false);
    sr.onerror = () => setListening(false);
    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  if (!canRender || !visible) return null;

  // clamp panel inside screen
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tx = Math.max(0, Math.min(x, vw - panelW - PAD));
  const ty = Math.max(0, Math.min(y, vh - panelH - PAD));
  const invisible = !posReady;

  // PANEL STYLE
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "70vh",
        background: ui.panelBg,
        borderRadius: "20px 20px 0 0",
        border: ui.border,
        display: minimized ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 80,
      }
    : {
        position: "fixed",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        width: "clamp(560px, 56vw, 980px)",
        height: "clamp(460px, 62vh, 820px)",
        background: ui.panelBg,
        borderRadius: 20,
        border: ui.border,
        overflow: "hidden",
        display: minimized ? "none" : "flex",
        flexDirection: "column",
        zIndex: 80,
      };

  // ORB
  if (minimized && !isMobile) {
    const orb = (
      <div
        style={{
          position: "fixed",
          left: orbPos.ox,
          top: orbPos.oy,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #fbbf24, #b45309)",
          boxShadow: "0 0 18px rgba(251,191,36,.7)",
          cursor: dragOrb ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
        onMouseDown={startDragOrb}
        onDoubleClick={() => setMinimized(false)}
        title="Double-click to open Solace"
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "#111" }}>
          SOLACE
        </span>
      </div>
    );
    return createPortal(orb, document.body);
  }

  // MOBILE PILL
  if (isMobile && collapsed) {
    const pill = (
      <button
        onClick={() => setCollapsed(false)}
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          bottom: 20,
          background: "#0b111aee",
          borderRadius: 999,
          border: ui.border,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 60,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #fbbf24, #b45309)",
            }}
          />
          <span style={{ color: ui.text, fontWeight: 600 }}>Solace</span>
        </span>
        <span style={{ color: ui.sub, fontSize: 12 }}>Tap to open</span>
      </button>
    );
    return createPortal(pill, document.body);
  }

  // HEADER
  const header = (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderBottom: ui.edge,
        cursor: isMobile ? "default" : "move",
        userSelect: "none",
      }}
      onMouseDown={onHeaderMouseDown}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #fbbf24, #b45309)",
          flexShrink: 0,
        }}
        title="Drag Solace window"
      />

      <span style={{ fontWeight: 600, color: ui.text }}>Solace</span>
      <span style={{ fontSize: 12, color: ui.sub }}>
        Create with moral clarity
      </span>

      <span
        title={memReady ? "Memory ready" : "Loading memory…"}
        style={{
          marginLeft: 8,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: memReady ? "#10b981" : "#f59e0b",
        }}
      />

      <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
        {["Create", "Next Steps", "Red Team"].map((k) => (
          <button
            key={k}
            onClick={() => setModeHint(k as ModeHint)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background:
                modeHint === k ? "var(--mc-text)" : "rgba(14,23,38,.9)",
              color: modeHint === k ? "#0b0f16" : ui.text,
              fontSize: 12,
              fontWeight: 600,
              border: ui.edge,
            }}
          >
            {k}
          </button>
        ))}
      </div>

      <button
        onClick={toggleMinistry}
        style={{
          marginLeft: "auto",
          padding: "6px 10px",
          borderRadius: 8,
          background: ministryOn ? "#f6c453" : "#0e1726",
          border: ministryOn ? "1px solid #f4cf72" : ui.edge,
          color: ministryOn ? "#000" : ui.text,
          boxShadow: ministryOn ? "0 0 12px #fbbf2499" : "none",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        Ministry
      </button>

      <button
        onClick={() => setMinimized(true)}
        title="Minimize"
        style={{
          marginLeft: 8,
          padding: "4px 8px",
          borderRadius: 8,
          background: "#0e1726",
          color: ui.sub,
          border: ui.edge,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        —
      </button>
    </header>
  );

  // TRANSCRIPT
  const transcript = (
    <div
      ref={transcriptRef}
      style={{
        flex: 1,
        overflow: "auto",
        padding: "12px 14px",
        background:
          "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
      }}
    >
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            marginBottom: 8,
            padding: "10px 12px",
            borderRadius: 12,
            background:
              m.role === "user"
                ? "rgba(39,52,74,.6)"
                : "rgba(28,38,54,.6)",
            color: ui.text,
            whiteSpace: "pre-wrap",
          }}
        >
          {m.content}
        </div>
      ))}
    </div>
  );

  // COMPOSER
  const composer = (
    <div
      style={{
        borderTop: ui.edge,
        background: ui.surface2,
        padding: 10,
      }}
      onPaste={(e) => handlePaste(e, { prefix: "solace" })}
    >
      {pendingFiles.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 8,
            fontSize: 12,
            color: ui.text,
          }}
        >
          {pendingFiles.map((f, i) => (
            <a
              key={i}
              href={f.url}
              target="_blank"
              style={{
                padding: "4px 8px",
                borderRadius: 8,
                border: ui.edge,
                background: "#0e1726",
                textDecoration: "none",
              }}
            >
              📎 {f.name}
            </a>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() =>
              document.getElementById("solace-file-input")?.click()
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: ui.edge,
              background: "#0e1726",
              color: ui.text,
            }}
          >
            📎
          </button>
          <input
            id="solace-file-input"
            type="file"
            multiple
            onChange={(e) =>
              handleFiles(e.target.files, { prefix: "solace" })
            }
            style={{ display: "none" }}
          />

          <button
            onClick={toggleMic}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: ui.edge,
              background: listening ? "#244a1f" : "#0e1726",
              color: ui.text,
            }}
          >
            {listening ? "■" : "🎤"}
          </button>
        </div>

        <textarea
          ref={taRef}
          value={input}
          placeholder="Speak or type…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          style={{
            flex: 1,
            minHeight: 60,
            maxHeight: 200,
            borderRadius: 12,
            border: "1px solid var(--mc-border)",
            background: "#0e1726",
            color: ui.text,
            padding: "10px 12px",
            resize: "none",
            outline: "none",
          }}
        />

        <button
          onClick={generateImageFromInput}
          disabled={imgLoading || !input.trim()}
          style={{
            minWidth: 70,
            height: 40,
            borderRadius: 12,
            background: "#374151",
            color: "#e5e7eb",
            opacity: imgLoading || !input.trim() ? 0.5 : 1,
            border: 0,
          }}
        >
          {imgLoading ? "…" : "Image"}
        </button>

        <button
          onClick={send}
          disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
          style={{
            minWidth: 70,
            height: 40,
            borderRadius: 12,
            background: "#6e8aff",
            color: "#fff",
            opacity:
              streaming ||
              (!input.trim() && pendingFiles.length === 0)
                ? 0.5
                : 1,
            border: 0,
          }}
        >
          {streaming ? "…" : "Ask"}
        </button>
      </div>
    </div>
  );

  // FULL PANEL
  const panel = (
    <section ref={containerRef} style={panelStyle}>
      {header}
      {transcript}
      {composer}
    </section>
  );

  return createPortal(panel, document.body);
}

/* ========= end component ========= */

