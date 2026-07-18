"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

const SUBJECTS = ["General Inquiry", "Course Information", "Application Help", "Fees Structure"];

/** Contact-us message form. */
export function ContactForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus({ type: "success", msg: data.message });
      form.reset();
    } catch (err) {
      setStatus({ type: "error", msg: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card p-8">
      <h3 className="mb-4 text-xl font-bold text-navy dark:text-slate-100">Send Us a Message</h3>
      {status && <Alert type={status.type}>{status.msg}</Alert>}
      <form onSubmit={onSubmit}>
        <div className="grid gap-x-5 sm:grid-cols-2">
          <div className="mb-4">
            <label className="field-label">Name <span className="text-rose-500">*</span></label>
            <input name="name" required className="field-input" />
          </div>
          <div className="mb-4">
            <label className="field-label">Email <span className="text-rose-500">*</span></label>
            <input type="email" name="email" required className="field-input" />
          </div>
        </div>
        <div className="mb-4">
          <label className="field-label">Subject</label>
          <select name="subject" className="field-input">
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label className="field-label">Message <span className="text-rose-500">*</span></label>
          <textarea name="message" required rows={5} className="field-input" placeholder="How can we help you?" />
        </div>
        <Button type="submit" block disabled={submitting}>
          {submitting ? "Sending…" : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
