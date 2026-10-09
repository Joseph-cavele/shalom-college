"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import { toast } from "@/components/ui/Toast";
import { formatDate, cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await api<{ messages: Message[] }>("/api/admin/messages");
    setMessages(data.messages);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggleRead(m: Message) {
    await api(`/api/admin/messages/${m._id}`, { method: "PUT", body: { read: !m.read } });
    setMessages((prev) => prev.map((x) => (x._id === m._id ? { ...x, read: !x.read } : x)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await api(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m._id !== id));
    toast("Message deleted");
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">
          Contact Messages {unread > 0 && <span className="ml-1 rounded-full bg-brand-green px-2 py-0.5 text-xs text-white">{unread} new</span>}
        </h3>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m._id} className={cn("rounded-xl border p-4", m.read ? "border-slate-200" : "border-l-4 border-l-brand-green border-slate-200 bg-green-50/30")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-extrabold text-navy">{m.name}</span>
                <span className="ml-2 text-sm text-slate-400">{m.email}</span>
                {m.phone && (
                  <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className="ml-2 text-sm text-slate-400 hover:underline">
                    {m.phone}
                  </a>
                )}
                <div className="text-sm font-bold text-brand-green">{m.subject}</div>
              </div>
              <div className="whitespace-nowrap text-xs text-slate-400">{formatDate(m.createdAt)}</div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{m.message}</p>
            <div className="mt-3 flex gap-3 text-xs font-semibold">
              <a href={`mailto:${m.email}`} className="text-brand-blue hover:underline">Reply by email</a>
              <button onClick={() => toggleRead(m)} className="text-navy hover:underline">
                Mark as {m.read ? "unread" : "read"}
              </button>
              <button onClick={() => remove(m._id)} className="text-rose-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {!loading && messages.length === 0 && <div className="py-10 text-center text-slate-400">No messages yet.</div>}
        {loading && <div className="py-10 text-center text-slate-400">Loading…</div>}
      </div>
    </div>
  );
}
