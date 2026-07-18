"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api } from "@/lib/client";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import type { SiteSettings, Banner } from "@/lib/types";

export default function ContentPage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ settings: SiteSettings }>("/api/admin/settings").then((d) => setS(d.settings));
  }, []);

  if (!s) return <div className="card p-8 text-center text-slate-400">Loading…</div>;

  const set = (patch: Partial<SiteSettings>) => setS({ ...s, ...patch });
  const setBanner = (i: number, patch: Partial<Banner>) =>
    set({ banners: s.banners.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });
  const addBanner = () => set({ banners: [...s.banners, { title: "New banner", active: true }] });
  const removeBanner = (i: number) => set({ banners: s.banners.filter((_, idx) => idx !== i) });
  const setWhy = (i: number, val: string) => set({ whyChoose: s.whyChoose.map((w, idx) => (idx === i ? val : w)) });

  async function save() {
    setSaving(true);
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        body: {
          heroTitle: s!.heroTitle,
          heroSubtitle: s!.heroSubtitle,
          heroText: s!.heroText,
          whyChoose: s!.whyChoose,
          banners: s!.banners,
        },
      });
      toast("Website content saved");
    } catch (e) {
      toast((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="mb-4 text-lg font-bold text-navy">Hero Section</h3>
        <div className="grid gap-4">
          <div>
            <label className="field-label">Hero Title</label>
            <input value={s.heroTitle} onChange={(e) => set({ heroTitle: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Hero Subtitle</label>
            <input value={s.heroSubtitle} onChange={(e) => set({ heroSubtitle: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Hero Text</label>
            <textarea value={s.heroText} onChange={(e) => set({ heroText: e.target.value })} rows={3} className="field-input" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 text-lg font-bold text-navy">Why Choose Us</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {s.whyChoose.map((w, i) => (
            <input key={i} value={w} onChange={(e) => setWhy(i, e.target.value)} className="field-input" />
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy">Banner Management</h3>
          <button onClick={addBanner} className="btn btn-ghost btn-sm">+ Add Banner</button>
        </div>
        <div className="space-y-3">
          {s.banners.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <input value={b.title} onChange={(e) => setBanner(i, { title: e.target.value })} className="field-input flex-1" />
              <label className="flex items-center gap-1 text-sm text-slate-600">
                <input type="checkbox" checked={b.active} onChange={(e) => setBanner(i, { active: e.target.checked })} />
                Active
              </label>
              <button onClick={() => removeBanner(i)} className="grid h-9 w-9 place-items-center rounded-md bg-rose-600 text-white" title="Delete banner">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {s.banners.length === 0 && <p className="text-sm text-slate-400">No banners. Add one above.</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
      </div>
    </div>
  );
}
