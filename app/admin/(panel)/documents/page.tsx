"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, FileCheck2, FileX2, ExternalLink } from "lucide-react";
import { api } from "@/lib/client";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, cn } from "@/lib/utils";
import type { Application } from "@/lib/types";

const DOCS = [
  { key: "docId", label: "ID / Passport" },
  { key: "docResults", label: "Results / Certificate" },
  { key: "docResidence", label: "Proof of Residence" },
  { key: "docFee", label: "Registration Fee" },
] as const;

type Filter = "all" | "complete" | "missing";

/** Small "view" chip for one uploaded document, or a muted "missing" marker. */
function DocCell({ url }: { url?: string }) {
  if (!url) return <span className="text-xs font-semibold text-slate-300">Missing</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-md bg-brand-green/10 px-2 py-1 text-xs font-bold text-brand-green hover:bg-brand-green hover:text-white"
    >
      View <ExternalLink className="h-3 w-3" />
    </a>
  );
}

/** All documents uploaded with applications, one row per applicant. */
export default function DocumentsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const data = await api<{ applications: Application[] }>(`/api/admin/applications?${params}`);
      setApps(data.applications);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const uploaded = (a: Application) => DOCS.filter((d) => a[d.key]).length;

  const totals = useMemo(() => {
    const files = apps.reduce((n, a) => n + uploaded(a), 0);
    const complete = apps.filter((a) => uploaded(a) === DOCS.length).length;
    return { files, complete, missing: apps.length - complete };
  }, [apps]);

  const rows = apps.filter((a) =>
    filter === "complete" ? uploaded(a) === DOCS.length : filter === "missing" ? uploaded(a) < DOCS.length : true
  );

  const stats = [
    { label: "Files uploaded", value: totals.files, icon: FileText, tone: "text-brand-blue bg-brand-blue/10" },
    { label: "Complete applications", value: totals.complete, icon: FileCheck2, tone: "text-brand-green bg-brand-green/10" },
    { label: "Missing documents", value: totals.missing, icon: FileX2, tone: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className={cn("grid h-11 w-11 place-items-center rounded-xl", s.tone)}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-extrabold text-navy">{loading ? "…" : s.value}</div>
              <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-navy">Documents</h3>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, course, phone…"
              className="w-56 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm outline-none focus:border-brand-green"
            >
              <option value="all">All applicants</option>
              <option value="complete">All documents uploaded</option>
              <option value="missing">Missing documents</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-2 py-3">Applicant</th>
                <th className="px-2 py-3">Course</th>
                <th className="px-2 py-3">Date</th>
                {DOCS.map((d) => (
                  <th key={d.key} className="whitespace-nowrap px-2 py-3">{d.label}</th>
                ))}
                <th className="px-2 py-3">Files</th>
                <th className="px-2 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const n = uploaded(a);
                return (
                  <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-2 py-3">
                      <div className="font-semibold text-navy">{a.fullName}</div>
                      <div className="text-xs text-slate-400">{a.phone}</div>
                    </td>
                    <td className="px-2 py-3 text-slate-600">{a.course}</td>
                    <td className="whitespace-nowrap px-2 py-3 text-slate-500">{formatDate(a.createdAt)}</td>
                    {DOCS.map((d) => (
                      <td key={d.key} className="px-2 py-3">
                        <DocCell url={a[d.key]} />
                      </td>
                    ))}
                    <td className="px-2 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-bold",
                          n === DOCS.length ? "bg-brand-green/10 text-brand-green" : "bg-amber-50 text-amber-600"
                        )}
                      >
                        {n}/{DOCS.length}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                );
              })}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={DOCS.length + 5} className="py-10 text-center text-slate-400">No documents found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={DOCS.length + 5} className="py-10 text-center text-slate-400">Loading…</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
