"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, ImageIcon } from "lucide-react";
import { api } from "@/lib/client";
import { toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ActiveBadge } from "@/components/ui/StatusBadge";
import { money, withCourseImages } from "@/lib/utils";
import { CATEGORY_ORDER } from "@/lib/data/courses";
import type { Course } from "@/lib/types";

const EMPTY: Partial<Course> = {
  name: "",
  category: CATEGORY_ORDER[0],
  duration: "",
  fee: 0,
  feeUnit: "per course",
  level: "",
  description: "",
  image: "",
  active: true,
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Course>>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Display-only: fills auto photos for the table without touching saved data.
  const withImages = useMemo(() => withCourseImages(courses), [courses]);

  async function load() {
    setLoading(true);
    const data = await api<{ courses: Course[] }>("/api/admin/courses");
    setCourses(data.courses);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(EMPTY);
    setOpen(true);
  }
  function openEdit(c: Course) {
    setEditing(c);
    setOpen(true);
  }

  async function save() {
    // Ignore repeat clicks while a save is in flight, or the course is created twice.
    if (saving) return;
    if (!editing.name?.trim() || !editing.category) {
      toast("Name and category are required.", false);
      return;
    }
    if (uploading) {
      toast("Please wait for the image to finish uploading.", false);
      return;
    }
    setSaving(true);
    try {
      if (editing._id) {
        await api(`/api/admin/courses/${editing._id}`, { method: "PUT", body: editing });
        toast("Course updated");
      } else {
        await api("/api/admin/courses", { method: "POST", body: editing });
        toast("Course added");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast((e as Error).message, false);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this course?")) return;
    await api(`/api/admin/courses/${id}`, { method: "DELETE" });
    setCourses((prev) => prev.filter((c) => c._id !== id));
    toast("Course deleted");
  }

  async function toggleActive(c: Course) {
    await api(`/api/admin/courses/${c._id}`, { method: "PUT", body: { active: !c.active } });
    setCourses((prev) => prev.map((x) => (x._id === c._id ? { ...x, active: !x.active } : x)));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await api<{ url: string }>("/api/admin/upload", { method: "POST", body: fd });
      setEditing((prev) => ({ ...prev, image: url }));
      toast("Image uploaded");
    } catch (e) {
      toast((e as Error).message, false);
    } finally {
      setUploading(false);
    }
  }

  const set = (patch: Partial<Course>) => setEditing((prev) => ({ ...prev, ...patch }));

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">Courses ({courses.length})</h3>
        <Button onClick={openNew}>+ Add New Course</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-2 py-3">Course Name</th>
              <th className="px-2 py-3">Category</th>
              <th className="px-2 py-3">Duration</th>
              <th className="px-2 py-3">Fee</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {withImages.map((c) => (
              <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-10 w-14 flex-none rounded-md object-cover"
                    />
                    <span className="font-semibold text-navy">{c.name}</span>
                  </div>
                </td>
                <td className="px-2 py-3 text-slate-600">{c.category}</td>
                <td className="px-2 py-3 text-slate-600">{c.duration || "—"}</td>
                <td className="px-2 py-3 font-semibold text-navy">{money(c.fee)}</td>
                <td className="px-2 py-3">
                  <button onClick={() => toggleActive(c)} title="Toggle visibility">
                    <ActiveBadge active={c.active} />
                  </button>
                </td>
                <td className="px-2 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="grid h-7 w-7 place-items-center rounded-md bg-brand-blue text-white" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(c._id)} className="grid h-7 w-7 place-items-center rounded-md bg-rose-600 text-white" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">Loading…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editing._id ? "Edit Course" : "Add New Course"}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="btn btn-ghost">Cancel</button>
            <Button onClick={save} disabled={saving || uploading}>
              {saving ? "Saving…" : "Save Course"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label">Course Image</label>
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-28 flex-none place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-2xl text-slate-300">
                {editing.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editing.image} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-7 w-7" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                  className="text-sm"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {uploading ? "Uploading…" : "JPG/PNG up to 5MB. Leave empty to use an auto photo."}
                </p>
                {editing.image && (
                  <button type="button" onClick={() => set({ image: "" })} className="mt-1 text-xs font-semibold text-rose-600 hover:underline">
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Course Name</label>
            <input value={editing.name || ""} onChange={(e) => set({ name: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Category</label>
            <select value={editing.category} onChange={(e) => set({ category: e.target.value })} className="field-input">
              {CATEGORY_ORDER.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Level</label>
            <input value={editing.level || ""} onChange={(e) => set({ level: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Duration</label>
            <input value={editing.duration || ""} onChange={(e) => set({ duration: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Fee (R)</label>
            <input type="number" value={editing.fee ?? 0} onChange={(e) => set({ fee: Number(e.target.value) })} className="field-input" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Fee Unit</label>
            <input value={editing.feeUnit || ""} onChange={(e) => set({ feeUnit: e.target.value })} className="field-input" placeholder="per course / per subject / month" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea value={editing.description || ""} onChange={(e) => set({ description: e.target.value })} rows={3} className="field-input" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
