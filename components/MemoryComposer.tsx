// /components/MemoryComposer.tsx
'use client';

import { useRef, useState } from 'react';
import { toast } from '@/lib/toast';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

type Props = {
  workspaceId: string;
};

type Uploaded = { name: string; url: string; type: string; key: string };

export default function MemoryComposer({ workspaceId }: Props) {
  const [tab, setTab] = useState<'workspace' | 'user'>('workspace');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [kind, setKind] = useState<'profile'|'preference'|'fact'|'task'|'note'>('note');

  // file upload state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createSupabaseBrowser();

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setPendingFiles(prev => [...prev, ...files]);
    if (fileRef.current) fileRef.current.value = ''; // allow re-picking same file name
  }

  function removePending(idx: number) {
    setPendingFiles(prev => prev.filter((_, i) => i !== idx));
  }

  // Minimal in-file uploader (unique keys, preserves contentType)
  async function uploadAll(files: File[], userKey = 'owner'): Promise<Uploaded[]> {
    if (!files.length) return [];
    setUploading(true);
    try {
      const out: Uploaded[] = [];
      for (const f of files) {
        const safe = f.name.replace(/[^\w.\-]+/g, '_');
        const key = `${userKey}/${Date.now()}_${safe}`; // no leading slash
        const { error } = await supabase.storage.from('uploads').upload(key, f, {
          upsert: false,
          contentType: f.type || 'application/octet-stream',
        });
        if (error) {
          throw new Error(error.message || 'Upload failed');
        }
        const { data: pub } = supabase.storage.from('uploads').getPublicUrl(key);
        out.push({ name: f.name, url: pub.publicUrl, type: f.type || 'application/octet-stream', key });
      }
      return out;
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    try {
      // 1) Upload any staged files first
      const uploaded = await uploadAll(pendingFiles, 'owner');

      // 2) Build attachment text block to embed links into content
      const attachmentBlock =
        uploaded.length > 0
          ? '\n\nAttachments:\n' + uploaded.map(a => `• ${a.name}: ${a.url}`).join('\n')
          : '';

      // 3) Construct payload for your /api/memory route
      const payload: any = {
        mode: tab,
        workspace_id: workspaceId,
        // Let backend optionally use a structured attachments array if it wants
        attachments: uploaded,
      };

      if (tab === 'workspace') {
        payload.title = title.trim() || undefined;
        payload.content = (content.trim() + attachmentBlock).trim() || undefined;
      } else {
        payload.kind = kind;
        payload.content = (content.trim() + attachmentBlock).trim();
        payload.user_key = 'owner'; // TODO: replace with your stable per-user key/uid
      }

      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setPendingFiles([]);
      // simple refresh
      window.location.reload();
    } catch (err: any) {
      toast(err?.message ?? 'Failed to save');
    }
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

        {/* File picker + staged files */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={onPickFiles}
            />
            <button
              className="rounded-md border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800/60"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              Choose files
            </button>
            {pendingFiles.length > 0 && (
              <span className="text-xs text-neutral-400">
                {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''} attached
              </span>
            )}
          </div>

          {pendingFiles.length > 0 && (
            <ul className="space-y-1 text-xs text-neutral-300">
              {pendingFiles.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded border border-neutral-800 px-2 py-1">
                  <span className="truncate">{f.name} <span className="opacity-60">({f.type || 'unknown'})</span></span>
                  <button
                    className="ml-3 rounded px-2 py-0.5 text-red-300 hover:bg-red-900/30"
                    onClick={() => removePending(i)}
                    aria-label="Remove file"
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={submit}
            disabled={uploading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
