'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MemoriesPage() {
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function save() {
    try {
      setLoading(true);
      setMsg('');

      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) throw new Error('Please sign in first.');

      const { error } = await supabase
        .from('memories')
        .insert([{ user_id: user.id, content }]);

      if (error) {
        if (error.code === '42501' || error.message.includes('violates row-level security')) {
          throw new Error('Free limit reached — upgrade for unlimited storage.');
        }
        throw error;
      }

      setMsg('Saved ✅');
      setContent('');
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', display: 'grid', gap: 12 }}>
      <h2>Memories</h2>
      <textarea
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something memorable..."
      />
      <button onClick={save} disabled={loading || !content.trim()}>
        {loading ? 'Saving...' : 'Save Memory'}
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
