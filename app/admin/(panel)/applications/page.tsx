"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, Trash2, FileText } from "lucide-react";
import { api } from "@/lib/client";
import { toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/lib/types";

const STATUSES: ApplicationStatus[] = ["Pending", "Contacted", "Registered", "Rejected"];

/** Labelled value row inside the detail modal. */
function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-2 py-1.5 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-navy">{value || "—"}</span>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url?: string }) {
  if (!url)
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-400">
        <FileText className="h-4 w-4" /> {label}: not uploaded
      </div>
    );
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-brand-blue hover:bg-slate-50"
    >
      <FileText className="h-4 w-4" /> {label} — view
    </a>
  );
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<Application | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (q) params.set("q", q);
    const data = await api<{ applications: Application[] }>(`/api/admin/applications?${params}`);
    setApps(data.applications);
    setLoading(false);
  }, [status, q]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function changeStatus(id: string, next: string) {
    await api(`/api/admin/applications/${id}`, { method: "PUT", body: { status: next } });
    setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status: next as ApplicationStatus } : a)));
    setViewing((v) => (v && v._id === id ? { ...v, status: next as ApplicationStatus } : v));
    toast("Status updated");
  }

  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    await api(`/api/admin/applications/${id}`, { method: "DELETE" });
    setApps((prev) => prev.filter((a) => a._id !== id));
    toast("Application deleted");
  }

  const a = viewing;

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-navy">Applications</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, course, phone…"
            className="w-56 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm outline-none focus:border-brand-green"
          >
            <option value="all">All Status</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-2 py-3">#</th>
              <th className="px-2 py-3">Full Name</th>
              <th className="px-2 py-3">Course</th>
              <th className="px-2 py-3">Phone</th>
              <th className="px-2 py-3">Campus</th>
              <th className="px-2 py-3">Date</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, i) => (
              <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-2 py-3 text-slate-400">{i + 1}</td>
                <td className="px-2 py-3">
                  <div className="font-semibold text-navy">{app.fullName}</div>
                  <div className="text-xs text-slate-400">{app.email || app.idNumber}</div>
                </td>
                <td className="px-2 py-3 text-slate-600">
                  {app.course}
                  {app.studyMode && <span className="block text-xs text-slate-400">{app.studyMode}</span>}
                </td>
                <td className="px-2 py-3 text-slate-600">{app.phone}</td>
                <td className="px-2 py-3 text-slate-600">{app.campus || "—"}</td>
                <td className="px-2 py-3 text-slate-500">{formatDate(app.createdAt)}</td>
                <td className="px-2 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => changeStatus(app._id, e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-brand-green"
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button onClick={() => setViewing(app)} className="grid h-7 w-7 place-items-center rounded-md bg-brand-blue text-white" title="View details">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(app._id)} className="grid h-7 w-7 place-items-center rounded-md bg-rose-600 text-white" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && apps.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">No applications found.</td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">Loading…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!a} title={a ? a.fullName : ""} onClose={() => setViewing(null)}>
        {a && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={a.status} />
                {a.reference && <span className="font-mono text-xs font-bold text-navy">{a.reference}</span>}
              </div>
              <span className="text-xs text-slate-400">Applied {formatDate(a.createdAt)}</span>
            </div>

            <section>
              <h4 className="mb-1 text-sm font-extrabold uppercase tracking-wide text-brand-green">Course</h4>
              <Row label="Course" value={a.course} />
              <Row label="Study Mode" value={a.studyMode} />
              <Row label="Campus" value={a.campus} />
            </section>

            <section>
              <h4 className="mb-1 text-sm font-extrabold uppercase tracking-wide text-brand-green">Personal</h4>
              <Row label="Full Name" value={a.fullName} />
              <Row label="ID / Passport" value={a.idNumber} />
              <Row label="Date of Birth" value={a.dateOfBirth} />
              <Row label="Gender" value={a.gender} />
              <Row label="Nationality" value={a.nationality} />
              <Row label="Home Language" value={a.homeLanguage} />
            </section>

            <section>
              <h4 className="mb-1 text-sm font-extrabold uppercase tracking-wide text-brand-green">Contact</h4>
              <Row label="Cell Phone" value={a.phone} />
              <Row label="Email" value={a.email} />
              <Row label="Residential" value={a.residentialAddress} />
              <Row label="Postal" value={a.postalAddress} />
            </section>

            <section>
              <h4 className="mb-1 text-sm font-extrabold uppercase tracking-wide text-brand-green">Parent / Guardian</h4>
              <Row label="Full Name" value={a.guardianName} />
              <Row label="Relationship" value={a.guardianRelationship} />
              <Row label="Phone" value={a.guardianPhone} />
              <Row label="Email" value={a.guardianEmail} />
              <Row label="Occupation" value={a.guardianOccupation} />
            </section>

            <section>
              <h4 className="mb-1 text-sm font-extrabold uppercase tracking-wide text-brand-green">Academic</h4>
              <Row label="School / College" value={a.school} />
              <Row label="Highest Qualification" value={a.highestQualification} />
              <Row label="Year Completed" value={a.yearCompleted} />
            </section>

            <section>
              <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-brand-green">Supporting Documents</h4>
              <div className="grid gap-2">
                <DocLink label="Certified ID / Passport" url={a.docId} />
                <DocLink label="Academic Result / Certificate" url={a.docResults} />
                <DocLink label="Proof of Residence" url={a.docResidence} />
                <DocLink label="Proof of Registration Fee" url={a.docFee} />
              </div>
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
}
