"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowUp,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Lightbulb,
  LockKeyhole,
  Paperclip,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const actionCards = [
  {
    title: "Explore an idea",
    description: "Research any topic with depth.",
    icon: Search,
    tone: "gold",
    prompt: "Help me explore an idea clearly.",
  },
  {
    title: "Test a claim",
    description: "Analyze arguments and assumptions.",
    icon: BrainCircuit,
    tone: "violet",
    prompt: "Help me test this claim for truth, assumptions, and weak points: ",
  },
  {
    title: "Analyze risk",
    description: "Identify threats and weigh outcomes.",
    icon: ShieldCheck,
    tone: "emerald",
    prompt: "Help me analyze the risks and trade-offs in this decision: ",
  },
  {
    title: "Create something",
    description: "Write, plan, and build with clarity.",
    icon: Edit3,
    tone: "orange",
    prompt: "Help me create something new: ",
  },
  {
    title: "Protect your family",
    description: "Strengthen what matters most.",
    icon: Users,
    tone: "rose",
    prompt: "Help me build a practical family protection plan for: ",
  },
  {
    title: "Secure your thinking",
    description: "Keep your mind private and safe.",
    icon: LockKeyhole,
    tone: "blue",
    prompt: "Help me think through this carefully and privately: ",
  },
] as const;

const recentConversations = [
  ["Moral clarity in leadership", "2h ago"],
  ["AI safety vs. innovation", "1d ago"],
  ["Family protection plan", "2d ago"],
  ["Stoic principles explained", "3d ago"],
];

function getAssistantText(payload: any): string {
  if (!payload) return "I received an empty response.";
  return (
    payload.text ||
    payload.answer ||
    payload.message ||
    payload.content ||
    payload?.result?.text ||
    payload?.assistant?.content ||
    "I received the response, but could not read the expected text field."
  );
}

export default function AppHomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const hasConversation = messages.length > 0;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  async function submitMessage(messageOverride?: string) {
    const message = (messageOverride ?? input).trim();
    if (!message || isSending) return;

    setInput("");
    setIsSending(true);
    setMessages((current) => [...current, { role: "user", content: message }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages,
          workspaceId: MCA_WORKSPACE_ID,
          ministryMode: false,
          modeHint: "smart",
          userKey: "studio-user",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Solace request failed.");
      }

      const payload = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: getAssistantText(payload) },
      ]);
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `⚠️ ${error?.message || "Solace could not respond."}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage();
  }

  return (
    <section className="solace-home-shell">
      <div className="solace-home-atmosphere" />

      <header className="solace-home-header">
        <div>
          <div className="solace-home-greeting">
            {greeting}, Tim.
            <span aria-hidden="true" />
          </div>
          <p>What would you like clarity on today?</p>
        </div>

        <div className="solace-home-header-actions">
          <div className="solace-status-pill">
            <ShieldCheck className="h-4 w-4" />
            <span>
              <strong>System Status</strong>
              Protected &amp; Governed
            </span>
            <i />
          </div>

          <div className="solace-user-orb">TI</div>
        </div>
      </header>

      <div className="solace-home-grid">
        <main className="solace-home-main-panel">
          {!hasConversation ? (
            <div className="solace-welcome-surface">
              <div className="solace-horizon" />
              <div className="solace-wave solace-wave-one" />
              <div className="solace-wave solace-wave-two" />

              <div className="solace-welcome-copy">
                <Sparkles className="h-10 w-10 text-amber-200" />
                <h1>
                  Welcome to <span>Solace.</span>
                </h1>
                <p>
                  Your governed AI companion for clearer thinking, better
                  decisions, and a more meaningful life.
                </p>
              </div>

              <div className="solace-action-grid">
                {actionCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.title}
                      type="button"
                      className={`solace-action-card tone-${card.tone}`}
                      onClick={() => setInput(card.prompt)}
                    >
                      <span className="solace-action-icon">
                        <Icon className="h-6 w-6" />
                      </span>
                      <strong>{card.title}</strong>
                      <small>{card.description}</small>
                      <ChevronRight className="solace-action-chevron h-4 w-4" />
                    </button>
                  );
                })}
              </div>

              <div className="solace-private-line">
                <LockKeyhole className="h-4 w-4" /> Guided. Private. Yours.
              </div>
            </div>
          ) : (
            <div className="solace-conversation-surface">
              {messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={`solace-message solace-message-${message.role}`}
                >
                  <div className="solace-message-label">
                    {message.role === "assistant" ? "Solace" : "You"}
                  </div>
                  <div className="solace-message-body">{message.content}</div>
                </article>
              ))}
              {isSending && (
                <article className="solace-message solace-message-assistant">
                  <div className="solace-message-label">Solace</div>
                  <div className="solace-thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              )}
            </div>
          )}

          <form className="solace-home-input" onSubmit={handleSubmit}>
            <button type="button" aria-label="Attach file">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Solace anything..."
            />
            <div className="solace-input-mode">
              <Sparkles className="h-4 w-4" /> Smart
            </div>
            <button type="submit" disabled={isSending || !input.trim()}>
              <ArrowUp className="h-5 w-5" />
            </button>
          </form>

          <p className="solace-home-disclaimer">
            Solace can make mistakes. Verify important information.
          </p>
        </main>

        <aside className="solace-home-right-rail">
          <section className="solace-rail-card memory-card">
            <div className="solace-rail-card-title">
              <BrainCircuit className="h-5 w-5" />
              <strong>Memory</strong>
              <a href="/memories">View all</a>
            </div>
            <p>Your memory gives Solace continuity across conversations.</p>
            <div className="memory-orbit-row">
              <div className="memory-orbit" />
              <div>
                <strong>Memory Active</strong>
                <span>Continuity is on and protected.</span>
              </div>
              <i />
            </div>
          </section>

          <section className="solace-rail-card">
            <div className="solace-rail-card-title">
              <Lightbulb className="h-5 w-5" />
              <strong>Recent Conversations</strong>
              <a href="/app">View all</a>
            </div>
            <div className="recent-list">
              {recentConversations.map(([title, time]) => (
                <div key={title}>
                  <span>{title}</span>
                  <time>{time}</time>
                </div>
              ))}
            </div>
          </section>

          <section className="solace-rail-card reflection-card">
            <div className="solace-rail-card-title">
              <Sparkles className="h-5 w-5" />
              <strong>Daily Reflection</strong>
            </div>
            <Quote className="h-7 w-7 text-white/25" />
            <p>Clarity is not the absence of doubt, but the presence of purpose.</p>
          </section>

          <section className="solace-rail-card governed-card">
            <div className="governed-row">
              <ShieldCheck className="h-5 w-5" />
              <div>
                <strong>Governed &amp; Protected</strong>
                <span>Moral Clarity AI v3.0</span>
              </div>
              <i />
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
