'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// set whatever your free cap is
const FREE_LIMIT = 50;

type Usage = {
  used: number;
  isPro: boolean;
};

export default function MemoriesPage() {
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);

  // Load usage & pro flag
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setMsg('Please sign in.');

      // 1) usage count
      const { data: count, error: rpcErr } = await supabase
        .rpc('memory_usage', { uid: user.id });

      if (rpcErr) {
        setMsg(rpcErr.message);
        return;
      }

      // 2) pro flag from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('pro')
        .eq('id', user.id)
        .single();

      setUsage({
        used: typeof count === 'number' ? count : 0,
        isPro: !!profile?.pro,
      });
    })();
  }, []);

  const canWrite =
    usage?.isPro || ((usage?.used ?? 0) < FREE_LIMIT);

  async function save() {
    setMsg('');
    setLoading(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) throw new Error('Please sign in.');

      const { error } = await supabase
        .from('memories')
        .insert([{ user_id: user.id, content }]);

      if (error) {
        // RLS/quota failures bubble up here
        throw new Error(
          error.code === '42501' || error.message.includes('row-level security')
            ? 'Free limit reached. Upgrade for unlimited storage.'
            : error.message
        );
      }

      setContent('');
      setMsg('Saved ✅');

      // refresh usage after save
      const { data: count } = await supabase
        .rpc('memory_usage', { uid: user.id });
      setUsage(u => u ? { ...u, used: Number(count ?? u.used) } : u);

    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function startCheckout() {
    setMsg('');
    setLoading(true);
    try {
      // You can pass seats/org here if/when you support them
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Checkout failed to start.');
      const { url } = await res.json();
      window.location.href = url;
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', display: 'grid', gap: 12 }}>
      <h2>Memories</h2>

      {usage && (
        <p style={{ opacity: 0.8 }}>
          {usage.isPro
            ? `Pro account — unlimited storage`
            : `${usage.used} / ${FREE_LIMIT} memories used`}
        </p>
      )}

      {!canWrite && !usage?.isPro && (
        <button onClick={startCheckout} disabled={loading}>
          {loading ? 'Redirecting…' : 'Upgrade for unlimited storage'}
        </button>
      )}

      <textarea
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something memorable…"
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={save} disabled={loading || !content.trim() || !canWrite}>
          {loading ? 'Saving…' : 'Save Memory'}
        </button>
        {msg && <span style={{ alignSelf: 'center' }}>{msg}</span>}
      </div>
    </div>
  );
}
