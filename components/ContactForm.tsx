"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { CATEGORY_ORDER } from "@/lib/data/courses";

const SUBJECTS = ["General Inquiry", "Application Help", "Fees Structure", ...CATEGORY_ORDER];

/** Contact-us message form. */
export function ContactForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 dark:border-white/10 dark:bg-navy-800">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green-dark dark:bg-brand-green/15 dark:text-brand-green">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden />
        Get In Touch
      </span>
      <h2 className="mt-3 text-3xl font-extrabold text-navy dark:text-slate-100">Send Us a Message</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Have a question about a course, fees or your application? Fill in the form and our team will get back to
        you as soon as possible.
      </p>

      {status && (
        <div className="mt-5">
          <Alert type={status.type}>{status.msg}</Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">Full Name <span className="text-rose-500">*</span></label>
          <input id="c-name" name="name" required maxLength={100} autoComplete="name" className="field-input" />
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">Email Address <span className="text-rose-500">*</span></label>
          <input id="c-email" type="email" name="email" required maxLength={200} autoComplete="email" className="field-input" />
        </div>
        <div>
          <label htmlFor="c-phone" className="field-label">Phone Number</label>
          <input id="c-phone" type="tel" name="phone" maxLength={30} autoComplete="tel" className="field-input" />
        </div>
        <div>
          <label htmlFor="c-subject" className="field-label">I&apos;m Interested In</label>
          <select id="c-subject" name="subject" className="field-input">
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-message" className="field-label">Message <span className="text-rose-500">*</span></label>
          <textarea
            id="c-message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            className="field-input"
            placeholder="How can we help you?"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-3 rounded-lg bg-brand-green py-2.5 pl-5 pr-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Message"}
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-brand-green">
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
