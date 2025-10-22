'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Role = 'user' | 'assistant' | 'system';
type Msg = { role: Role; content: string };

type Mode = 'Create' | 'Next Steps' | 'Red Team' | 'Ministry' | 'Neutral';

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function FloatingChat() {
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState<Mode>('Create');
  const [filters, setFilters] = useState<string[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mode → default filters (you can tune these)
  useEffect(() => {
    if (mode === 'Ministry') setFilters(['abrahamic', 'ministry']);
    else if (mode === 'Next Steps') setFilters(['guidance']);
    else setFilters([]);
  }, [mode]);

  // always scroll to bottom on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, open]);

  const appendAssistantShell = useCallback(() => {
    setMsgs((m) => [...m, { role: 'assistant', content: '' }]);
  }, []);

  const updateAssistantText = useCallback((txt: string) => {
    setMsgs((m) => {
      const copy = [...m];
      const i = copy.length - 1;
      if (i >= 0 && copy[i].role === 'assistant') copy[i] = { role: 'assistant', content: txt };
      return copy;
    });
  }, []);

  const send = useCallback(
    async (stream = true) => {
      const text = input.trim();
      if (!text || busy) return;

      setBusy(true);
      setError(null);
      setInput('');
      setMsgs((m) => [...m, { role: 'user', content: text }]);

      try {
        if (!stream) {
          // ---- Non-stream path (/api/chat non-stream) ----
          const r = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Last-Mode': mode,
            },
            body: JSON.stringify({
              messages: [...msgs, { role: 'user', content: text }],
              filters,
              stream: false,
            }),
          });
          if (!r.ok) {
            const t = await r.text().catch(() => '');
            throw new Error(`HTTP ${r.status}: ${t}`);
          }
          const j = await r.json();
          setMsgs((m) => [...m, { role: 'assistant', content: String(j.text ?? '') }]);
          return;
        }

        // ---- Stream path (/api/chat stream; supports Solace or OpenAI SSE) ----
        const r = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Last-Mode': mode,
          },
          body: JSON.stringify({
            messages: [...msgs, { role: 'user', content: text }],
            filters,
            stream: true,
          }),
        });

        if (!r.ok) {
          const t = await r.text().catch(() => '');
          throw new Error(`HTTP ${r.status}: ${t}`);
        }

        // Some backends return text/plain (incremental), others SSE.
        // We handle both by reading the raw stream and appending text.
        if (!r.body) throw new Error('No response body');

        const reader = r.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';

        // Create the assistant shell so we can progressively update it
        appendAssistantShell();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          // If it's SSE, collect only the `data:` lines
          if (chunk.includes('data:')) {
            // Minimal SSE parsing
            const lines = chunk
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);

            for (const ln of lines) {
              if (ln.startsWith('data:')) {
                const payload = ln.slice(5).trim();
                if (payload === '[DONE]') continue;

                // Some servers send raw text; others JSON with {text:"..."}
                try {
                  const j = JSON.parse(payload);
                  const t = String(j.text ?? j.delta ?? j.choices?.[0]?.delta?.content ?? '');
                  if (t) {
                    acc += t;
                    updateAssistantText(acc);
                  }
                } catch {
                  acc += payload;
                  updateAssistantText(acc);
                }
              }
            }
          } else {
            // Plain-text progressive stream (Solace plain mode)
            acc += chunk;
            updateAssistantText(acc);
          }
        }

        // finalize
        if (!acc) updateAssistantText('[No response]');
      } catch (e: any) {
        const msg = e?.message || 'Request failed';
        setError(msg);
        // if streaming failed before assistant shell existed, add a one-shot error line
        setMsgs((m) => {
          const hasTailAssistant = m[m.length - 1]?.role === 'assistant';
          if (hasTailAssistant) return [...m.slice(0, -1), { role: 'assistant', content: `⚠️ ${msg}` }];
          return [...m, { role: 'assistant', content: `⚠️ ${msg}` }];
        });
      } finally {
        setBusy(false);
      }
    },
    [appendAssistantShell, updateAssistantText, input, msgs, filters, mode, busy]
  );

  return (
    <div
      className={clsx(
        'fixed right-4 bottom-4 z-[1000] w-[min(720px,calc(100vw-2rem))] text-sm',
        open ? '' : ''
      )}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between rounded-t-xl border border-zinc-800 bg-zinc-900/95 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/80" />
          <span className="font-medium">Solace</span>
          <span className="text-zinc-400">Brainstorm, draft, ideate.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md px-2 py-1 text-zinc-300 hover:bg-zinc-800"
            aria-label={open ? 'Minimize' : 'Open'}
          >
            {open ? '–' : 'Open'}
          </button>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="rounded-b-xl border border-zinc-800 border-t-0 bg-zinc-950/95 backdrop-blur">
          {/* Mode row */}
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-3 py-2">
            {(['Create', 'Next Steps', 'Red Team', 'Ministry'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx(
                  'rounded-md px-2 py-1 text-xs',
                  mode === m ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="max-h-[40vh] overflow-y-auto px-3 py-3 space-y-2">
            {msgs.length === 0 && (
              <p className="text-zinc-400">
                Ask anything, or paste context. I’ll stream a concise, mode-aware answer and invite next steps.
              </p>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={clsx(
                  'rounded-lg px-3 py-2',
                  m.role === 'user' ? 'bg-zinc-800/80 text-zinc-100' : 'bg-zinc-900/80 text-zinc-200'
                )}
              >
                {m.content}
              </div>
            ))}
            {error && <div className="text-amber-400">⚠️ {error}</div>}
          </div>

          {/* Composer */}
          <div className="border-t border-zinc-800 p-3">
            <div className="flex items-center gap-2">
              <textarea
                className="min-h-[40px] max-h-[160px] flex-1 resize-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:border-zinc-600"
                placeholder="Speak or type..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(true);
                  }
                }}
              />
              <button
                disabled={busy || !input.trim()}
                onClick={() => send(true)}
                className={clsx(
                  'rounded-md px-3 py-2',
                  busy || !input.trim()
                    ? 'bg-zinc-800 text-zinc-400'
                    : 'bg-zinc-200 text-zinc-900 hover:bg-white'
                )}
              >
                {busy ? '…' : 'Send'}
              </button>
            </div>
            {/* Optional: a non-stream fallback button for debugging */}
            {/* <button onClick={() => send(false)} className="mt-2 text-xs text-zinc-400 hover:text-zinc-200">Use non-stream</button> */}
          </div>
        </div>
      )}
    </div>
  );
}
