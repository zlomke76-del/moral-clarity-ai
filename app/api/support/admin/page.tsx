// app/support/admin/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

type Ticket = {
  id: string;
  name: string | null;
  email: string;
  category: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  created_at: string;
};

export default function SupportAdmin() {
  const [key, setKey] = useState<string>("");
  const [status, setStatus] = useState<string>("open");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Ticket[]>([]);
  const [sel, setSel] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");

  async function fetchRows(s = status) {
    if (!key) return;
    setLoading(true);
    const res = await fetch(`/api/support/list?status=${encodeURIComponent(s)}`, {
      headers: { "x-admin-key": key },
      cache: "no-store",
    });
    const data = await res.json();
    setRows(data.rows || []);
    setLoading(false);
  }

  useEffect(() => { fetchRows(); /* eslint-disable-next-line */ }, [key, status]);

  async function setTicketStatus(id: string, next: Ticket["status"]) {
    await fetch("/api/support/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, status: next }),
    });
    await fetchRows();
    if (sel) setSel({ ...sel, status: next });
  }

  async function sendReply() {
    if (!sel || !reply.trim()) return;
    await fetch("/api/support/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ requestId: sel.id, message: reply }),
    });
    setReply("");
    alert("Reply sent.");
  }

  const title = useMemo(() => {
    if (status === "open") return "Open";
    if (status === "in_progress") return "In Progress";
    return "Resolved";
  }, [status]);

  if (!key) {
    return (
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-semibold mb-3">Support Admin</h1>
        <p className="mb-6 text-gray-700">Enter your admin key to continue.</p>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Admin key"
          onChange={(e) => setKey(e.target.value)}
        />
        <p className="text-gray-600 text-sm">
          Tip: store this in your password manager. You can rotate it anytime in Vercel env vars.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Support Admin</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button
          onClick={() => fetchRows()}
          className="border rounded px-3 py-2"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* List */}
        <div className="border rounded p-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium">{title} Tickets ({rows.length})</h2>
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
          </div>
          <ul className="divide-y">
            {rows.map((t) => (
              <li key={t.id} className="py-3 cursor-pointer" onClick={() => setSel(t)}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{t.email} • {t.category}</div>
                    <div className="text-gray-600 text-sm line-clamp-1">{t.description}</div>
                  </div>
                  <div className="text-gray-500 text-sm">{new Date(t.created_at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Detail */}
        <div className="border rounded p-3">
          {sel ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-medium mb-1">Ticket Detail</h2>
                  <div className="text-sm text-gray-600">ID: {sel.id.slice(0,8)}…</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTicketStatus(sel.id, "open")} className="border rounded px-2 py-1">Open</button>
                  <button onClick={() => setTicketStatus(sel.id, "in_progress")} className="border rounded px-2 py-1">In Progress</button>
                  <button onClick={() => setTicketStatus(sel.id, "resolved")} className="border rounded px-2 py-1">Resolved</button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div><span className="font-medium">From:</span> {sel.name || "(no name)"} &lt;{sel.email}&gt;</div>
                <div><span className="font-medium">Category:</span> {sel.category}</div>
                <div><span className="font-medium">Status:</span> {sel.status}</div>
                <div className="mt-2"><span className="font-medium">Message:</span>
                  <p className="whitespace-pre-wrap mt-1">{sel.description}</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Reply</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={6}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Write a thoughtful response…"
                />
                <div className="mt-2 flex gap-2">
                  <button onClick={sendReply} className="border rounded px-3 py-2">Send Reply</button>
                  <button onClick={() => setReply("")} className="border rounded px-3 py-2">Clear</button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-600">Select a ticket from the list to view and reply.</div>
          )}
        </div>
      </div>
    </main>
  );
}
