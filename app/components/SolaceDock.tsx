// app/components/SolaceDock.tsx
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

// Newsroom “top rail” roles inside the orb
type NewsTab = "story" | "bias" | "coach";

// Mood strip for routing / context (feeds X-Last-Mode and internal tone)
type ModeHint = "Neutral" | "Guidance" | "Ministry";

const POS_KEY = "solace:pos:v3";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

const ui = {
  panelBg:
    "radial-gradient(140% 160% at 50% -60%, rgba(26,35,53,0.92) 0%, rgba(10,16,28,0.96) 60%)",
  border: "1px solid var(--mc-border)",
  edge: "1px solid rgba(255,255,255,.06)",
  text: "var(--mc-text)",
  sub: "var(--mc-muted)",
  surface2: "rgba(12,19,30,.9)",
  glowOn:
    "0 0 0 1px rgba(251,191,36,.25) inset, 0 0 90px rgba(251,191,36,.16), 0 22px 70px rgba(0,0,0,.55)",
  shadow: "0 14px 44px rgba(0,0,0,.45)",
};

export default function SolaceDock() {
  // Ensure single mount
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

  // --- layout / positioning state -------------------------------------
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);
  const [panelH, setPanelH] = useState(0);
  const [panelW, setPanelW] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // orb minimized, all viewports

  // --- newsroom / chat state ------------------------------------------
  const [newsTab, setNewsTab] = useState<NewsTab>("story");
  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  // Story tab: last loaded digest snippet
  const [storySnippet, setStorySnippet] = useState<string | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);

  // Coach tab secondary action (rewrite)
  const [secondaryLoading, setSecondaryLoading] = useState(false);

  // image generation (still available on non-coach tabs)
  const [imgLoading, setImgLoading] = useState(false);

  // speech
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  // transcript auto-scroll
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, storySnippet]);

  // MEMORY hook
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();
  const appendInfo = (content: string) => {
    setMessages((m) => [...m, { role: "assistant", content }]);
  };

  // ATTACHMENTS hook
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: appendInfo,
  });

  // Abrahamic layer: always ON for newsroom (non-negotiable)
  const ministryOn = useMemo(() => true, []);

  // At mount, force-add ministry/abrahamic filters and persist
  useEffect(() => {
    const next = new Set(filters);
    next.add("abrahamic");
    next.add("ministry");
    setFilters(next);
    try {
      localStorage.setItem(MINISTRY_KEY, "1");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // seed welcome once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Welcome to the Solace Newsroom orb. Choose Story, Bias, or Coach above to begin.",
        },
      ]);
    }
  }, [messages.length]);

  // measure / clamp container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelH(r.height || 0);
      setPanelW(r.width || 0);
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

  // basic viewport breakpoint
  useEffect(() => {
    if (!canRender) return;
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [canRender]);

  // initial mobile: start collapsed so it doesn’t block UI
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  // restore position or center (desktop only – when not collapsed)
  useEffect(() => {
    if (!canRender || !visible || collapsed) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // On mobile, we ignore positioning – anchored bottom sheet
    if (vw <= 768) {
      setPosReady(true);
      return;
    }

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { x: number; y: number } | null;
        if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          const sx = Math.max(PAD, Math.min(vw - PAD, saved.x));
          const sy = Math.max(PAD, Math.min(vh - PAD, saved.y));
          setPos(sx, sy);
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const w = panelW || Math.min(980, Math.max(560, Math.round(vw * 0.56)));
      const h = panelH || Math.min(820, Math.max(460, Math.round(vh * 0.62)));
      const startX = Math.max(PAD, Math.round((vw - w) / 2));
      const startY = Math.max(PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [canRender, visible, collapsed, panelW, panelH, setPos]);

  // persist position (desktop only)
  useEffect(() => {
    if (!posReady || isMobile || collapsed) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile, collapsed]);

  // dragging (desktop only)
  function onHeaderMouseDown(e: React.MouseEvent) {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left ?? 0),
      dy: e.clientY - (rect?.top ?? 0),
    });
    setDragging(true);
  }

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

  // autoresize textarea
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // mic control
  function toggleMic() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      appendInfo("🎤 Microphone is not supported in this browser.");
      return;
    }
    if (listening) {
      try {
        recogRef.current?.stop();
      } catch {}
      setListening(false);
      return;
    }
    const sr = new SR();
    sr.lang = "en-US";
    sr.interimResults = false;
    sr.maxAlternatives = 1;
    sr.onresult = (e: any) => {
      const t = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setInput((prev) => (prev ? prev + " " : "") + t);
    };
    sr.onend = () => setListening(false);
    sr.onerror = () => setListening(false);
    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  if (!canRender || !visible) return null;

  // clamp within viewport (desktop)
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);
  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);
  const invisible = !posReady && !isMobile;

  const borderColor =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(
          "--mc-border"
        ) || "rgba(34,48,71,.9)"
      : "rgba(34,48,71,.9)";

  // ---------- styles --------------------------------------------------
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        top: "auto",
        width: "100%",
        maxWidth: "100%",
        height: "70vh",
        maxHeight: "80vh",
        background: ui.panelBg,
        borderRadius: "20px 20px 0 0",
        border: ui.border,
        boxShadow: ui.glowOn,
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: invisible ? "none" : "auto",
        opacity: invisible ? 0 : 1,
        transition: "opacity 120ms ease",
        zIndex: 60,
      }
    : {
        position: "fixed",
        left: PAD,
        top: PAD,
        width: "clamp(560px, 56vw, 980px)",
        height: "clamp(460px, 62vh, 820px)",
        maxHeight: "90vh",
        background: ui.panelBg,
        borderRadius: 24,
        border: ui.border,
        boxShadow: ui.glowOn,
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: invisible ? "none" : "auto",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        opacity: invisible ? 0 : 1,
        transition: "opacity 120ms ease",
        resize: "both",
        zIndex: 60,
      };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderBottom: ui.edge,
    cursor: isMobile ? "default" : "move",
    userSelect: "none",
    background:
      "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.00))",
    color: ui.text,
  };

  const baseTranscriptBg =
    "linear-gradient(180deg, rgba(12,19,30,.94), rgba(7,13,24,.98))";

  const biasHeatmapBg =
    "radial-gradient(130% 160% at 0% 0%, rgba(248,113,113,0.22) 0%, rgba(15,23,42,0.96) 42%, rgba(56,189,248,0.23) 100%)";

  const transcriptStyle: React.CSSProperties = {
    flex: "1 1 auto",
    overflow: "auto",
    padding: "14px 16px 10px 16px",
    color: ui.text,
    background: newsTab === "bias" ? biasHeatmapBg : baseTranscriptBg,
  };

  const composerWrapStyle: React.CSSProperties = {
    borderTop: ui.edge,
    background: ui.surface2,
    padding: 10,
  };

  const fieldStyle: React.CSSProperties = {
    flex: "1 1 auto",
    minHeight: 60,
    maxHeight: 240,
    overflow: "auto",
    border: `1px solid ${borderColor}`,
    background: "#0b1220",
    color: ui.text,
    borderRadius: 12,
    padding: "10px 12px",
    font:
      "14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    resize: "none",
    outline: "none",
  };

  const primaryBtnStyle: React.CSSProperties = {
    minWidth: 90,
    height: 40,
    borderRadius: 12,
    border: "0",
    background: "#6e8aff",
    color: "#fff",
    font:
      "600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    cursor:
      streaming || (!input.trim() && pendingFiles.length === 0)
        ? "not-allowed"
        : "pointer",
    opacity:
      streaming || (!input.trim() && pendingFiles.length === 0) ? 0.55 : 1,
  };

  const secondaryBtnStyle: React.CSSProperties = {
    minWidth: 90,
    height: 40,
    borderRadius: 12,
    border: "0",
    background: "#374151",
    color: "#e5e7eb",
    font:
      "600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    cursor: secondaryLoading || !input.trim() ? "not-allowed" : "pointer",
    opacity: secondaryLoading || !input.trim() ? 0.55 : 1,
  };

  const orbStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    borderRadius: "30%",
    background:
      "radial-gradient(65% 65% at 50% 40%, rgba(251,191,36,1) 0%, rgba(251,191,36,.75) 38%, rgba(251,191,36,.2) 74%, rgba(251,191,36,.10) 100%)",
    boxShadow: "0 0 40px rgba(251,191,36,.65)",
    flex: "0 0 24px",
  };

  const chip = (
    label: string,
    active: boolean,
    onClick: () => void,
    opts?: { pill?: boolean }
  ) => (
    <button
      onClick={onClick}
      style={{
        borderRadius: opts?.pill ? 999 : 8,
        padding: "6px 10px",
        font:
          "600 11px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        letterSpacing: 0.03,
        color: active ? "#020617" : "var(--mc-text)",
        background: active ? "#e5e7eb" : "#020617",
        border: `1px solid var(--mc-border)`,
        cursor: "pointer",
        opacity: active ? 1 : 0.9,
      }}
      type="button"
    >
      {label}
    </button>
  );

  // ---------- minimized “orb” state -----------------------------------
  if (collapsed) {
    const pillStyle: React.CSSProperties = isMobile
      ? {
          position: "fixed",
          left: 16,
          right: 16,
          bottom: 20,
          padding: "10px 14px",
          borderRadius: 9999,
          border: ui.border,
          background: "rgba(6,12,20,0.96)",
          color: ui.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: ui.shadow,
          backdropFilter: "blur(10px)",
          zIndex: 60,
        }
      : {
          position: "fixed",
          right: 20,
          bottom: 20,
          padding: "9px 14px",
          borderRadius: 9999,
          border: ui.border,
          background: "rgba(6,12,20,0.96)",
          color: ui.text,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: ui.shadow,
          backdropFilter: "blur(10px)",
          zIndex: 60,
        };

    return createPortal(
      <button
        type="button"
        style={pillStyle}
        onClick={() => setCollapsed(false)}
        aria-label="Open Solace Newsroom"
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden style={orbStyle} />
          <span
            style={{
              font: "600 12px system-ui",
              whiteSpace: "nowrap",
            }}
          >
            Solace Newsroom
          </span>
        </span>
        <span
          style={{
            font: "11px system-ui",
            color: ui.sub,
            display: isMobile ? "block" : "none",
          }}
        >
          Tap to open
        </span>
      </button>,
      document.body
    );
  }

  // ---------- actions: Story / Bias / Coach / Chat --------------------

  async function loadStory() {
    setStoryLoading(true);
    try {
      const res = await fetch("/api/solace-news/chat", {
        method: "POST",
        body: JSON.stringify({
          role: "anchor",
          action: "load-digest",
        }),
      });
      const data = await res.json().catch(() => ({}));
      const digest: string =
        typeof data.digest === "string"
          ? data.digest
          : typeof data.text === "string"
          ? data.text
          : "(no digest returned)";
      setStorySnippet(digest);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Here is a neutral snapshot for one current story:\n\n" +
            digest,
        },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ Failed to load story: ${e?.message ?? "Unknown error"}`,
        },
      ]);
    } finally {
      setStoryLoading(false);
    }
  }

  async function send() {
    const text = input.trim();
    const hasAttachments = pendingFiles.length > 0;

    if (!text && !hasAttachments) return;
    if (streaming) return;

    setInput("");

    const label =
      text || (hasAttachments ? "Attached article / files for review." : "");
    const userMsg: Message = { role: "user", content: label };
    const nextMsgs: Message[] = [...messages, userMsg];
    setMessages(nextMsgs);
    setStreaming(true);

    try {
      let reply = "";

      if (newsTab === "story") {
        // Neutral anchor Q&A over the ledger-locked digest
        const res = await fetch("/api/solace-news/chat", {
          method: "POST",
          body: JSON.stringify({
            role: "anchor",
            question: text,
          }),
        });
        const data = await res.json().catch(() => ({}));
        reply =
          typeof data.text === "string"
            ? data.text
            : "[No response from Solace news anchor]";
      } else if (newsTab === "bias") {
        // Outlet bias analysis – treat input as outlet/domain or question
        const res = await fetch("/api/solace-news/analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain: text,
          }),
        });
        const data = await res.json().catch(() => ({}));
        const biasText: string = data.bias_text || "";
        const scores = data.bias_scores || data.outlet_metrics || null;

        reply =
          (biasText ? biasText + "\n\n" : "") +
          (scores
            ? "Raw scores / metrics:\n" +
              JSON.stringify(scores, null, 2)
            : "");
        if (!reply.trim()) {
          reply = "No bias report was available for that outlet/domain.";
        }
      } else if (newsTab === "coach") {
        // Journalism coach – critique path (primary button)
        const body: any = {
          mode: "critique",
          text,
        };
        if (hasAttachments) body.attachments = pendingFiles;
        const res = await fetch("/api/solace-news/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        reply =
          data.critique ||
          data.text ||
          "No critique was returned for this draft.";
      } else {
        // Fallback: legacy general chat through /api/chat
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
            ministry: true,
            workspace_id: MCA_WORKSPACE_ID,
            user_key: userKey,
            memory_preview: memReady ? memoryCacheRef.current.slice(0, 50) : [],
          }),
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${t}`);
        }
        const data = await res.json();
        reply = String(data.text ?? "[No reply]");
      }

      clearPending();
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ ${e?.message ?? "Error"}`,
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  // Secondary action:
  // - Non-coach tabs: image generation
  // - Coach tab: neutral rewrite of the article
  async function handleSecondaryAction() {
    const text = input.trim();
    if (!text) return;
    if (secondaryLoading) return;

    if (newsTab === "coach") {
      // Neutral rewrite + certification-style output
      setSecondaryLoading(true);
      setInput("");

      setMessages((m) => [
        ...m,
        { role: "user", content: "Please rewrite this as a neutral article." },
      ]);

      try {
        const res = await fetch("/api/solace-news/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "rewrite",
            text,
          }),
        });
        const data = await res.json().catch(() => ({}));
        const rewrite: string =
          data.rewrite ||
          data.text ||
          "No neutral rewrite was returned for this draft.";
        setMessages((m) => [
          ...m,
          { role: "assistant", content: rewrite },
        ]);
      } catch (e: any) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `⚠️ Rewrite error: ${
              e?.message ?? "Unable to rewrite article."
            }`,
          },
        ]);
      } finally {
        setSecondaryLoading(false);
      }
      return;
    }

    // Default: image generation (legacy creative lens)
    if (imgLoading) return;
    setImgLoading(true);
    setInput("");

    setMessages((m) => [...m, { role: "user", content: text }]);
    try {
      const url = await generateImage(text);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `🎨 Generated image for you:\n${url}`,
        },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ Image error: ${
            e?.message ?? "Image generation failed."
          }`,
        },
      ]);
    } finally {
      setImgLoading(false);
    }
  }

  // ---------- main panel ----------------------------------------------
  const panel = (
    <section
      ref={containerRef}
      role="dialog"
      aria-label="Solace Newsroom"
      style={panelStyle}
      onClick={(e) => {
        if (!containerRef.current || isMobile) return;
        if ((e as any).altKey) {
          const vw2 = window.innerWidth;
          const vh2 = window.innerHeight;
          const w = panelW || 760;
          const h = panelH || 560;
          const startX = Math.max(PAD, Math.round((vw2 - w) / 2));
          const startY = Math.max(PAD, Math.round((vh2 - h) / 2));
          setPos(startX, startY);
          try {
            localStorage.removeItem(POS_KEY);
          } catch {}
        }
      }}
    >
      {/* HEADER */}
      <header style={headerStyle} onMouseDown={onHeaderMouseDown}>
        {/* Left: orb + title + anchor presence */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={orbStyle}
            title="Solace Newsroom Orb (Alt+Click header to re-center)"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                font: "600 13px system-ui",
                color: ui.text,
                letterSpacing: 0.02,
              }}
            >
              Solace Newsroom
            </span>
            <span
              style={{
                font: "11px system-ui",
                color: ui.sub,
              }}
            >
              Neutral News Anchor • Bias Analyst • Journalism Coach
            </span>
          </div>
          {/* Tiny “anchor is live” light */}
          <span
            title="Anchor layer active (ledger-locked news)"
            style={{
              marginLeft: 6,
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#facc15",
              boxShadow: "0 0 12px rgba(250,204,21,0.85)",
            }}
          />
        </div>

        {/* Center: newsroom tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginLeft: 18,
            alignItems: "center",
          }}
        >
          {chip("Story", newsTab === "story", () => setNewsTab("story"))}
          {chip("Bias", newsTab === "bias", () => setNewsTab("bias"))}
          {chip("Coach", newsTab === "coach", () => setNewsTab("coach"))}
        </div>

        {/* Right: mood strip + collapsed button */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Mood: Neutral / Guidance / Ministry */}
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: "0 4px",
              borderRadius: 999,
              border: ui.edge,
              background: "rgba(6,11,20,0.9)",
            }}
          >
            {chip(
              "Neutral",
              modeHint === "Neutral",
              () => setModeHint("Neutral"),
              { pill: true }
            )}
            {chip(
              "Guidance",
              modeHint === "Guidance",
              () => setModeHint("Guidance"),
              { pill: true }
            )}
            {chip(
              "Ministry",
              modeHint === "Ministry",
              () => setModeHint("Ministry"),
              { pill: true }
            )}
          </div>

          {/* Abrahamic indicator (locked on) */}
          <span
            title="Abrahamic layer: always on for newsroom"
            style={{
              font: "600 11px system-ui",
              color: "#facc15",
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid rgba(250,204,21,0.55)",
              background:
                "radial-gradient(circle at 0% 0%, rgba(250,204,21,0.33), rgba(6,10,19,0.96))",
              boxShadow: "0 0 14px rgba(250,204,21,0.35)",
            }}
          >
            Abrahamic ON
          </span>

          {/* Collapse everywhere */}
          <button
            type="button"
            onClick={(ev) => {
              ev.stopPropagation();
              setCollapsed(true);
            }}
            title="Minimize Solace Newsroom"
            style={{
              borderRadius: 999,
              padding: "4px 8px",
              font: "600 11px system-ui",
              border: ui.edge,
              background: "rgba(8,15,26,0.9)",
              color: ui.sub,
            }}
          >
            Hide
          </button>
        </div>
      </header>

      {/* TRANSCRIPT + contextual overlays */}
      <div ref={transcriptRef} style={transcriptStyle} aria-live="polite">
        {/* contextual strip at top per tab */}
        <div
          style={{
            marginBottom: 10,
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,0.45)",
            background: "rgba(15,23,42,0.88)",
            font: "11px system-ui",
            color: "#e5e7eb",
          }}
        >
          {newsTab === "story" && (
            <>
              <strong>Story mode:</strong> Solace reads from the neutral,
              ledger-locked digest and presents one story at a time. Use “Load
              story” below, then ask follow-up questions.
            </>
          )}
          {newsTab === "bias" && (
            <>
              <strong>Bias mode:</strong> type a news outlet or domain
              (e.g. <code>foxnews.com</code>) and Solace will explain historical
              bias intent, context, and our scoring model for that outlet. The
              background heatmap reflects left/right framing tension.
            </>
          )}
          {newsTab === "coach" && (
            <>
              <strong>Coach mode:</strong> paste your draft (or attach a file),
              then use <em>Ask</em> for a bias-aware critique, and{" "}
              <em>Rewrite</em> for a neutral, publication-ready version. This is
              the last mile before issuing a bias score certificate.
            </>
          )}
        </div>

        {/* story snippet for Story tab */}
        {newsTab === "story" && storySnippet && (
          <div
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              marginBottom: 10,
              background: "rgba(15,23,42,0.96)",
              border: "1px solid rgba(148,163,184,0.55)",
              color: "#e5e7eb",
              font: "12px system-ui",
              whiteSpace: "pre-wrap",
            }}
          >
            {storySnippet}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              margin: "6px 0",
              background:
                m.role === "user"
                  ? "rgba(39,52,74,.7)"
                  : "rgba(28,38,54,.82)",
              color:
                m.role === "user"
                  ? "var(--mc-text)"
                  : "rgba(233,240,250,.96)",
              whiteSpace: "pre-wrap",
              font: "13px system-ui",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* COMPOSER */}
      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        {/* pending attachments preview */}
        {pendingFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 8,
              color: ui.text,
              font: "12px system-ui",
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
                  borderRadius: 8,
                  border: "1px solid var(--mc-border)",
                  background: "#0b1220",
                  textDecoration: "none",
                }}
                title={f.name}
              >
                📎 {f.name}
              </a>
            ))}
          </div>
        )}

        {/* Story tab: “Load story” control */}
        {newsTab === "story" && (
          <div
            style={{
              marginBottom: 8,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <button
              type="button"
              onClick={loadStory}
              disabled={storyLoading}
              style={{
                borderRadius: 999,
                padding: "6px 12px",
                font: "600 11px system-ui",
                border: ui.edge,
                background: "rgba(15,23,42,0.96)",
                color: ui.text,
                cursor: storyLoading ? "wait" : "pointer",
                opacity: storyLoading ? 0.65 : 1,
              }}
            >
              {storyLoading ? "Loading story…" : "Load daily story"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          {/* Attach + Mic */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>("#solace-file-input")
                  ?.click()
              }
              title="Attach files (drafts, PDFs, docs)"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--mc-border)",
                background: "#020617",
                color: ui.text,
                cursor: "pointer",
              }}
            >
              📎
            </button>
            <input
              id="solace-file-input"
              type="file"
              className="hidden"
              multiple
              onChange={(e) =>
                handleFiles(e.target.files, { prefix: "solace" })
              }
            />

            <button
              type="button"
              onClick={toggleMic}
              title={listening ? "Stop mic" : "Speak"}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--mc-border)",
                background: listening ? "#14532d" : "#020617",
                color: ui.text,
                cursor: "pointer",
              }}
            >
              {listening ? "■" : "🎤"}
            </button>
          </div>

          {/* Input field */}
          <textarea
            ref={taRef}
            value={input}
            placeholder={
              newsTab === "story"
                ? "Ask about this story, its context, or omissions…"
                : newsTab === "bias"
                ? "Enter a news outlet/domain or ask about bias…"
                : newsTab === "coach"
                ? "Paste or start your article draft here…"
                : "Speak or type…"
            }
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            style={fieldStyle}
          />

          {/* Secondary action button */}
          <button
            type="button"
            onClick={handleSecondaryAction}
            disabled={
              secondaryLoading ||
              (!input.trim() &&
                !(newsTab !== "coach" && input.trim() && !imgLoading))
            }
            style={secondaryBtnStyle}
          >
            {newsTab === "coach"
              ? secondaryLoading
                ? "…"
                : "Rewrite"
              : imgLoading
              ? "…"
              : "Image"}
          </button>

          {/* Primary ask button */}
          <button
            onClick={send}
            disabled={
              streaming || (!input.trim() && pendingFiles.length === 0)
            }
            style={primaryBtnStyle}
          >
            {streaming ? "…" : "Ask"}
          </button>
        </div>

        {/* Footer strip */}
        <div
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
            font: "11px system-ui",
            color: "var(--mc-muted)",
          }}
        >
          <span>
            {newsTab === "story"
              ? "Story • Neutral digest"
              : newsTab === "bias"
              ? "Bias • Outlet scoring"
              : newsTab === "coach"
              ? "Coach • Draft critique & rewrite"
              : "General chat"}{" "}
            · Mood: {modeHint}
          </span>
          <span
            style={{
              maxWidth: "60%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Abrahamic layer locked on · Workspace: {MCA_WORKSPACE_ID}
          </span>
        </div>
      </div>
    </section>
  );

  return createPortal(panel, document.body);
}

/* ========= end component ========= */
