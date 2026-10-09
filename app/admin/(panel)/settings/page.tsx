"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const TABS = ["School Details", "Contact Details", "Mission & Vision", "Social Media"] as const;
type Tab = (typeof TABS)[number];

export default function SettingsPage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [tab, setTab] = useState<Tab>("School Details");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ settings: SiteSettings }>("/api/admin/settings").then((d) => setS(d.settings));
  }, []);

  if (!s) return <div className="card p-8 text-center text-slate-400">Loading…</div>;

  const set = (patch: Partial<SiteSettings>) => setS({ ...s, ...patch });

  async function save() {
    setSaving(true);
    try {
      await api("/api/admin/settings", { method: "PUT", body: s });
      toast("Settings saved");
    } catch (e) {
      toast((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  const Field = ({ label, k, placeholder }: { label: string; k: keyof SiteSettings; placeholder?: string }) => (
    <div>
      <label className="field-label">{label}</label>
      <input value={(s[k] as string) || ""} onChange={(e) => set({ [k]: e.target.value } as Partial<SiteSettings>)} className="field-input" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="card p-6">
      <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "border-b-[3px] px-4 py-2.5 text-sm font-bold transition",
              tab === t ? "border-brand-green text-navy" : "border-transparent text-slate-400 hover:text-navy"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "School Details" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="School Name" k="schoolName" />
          <Field label="Registration No." k="regNo" />
          <Field label="Tagline" k="tagline" />
          <Field label="Accreditation" k="accreditation" />
          <Field label="Established Year" k="established" />
        </div>
      )}

      {tab === "Contact Details" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" k="email" />
          <Field label="WhatsApp Number" k="whatsapp" />
          <Field label="Phone 1" k="phone1" />
          <Field label="Phone 2" k="phone2" />
          <Field label="Phone 3" k="phone3" />
          <Field label="Opening Hours" k="openingHours" placeholder="e.g. Mon – Fri: 08:00 – 16:30" />
          <div className="sm:col-span-2">
            <Field label="Campus 1 (Rustenburg)" k="campus1" />
          </div>
          <div className="sm:col-span-2">
            <Field label="Campus 2 (Brits)" k="campus2" />
          </div>
        </div>
      )}

      {tab === "Mission & Vision" && (
        <div className="grid gap-4">
          <div>
            <label className="field-label">Mission</label>
            <textarea value={s.mission} onChange={(e) => set({ mission: e.target.value })} rows={3} className="field-input" />
          </div>
          <div>
            <label className="field-label">Vision</label>
            <textarea value={s.vision} onChange={(e) => set({ vision: e.target.value })} rows={3} className="field-input" />
          </div>
        </div>
      )}

      {tab === "Social Media" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Facebook URL" k="facebook" placeholder="https://facebook.com/…" />
          <Field label="Instagram URL" k="instagram" placeholder="https://instagram.com/…" />
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
      </div>
    </div>
  );
}
