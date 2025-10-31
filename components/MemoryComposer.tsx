// /components/MemoryComposer.tsx
'use client';

import { useRef, useState } from 'react';
import { toast } from '@/lib/toast';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

const UPLOAD_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_BUCKET || 'uploads';

type Props = { workspaceId: string };
type Uploaded = { name: string; url: string; type: string; key: string };

export default function MemoryComposer({ workspaceId }: Props) {
  const [tab, setTab] = useState<'workspace' | 'user'>('workspace');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [kind, setKind] = useState<'profile'|'preference'|'fact'|'task'|'note'>('note');

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createSupabaseBrowser();

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setPendingFiles(prev => [...prev, ...files]);
    if (fileRef.current) fileRef.current.value = '';
  }

  function removePending(idx: number) {
    setPendingFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function uploadAll(files: File[], userKey = 'owner'): Promise<Uploaded[]> {
    if (!files.length) return [];
    setUploading(true);
    try {
      const out: Uploaded[] = [];
      for (const f of files) {
        const safe = f.name.replace(/[^\w.\-]+/g, '_');
        const key = `${userKey}/${Date.now()}_${safe}`;
        const { error } = await supabase.storage
          .from(UPLOAD_BUCKET)                         // ← env bucket
          .upload(key, f, {
            upsert: false,
            contentType: f.type || 'application/octet-stream',
          });
        if (error) throw new Error(error.message || 'Upload failed');

        const { data: pub } = supabase.storage
          .from(UPLOAD_BUCKET)                         // ← env bucket
          .getPublicUrl(key);

        out.push({ name: f.name, url: pub.publicUrl, type: f.type || 'application/octet-stream', key });
      }
      return out;
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    try {
      const uploaded = await uploadAll(pendingFiles, 'owner');
      const attachmentBlock =
        uploaded.length
          ? '\n\nAttachments:\n' + uploaded.map(a => `• ${a.name}: ${a.url}`).join('\n')
          : '';

      const payload: any = {
        mode: tab,
        workspace_id: workspaceId,
        attachments: uploaded,
      };

      if (tab === 'workspace') {
        payload.title = title.trim() || undefined;
        payload.content = (content.trim() + attachmentBlock).trim() || undefined;
      } else {
        payload.kind = kind;
        payload.content = (content.trim() + attachmentBlock).trim();
        payload.user_key = 'owner';
      }

      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) return toast(j?.error ?? 'Failed to save');

      toast('Saved.');
      setTitle(''); setContent(''); setPendingFiles([]);
      window.location.reload();
    } catch (e: any) {
      toast(e?.message ?? 'Failed to save');
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
      {/* …UI unchanged… */}
    </div>
  );
}
