"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Admin {
  fullName: string;
  email: string;
}

export default function ProfilePage() {
  const [admin, setAdmin] = useState<Admin>({ fullName: "", email: "" });
  const [tab, setTab] = useState<"profile" | "password">("profile");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ admin: Admin }>("/api/admin/profile").then((d) => setAdmin({ fullName: d.admin.fullName, email: d.admin.email }));
  }, []);

  async function saveProfile() {
    setSaving(true);
    try {
      await api("/api/admin/profile", { method: "PUT", body: { fullName: admin.fullName, email: admin.email } });
      toast("Profile updated");
    } catch (e) {
      toast((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (pw.newPassword.length < 6) return toast("New password must be at least 6 characters.", false);
    if (pw.newPassword !== pw.confirm) return toast("Passwords do not match.", false);
    setSaving(true);
    try {
      await api("/api/admin/profile", {
        method: "PUT",
        body: { currentPassword: pw.currentPassword, newPassword: pw.newPassword },
      });
      toast("Password changed");
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      toast((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card mx-auto max-w-2xl p-6">
      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {(["profile", "password"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "border-b-[3px] px-4 py-2.5 text-sm font-bold capitalize transition",
              tab === t ? "border-brand-green text-navy" : "border-transparent text-slate-400 hover:text-navy"
            )}
          >
            {t === "profile" ? "Profile" : "Change Password"}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <div className="grid gap-4">
          <div>
            <label className="field-label">Full Name</label>
            <input value={admin.fullName} onChange={(e) => setAdmin({ ...admin, fullName: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} className="field-input" />
          </div>
          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving…" : "Update Profile"}</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <div>
            <label className="field-label">Current Password</label>
            <input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">New Password</label>
            <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Confirm New Password</label>
            <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="field-input" />
          </div>
          <div className="flex justify-end">
            <Button onClick={changePassword} disabled={saving}>{saving ? "Saving…" : "Update Password"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
