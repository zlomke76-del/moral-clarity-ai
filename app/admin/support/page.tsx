// app/admin/support/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

type Row = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  category: "Billing" | "Technical" | "Account" | "Other";
  title: string;
  description: string;
  status: "open" | "closed";
  priority: "low" | "medium" | "high";
};

export const dynamic = "force-dynamic";

async function fetchRows(search = "", status = "all", category = "all") {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  let q = supabase.from("v_support_requests").select("*").order("created_at", { ascending: false });

  if (status !== "all") q = q.eq("status", status);
  if (category !== "all") q = q.eq("category", category);
  if (search) {
    q = q.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,email.ilike.%${search}%,name.ilike.%${search}%`
    );
  }

  const { data, error } = await q.limit(200);
  if (error) throw error;
  return data as Row[];
}

export default async function AdminSupportPage({
  searchParams,
}: { searchParams: { q?: string; status?: string; category?: string } }) {
  const q = searchParams.q ?? "";
  const status = searchParams.status ?? "all";
  const category = searchParams.category ?? "all";
  const rows = await fetchRows(q, status, category);

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Support Requests</h1>
        <Filters defaultQ={q} defaultStatus={status} defaultCategory={category} />
      </header>

      <div className="overflow-x-auto rounded-2xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-300">
            <tr>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Requester</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="[&>tr:nth-child(even)]:bg-neutral-950">
            {rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="p-3 tabular-nums">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3">
                  <div className="font-medium">{r.name || "—"}</div>
                  <div className="text-neutral-400">{r.email}</div>
                </td>
                <td className="p-3">
                  <span className="rounded-full px-2 py-0.5 text-xs bg-neutral-800">{r.category}</span>
                </td>
                <td className="p-3">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-neutral-400 line-clamp-2">{r.description}</div>
                </td>
                <td className="p-3">
                  <StatusBadge value={r.status} />
                </td>
                <td className="p-3">
                  <PriorityBadge value={r.priority} />
                </td>
                <td className="p-3 space-x-2">
                  <ActionButton id={r.id} field="status" value={r.status === "open" ? "closed" : "open"} />
                  <ActionButton id={r.id} field="priority" value={nextPriority(r.priority)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function nextPriority(p: Row["priority"]): Row["priority"] {
  return p === "low" ? "medium" : p === "medium" ? "high" : "low";
}

// --- Client bits ---
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Filters({ defaultQ, defaultStatus, defaultCategory }:
  { defaultQ: string; defaultStatus: string; defaultCategory: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);
  const [status, setStatus] = useState(defaultStatus);
  const [category, setCategory] = useState(defaultCategory);

  function apply() {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status !== "all") sp.set("status", status);
    if (category !== "all") sp.set("category", category);
    router.push(`/admin/support?${sp.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <input className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2"
             placeholder="Search…" value={q} onChange={(e)=>setQ(e.target.value)} />
      <select className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2"
              value={status} onChange={(e)=>setStatus(e.target.value)}>
        <option value="all">All status</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
      <select className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2"
              value={category} onChange={(e)=>setCategory(e.target.value)}>
        <option value="all">All categories</option>
        <option value="Technical">Technical</option>
        <option value="Billing">Billing</option>
        <option value="Account">Account</option>
        <option value="Other">Other</option>
      </select>
      <button onClick={apply} className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20">Apply</button>
    </div>
  );
}

function StatusBadge({ value }: { value: "open" | "closed" }) {
  const cls = value === "open" ? "bg-emerald-900/40 text-emerald-300" : "bg-neutral-800 text-neutral-300";
  return <span className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>{value}</span>;
}

function PriorityBadge({ value }: { value: "low" | "medium" | "high" }) {
  const cls =
    value === "high" ? "bg-red-900/40 text-red-300" :
    value === "medium" ? "bg-amber-900/40 text-amber-300" :
    "bg-neutral-800 text-neutral-300";
  return <span className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>{value}</span>;
}

function ActionButton({ id, field, value }: { id: string; field: "status"|"priority"; value: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const res = await fetch("/api/support/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, field, value }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert(await res.text());
  }

  return (
    <button onClick={run} disabled={busy}
      className="rounded-lg px-2 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50">
      {busy ? "…" : `${field} → ${value}`}
    </button>
  );
}
