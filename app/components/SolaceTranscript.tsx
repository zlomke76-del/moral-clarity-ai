// app/components/SolaceTranscript.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UI } from "./dock-ui";
import {
  BrainCircuit,
  ChevronRight,
  Lock,
  MessageCircle,
  PenLine,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

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

export default function SolaceTranscript({ messages, transcriptRef, transcriptStyle }: Props) {
  const onlyWelcome =
    messages.length === 0 ||
    (messages.length === 1 &&
      messages[0]?.role === "assistant" &&
      (messages[0]?.content || "").startsWith("Ready when you are."));

  if (onlyWelcome) {
    return (
      <div ref={transcriptRef} className="solace-transcript-home" style={transcriptStyle}>
        <SolaceWelcomeSurface />
      </div>
    );
  }

  return (
    <div ref={transcriptRef} className="solace-transcript-chat" style={transcriptStyle}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const artifactType = msg.artifact?.type;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: 14,
                borderRadius: UI.radiusLg,
                background: isUser ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: UI.text,
                backdropFilter: "blur(6px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              {artifactType === "code" && <CodeArtifactBlock artifact={msg.artifact as CodeArtifact} />}
              {artifactType === "text" && <TextArtifactBlock artifact={msg.artifact as TextArtifact} />}
              {!artifactType && msg.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={msg.imageUrl} alt="Solace generated result" style={{ maxWidth: "100%", borderRadius: 14 }} />
              )}
              {!artifactType && msg.content && (
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 15 }}>{msg.content}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function sendPromptToComposer(prompt: string) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("solace:set-input", {
      detail: { prompt },
    }),
  );
}

function SolaceWelcomeSurface() {
  const actions = [
    {
      title: "Explore an idea",
      body: "Research any topic with depth.",
      prompt: "Help me explore an idea clearly and deeply.",
      icon: <Search className="h-8 w-8" />,
      tone: "gold",
    },
    {
      title: "Test a claim",
      body: "Analyze arguments and assumptions.",
      prompt: "Help me test a claim and separate evidence from assumptions.",
      icon: <BrainCircuit className="h-8 w-8" />,
      tone: "violet",
    },
    {
      title: "Analyze risk",
      body: "Identify threats and weigh outcomes.",
      prompt: "Help me analyze the risks, trade-offs, and likely outcomes.",
      icon: <ShieldCheck className="h-8 w-8" />,
      tone: "green",
    },
    {
      title: "Create something",
      body: "Write, plan, and build something with clarity.",
      prompt: "Help me create something clear, useful, and well structured.",
      icon: <PenLine className="h-8 w-8" />,
      tone: "orange",
    },
    {
      title: "Protect your family",
      body: "Strengthen what matters most.",
      prompt: "Help me think through a practical protection plan for my family.",
      icon: <Users className="h-8 w-8" />,
      tone: "rose",
    },
    {
      title: "Secure your thinking",
      body: "Keep your mind private and safe.",
      prompt: "Help me protect my thinking, privacy, and digital safety.",
      icon: <Lock className="h-8 w-8" />,
      tone: "blue",
    },
  ];

  return (
    <div className="solace-home-grid">
      <section className="solace-hero-card">
        <div className="solace-hero-stars" aria-hidden />
        <div className="solace-hero-wave" aria-hidden />
        <div className="solace-hero-horizon" aria-hidden />

        <div className="solace-hero-content">
          <Sparkles className="solace-hero-mark" />
          <h1>
            Welcome to <span>Solace.</span>
          </h1>
          <p>Your governed AI companion for clearer thinking, better decisions, and a more meaningful life.</p>
        </div>

        <div className="solace-action-grid">
          {actions.map((action) => (
            <button
              key={action.title}
              type="button"
              className={`solace-action-card tone-${action.tone}`}
              onClick={() => sendPromptToComposer(action.prompt)}
            >
              <span className="solace-action-icon">{action.icon}</span>
              <span className="solace-action-title">
                {action.title} <ChevronRight className="h-4 w-4" />
              </span>
              <span className="solace-action-body">{action.body}</span>
            </button>
          ))}
        </div>

        <div className="solace-privacy-line">
          <Lock className="h-4 w-4" />
          <span>Guided. Private. Yours.</span>
        </div>
      </section>

      <aside className="solace-right-rail" aria-label="Solace context">
        <RailCard title="Memory" action="View all" actionHref="/memories" icon={<BrainCircuit className="h-5 w-5" />}>
          <p>Your memory gives Solace continuity across conversations.</p>
          <div className="solace-memory-active">
            <span className="solace-memory-ring" />
            <span>
              <strong>Memory Active</strong>
              <em>Continuity is on and protected.</em>
            </span>
            <span className="solace-green-dot" />
          </div>
        </RailCard>

        <RailCard title="Recent Conversations" action="View all" actionHref="/app?view=conversations" icon={<MessageCircle className="h-5 w-5" />}>
          <ul className="solace-recent-list">
            <li><span>Moral clarity in leadership</span><em>2h ago</em></li>
            <li><span>AI safety vs. innovation</span><em>1d ago</em></li>
            <li><span>Family protection plan</span><em>2d ago</em></li>
            <li><span>Stoic principles explained</span><em>3d ago</em></li>
          </ul>
        </RailCard>

        <RailCard title="Daily Reflection" icon={<Sparkles className="h-5 w-5" />}>
          <div className="solace-reflection">
            <Quote className="h-7 w-7" />
            <p>Clarity is not the absence of doubt, but the presence of purpose.</p>
          </div>
        </RailCard>

        <div className="solace-governed-card">
          <ShieldCheck className="h-5 w-5" />
          <div>
            <strong>Governed &amp; Protected</strong>
            <span>Moral Clarity AI v3.0</span>
          </div>
          <span className="solace-green-dot" />
        </div>
      </aside>
    </div>
  );
}

function RailCard({
  title,
  action,
  actionHref,
  icon,
  children,
}: {
  title: string;
  action?: string;
  actionHref?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="solace-rail-card">
      <div className="solace-rail-head">
        <div>
          {icon}
          <h2>{title}</h2>
        </div>
        {action && actionHref && <a href={actionHref}>{action}</a>}
      </div>
      {children}
    </section>
  );
}

function CodeArtifactBlock({ artifact }: { artifact: CodeArtifact }) {
  const copy = () => navigator.clipboard.writeText(artifact.content);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: UI.radiusMd, padding: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace', fontSize: 13, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.015)" }}>
      <Header title={artifact.filename || artifact.language} onCopy={copy} />
      <pre style={{ margin: 0, overflowX: "auto" }}><code>{artifact.content}</code></pre>
    </div>
  );
}

function TextArtifactBlock({ artifact }: { artifact: TextArtifact }) {
  const copy = () => navigator.clipboard.writeText(artifact.content);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: UI.radiusMd, padding: 14, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.015)" }}>
      <Header title={artifact.title || "Response"} onCopy={copy} />
      <div style={{ fontSize: 15, lineHeight: 1.65 }}>
        {artifact.format === "markdown" ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{artifact.content}</ReactMarkdown>
        ) : (
          <div style={{ whiteSpace: "pre-wrap" }}>{artifact.content}</div>
        )}
      </div>
    </div>
  );
}

function Header({ title, onCopy }: { title: string; onCopy: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
      <strong style={{ fontSize: 13, color: UI.text }}>{title}</strong>
      <button type="button" onClick={onCopy} style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: UI.sub, borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>
        Copy
      </button>
    </div>
  );
}
