// /components/MemoryComposer.tsx
'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

type Props = {
  workspaceId: string;
};

export default function MemoryComposer({ workspaceId }: Props) {
  const [tab, setTab] = useState<'workspace' | 'user'>('workspace');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [kind, setKind] = useState<'profile'|'preference'|'fact'|'task'|'note'>('note');

  async function submit() {
    const payload: any = {
      mode: tab,
      workspace_id: workspaceId,
    };
    if (tab === 'workspace') {
      payload.title = title.trim() || undefined;
      payload.content = content.trim() || undefined;
    } else {
      // user memory path (requires content)
      payload.kind = kind;
      payload.content = content.trim();
      payload.user_key = 'owner'; // replace with a stable per-user key of your choosing
    }

    const res = await fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (!res.ok) {
      toast(j?.error ?? 'Failed to save');
      return;
    }
    toast('Saved.');
    setTitle('');
    setContent('');
    // simple refresh
    window.location.reload();
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2 text-sm">
        <button
          onClick={() => setTab('workspace')}
          className={`rounded px-2 py-1 ${tab==='workspace' ? 'bg-neutral-800' : 'hover:bg-neutral-800/60'}`}
        >
          Workspace note
        </button>
        <button
          onClick={() => setTab('user')}
          className={`rounded px-2 py-1 ${tab==='user' ? 'bg-neutral-800' : 'hover:bg-neutral-800/60'}`}
        >
          User memory (vector)
        </button>
      </div>

      <div className="space-y-3 p-4">
        {tab === 'user' && (
          <div className="flex items-center gap-3 text-sm">
            <label className="text-neutral-400">Kind</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as any)}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1"
            >
              <option value="note">note</option>
              <option value="profile">profile</option>
              <option value="preference">preference</option>
              <option value="fact">fact</option>
              <option value="task">task</option>
            </select>
          </div>
        )}

        {tab === 'workspace' && (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={tab === 'workspace'
            ? 'Write a workspace note (stored in mca.memories)'
            : 'Write a user memory (embedded for vector search)'}
          rows={4}
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />

        <div className="flex justify-end">
          <button
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
