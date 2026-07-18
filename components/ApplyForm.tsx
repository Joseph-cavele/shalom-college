"use client";

import { useState } from "react";
import { User, Phone, Users, GraduationCap, FileUp } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/utils";
import type { Course } from "@/lib/types";

/** Section heading inside the application form. */
function SectionHeading({ icon: Icon, title, step }: { icon: typeof User; title: string; step: number }) {
  return (
    <div className="mb-4 mt-2 flex items-center gap-3 border-b border-slate-100 pb-2 dark:border-white/10">
      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-brand-green/10 text-brand-green">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="font-bold text-navy dark:text-slate-100">
        <span className="text-brand-green">{step}.</span> {title}
      </h3>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  full,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="field-label">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="field-input"
      />
    </div>
  );
}

function FileField({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <div>
      <label className="field-label">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type="file"
        name={name}
        required={required}
        accept="image/*,.pdf"
        className="field-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-50 file:px-3 file:py-1 file:text-navy dark:file:bg-white/10 dark:file:text-slate-200"
      />
    </div>
  );
}

/** Engineering programmes offered per N level — split into N4/N5/N6 in the course dropdown. */
const SPLIT_LEVELS_RE = /^(Electrical|Mechanical) Engineering \(N4–N6\)$/;

/** Full online application form with sections + supporting document uploads. */
export function ApplyForm({ courses, presetCourse }: { courses: Course[]; presetCourse?: string }) {
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Expand "… Engineering (N4–N6)" into one option per N level.
  const courseOptions = courses.flatMap((c) => {
    const m = c.name.match(SPLIT_LEVELS_RE);
    if (!m) return [{ key: c._id, name: c.name, fee: c.fee }];
    return ["N4", "N5", "N6"].map((lvl) => ({
      key: `${c._id}-${lvl}`,
      name: `${m[1]} Engineering ${lvl}`,
      fee: c.fee,
    }));
  });

  // An Apply link from a combined "(N4–N6)" card preselects the N4 option.
  const preset =
    presetCourse && SPLIT_LEVELS_RE.test(presetCourse)
      ? presetCourse.replace(" (N4–N6)", " N4")
      : presetCourse;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const form = e.currentTarget;
      const res = await fetch("/api/public/apply", { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus({ type: "success", msg: data.message });
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus({ type: "error", msg: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      {status && <Alert type={status.type}>{status.msg}</Alert>}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Course */}
        <div>
          <SectionHeading icon={GraduationCap} title="Course Selection" step={1} />
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Course Applying For <span className="text-rose-500">*</span></label>
              <select name="course" required defaultValue={preset || ""} className="field-input">
                <option value="">Select a course</option>
                {courseOptions.map((c) => (
                  <option key={c.key} value={c.name}>
                    {c.name} — {money(c.fee)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Preferred Campus</label>
              <select name="campus" className="field-input" defaultValue="">
                <option value="">Select campus</option>
                <option>Rustenburg</option>
                <option>Brits</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personal */}
        <div>
          <SectionHeading icon={User} title="Personal Information" step={2} />
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field label="Full Name" name="fullName" required placeholder="Full name as per ID" full />
            <Field label="SA ID or Passport Number" name="idNumber" placeholder="ID / passport number" />
            <Field label="Date of Birth" name="dateOfBirth" type="date" />
            <div>
              <label className="field-label">Gender</label>
              <select name="gender" className="field-input" defaultValue="">
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <Field label="Nationality" name="nationality" placeholder="e.g. South African" defaultValue="South African" />
            <Field label="Home Language" name="homeLanguage" placeholder="e.g. Setswana, English" />
          </div>
        </div>

        {/* Contact */}
        <div>
          <SectionHeading icon={Phone} title="Contact Details" step={3} />
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field label="Cell Phone" name="phone" required placeholder="e.g. 071 234 5678" />
            <Field label="Email Address" name="email" type="email" placeholder="you@example.com" />
            <Field label="Residential Address" name="residentialAddress" placeholder="Where you live" full />
            <Field label="Postal Address" name="postalAddress" placeholder="Postal address (if different)" full />
          </div>
        </div>

        {/* Guardian */}
        <div>
          <SectionHeading icon={Users} title="Parent / Guardian Details" step={4} />
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field label="Full Name" name="guardianName" placeholder="Parent / guardian full name" />
            <div>
              <label className="field-label">Relationship to Applicant</label>
              <select name="guardianRelationship" className="field-input" defaultValue="">
                <option value="">Select relationship</option>
                <option>Mother</option>
                <option>Father</option>
                <option>Legal Guardian</option>
                <option>Sibling</option>
                <option>Other</option>
              </select>
            </div>
            <Field label="Phone Number" name="guardianPhone" placeholder="Contact number" />
            <Field label="Email Address" name="guardianEmail" type="email" placeholder="Email address" />
            <Field label="Occupation" name="guardianOccupation" placeholder="Occupation" full />
          </div>
        </div>

        {/* Academic */}
        <div>
          <SectionHeading icon={GraduationCap} title="Academic Information" step={5} />
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field label="High School / College" name="school" placeholder="Name of institution" full />
            <Field label="Highest Qualification" name="highestQualification" placeholder="e.g. Grade 12, N3" />
            <Field label="Year Completed" name="yearCompleted" type="number" placeholder="e.g. 2023" />
          </div>
        </div>

        {/* Documents */}
        <div>
          <SectionHeading icon={FileUp} title="Supporting Documents" step={6} />
          <p className="mb-3 text-sm text-slate-500">Upload clear scans or photos (JPG, PNG or PDF, up to 5MB each).</p>
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <FileField label="Certified Copy of ID / Passport" name="docId" />
            <FileField label="Latest Academic Result / Certificate" name="docResults" />
            <FileField label="Proof of Residence" name="docResidence" />
            <FileField label="Proof of Registration Fee Payment" name="docFee" />
          </div>
        </div>

        <Button type="submit" block disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}
