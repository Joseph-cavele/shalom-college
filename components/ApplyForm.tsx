"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Users,
  GraduationCap,
  FileUp,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  ShieldCheck,
  Clock,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { cn, money } from "@/lib/utils";
import { isValidSaPhone, looksLikeSaId, parseSaId } from "@/lib/sa-id";
import type { Course } from "@/lib/types";

const MAX_FILE_MB = 5;

/** Numbered form section with icon heading. */
function Section({
  icon: Icon,
  step,
  title,
  hint,
  children,
}: {
  icon: LucideIcon;
  step: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-slate-100 pt-7 first:border-t-0 first:pt-0 dark:border-white/10">
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-brand-green/10 text-brand-green-dark dark:bg-brand-green/15 dark:text-brand-green">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">Step {step} of 6</p>
          <h3 className="text-lg font-bold leading-tight text-navy dark:text-slate-100">{title}</h3>
          {hint && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
        </div>
      </div>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {children}
      {required ? <span className="text-rose-500"> *</span> : <span className="font-normal text-slate-400"> (optional)</span>}
    </label>
  );
}

function Message({ tone, children }: { tone: "error" | "ok" | "hint"; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "mt-1.5 flex items-start gap-1.5 text-xs",
        tone === "error" && "text-rose-600",
        tone === "ok" && "text-brand-green-dark dark:text-brand-green",
        tone === "hint" && "text-slate-400"
      )}
    >
      {tone === "error" && <AlertCircle className="mt-px h-3.5 w-3.5 flex-none" aria-hidden />}
      {tone === "ok" && <CheckCircle2 className="mt-px h-3.5 w-3.5 flex-none" aria-hidden />}
      <span>{children}</span>
    </p>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  full?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
};

function Field({ label, name, full, required, maxLength = 200, ...rest }: FieldProps) {
  const id = `f-${name}`;
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label htmlFor={id} required={required}>{label}</Label>
      <input id={id} name={name} required={required} maxLength={maxLength} className="field-input" {...rest} />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  placeholder,
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  placeholder: string;
  required?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const id = `f-${name}`;
  const controlled = value !== undefined ? { value, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) } : { defaultValue: "" };
  return (
    <div>
      <Label htmlFor={id} required={required}>{label}</Label>
      <select id={id} name={name} required={required} className="field-input" {...controlled}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/** Styled file picker: shows the chosen file, checks size before upload, can be cleared. */
function FileDrop({ label, name, hint }: { label: string; name: string; hint: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const id = `f-${name}`;

  function pick(f: File | undefined) {
    setError("");
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`"${f.name}" is larger than ${MAX_FILE_MB}MB. Please upload a smaller scan or photo.`);
      if (ref.current) ref.current.value = "";
      return setFile(null);
    }
    setFile(f);
  }

  function clear() {
    if (ref.current) ref.current.value = "";
    setFile(null);
    setError("");
  }

  return (
    <div>
      <span className="field-label">
        {label} <span className="font-normal text-slate-400">(optional)</span>
      </span>
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition",
          file
            ? "border-brand-green/50 bg-brand-green/5"
            : "border-slate-200 bg-slate-50/60 hover:border-brand-green/60 dark:border-white/10 dark:bg-navy-900/40",
          error && "border-rose-300"
        )}
      >
        <span
          className={cn(
            "grid h-9 w-9 flex-none place-items-center rounded-lg",
            file ? "bg-brand-green text-white" : "bg-white text-slate-400 dark:bg-white/10"
          )}
        >
          {file ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1 text-sm">
          {file ? (
            <>
              <p className="truncate font-semibold text-navy dark:text-slate-100">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-navy dark:text-slate-100">Choose file</p>
              <p className="text-xs text-slate-400">{hint}</p>
            </>
          )}
        </div>
        {file && (
          <button
            type="button"
            onClick={clear}
            className="relative z-10 grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-white hover:text-rose-600"
            aria-label={`Remove ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {/* The real input covers the box so the whole area is clickable. */}
        <input
          ref={ref}
          id={id}
          type="file"
          name={name}
          accept="image/*,.pdf"
          aria-label={label}
          onChange={(e) => pick(e.target.files?.[0])}
          className={cn("absolute inset-0 cursor-pointer opacity-0", file && "right-12")}
        />
      </div>
      {error && <Message tone="error">{error}</Message>}
    </div>
  );
}

const STUDY_MODE_OPTIONS = [
  { value: "Full-time", icon: Sun, text: "Studying is your main daily activity." },
  { value: "Part-time", icon: Moon, text: "Study while working or with other commitments." },
];

/** Engineering programmes offered per N level — split into N4/N5/N6 in the course dropdown. */
const SPLIT_LEVELS_RE = /^(Electrical|Mechanical) Engineering \(N4–N6\)$/;

type Submitted = { reference: string; emailed: boolean; course: string; studyMode: string };

/** Full online application form with sections, inline checks and document uploads. */
export function ApplyForm({
  courses,
  presetCourse,
  phone,
}: {
  courses: Course[];
  presetCourse?: string;
  /** School phone shown on the success screen. */
  phone?: string;
}) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Submitted | null>(null);

  // Expand "… Engineering (N4–N6)" into one option per N level.
  const courseOptions = courses.flatMap((c) => {
    const m = c.name.match(SPLIT_LEVELS_RE);
    if (!m) return [{ key: c._id, name: c.name, course: c }];
    return ["N4", "N5", "N6"].map((lvl) => ({ key: `${c._id}-${lvl}`, name: `${m[1]} Engineering ${lvl}`, course: c }));
  });

  // An Apply link from a combined "(N4–N6)" card preselects the N4 option.
  const preset =
    presetCourse && SPLIT_LEVELS_RE.test(presetCourse) ? presetCourse.replace(" (N4–N6)", " N4") : presetCourse;
  const [courseName, setCourseName] = useState(
    preset && courseOptions.some((o) => o.name === preset) ? preset : ""
  );
  const selected = courseOptions.find((o) => o.name === courseName)?.course;

  // SA ID: validate as you type and fill in date of birth + gender from it.
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const idInfo = looksLikeSaId(idNumber) ? parseSaId(idNumber) : null;

  function onIdChange(v: string) {
    setIdNumber(v);
    const info = looksLikeSaId(v) ? parseSaId(v) : null;
    if (info?.valid) {
      setDob(info.dateOfBirth!);
      setGender(info.gender!);
    }
  }

  const [phoneValue, setPhoneValue] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const phoneBad = phoneTouched && phoneValue.trim() !== "" && !isValidSaPhone(phoneValue);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError("");

    if (!isValidSaPhone(phoneValue)) {
      setPhoneTouched(true);
      setError("Please enter a valid South African cell phone number, e.g. 071 234 5678.");
      document.getElementById("f-phone")?.focus();
      return;
    }
    if (idInfo && !idInfo.valid) {
      setError("That South African ID number is not valid. Please check it, or leave it blank.");
      document.getElementById("f-idNumber")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const form = e.currentTarget;
      const res = await fetch("/api/public/apply", { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone({
        reference: data.reference,
        emailed: data.emailed,
        course: courseName,
        studyMode: String(new FormData(form).get("studyMode") || ""),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card sm:p-12 dark:border-white/10 dark:bg-navy-800">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-green/10 text-brand-green">
          <CheckCircle2 className="h-9 w-9" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-navy dark:text-slate-100">Application received!</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
          Thank you for applying for <b className="text-navy dark:text-slate-200">{done.course}</b>
          {done.studyMode && <> ({done.studyMode.toLowerCase()})</>}. Our admissions team
          will review your application and contact you.
        </p>
        {done.reference && (
          <div className="mx-auto mt-6 w-fit rounded-xl border border-dashed border-brand-green/50 bg-brand-green/5 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your reference number</p>
            <p className="mt-1 font-mono text-2xl font-extrabold tracking-wider text-navy dark:text-white">{done.reference}</p>
            <p className="mt-1 text-xs text-slate-400">Please keep it — quote it when you contact us.</p>
          </div>
        )}
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          {done.emailed
            ? "We've also sent a confirmation to your email address (check your spam folder if you don't see it)."
            : "You didn't give an email address, so we'll contact you by phone."}
          {phone && <> Questions? Call us on <b className="text-navy dark:text-slate-200">{phone}</b>.</>}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/courses" className="btn btn-ghost">Browse more courses</Link>
          <Link href="/" className="btn btn-green">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-navy-800">
      {/* Reassurance strip */}
      <ul className="grid gap-3 rounded-t-2xl border-b border-slate-100 bg-slate-50/70 px-6 py-4 text-xs font-semibold text-slate-600 sm:grid-cols-3 sm:px-8 dark:border-white/10 dark:bg-navy-900/40 dark:text-slate-300">
        <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-green" aria-hidden /> Takes about 10 minutes</li>
        <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-green" aria-hidden /> Email confirmation &amp; reference</li>
        <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-green" aria-hidden /> Handled in line with POPIA</li>
      </ul>

      <form onSubmit={onSubmit} className="space-y-7 p-6 sm:p-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Fields marked <span className="text-rose-500">*</span> are required. Everything else helps us process your
          application faster.
        </p>

        <Section icon={GraduationCap} step={1} title="Course Selection">
          <div className="sm:col-span-2">
            <Label htmlFor="f-course" required>Course applying for</Label>
            <select
              id="f-course"
              name="course"
              required
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="field-input"
            >
              <option value="">Select a course</option>
              {courseOptions.map((o) => (
                <option key={o.key} value={o.name}>{o.name}</option>
              ))}
            </select>
            {selected && (
              <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-navy-50 p-4 text-sm sm:grid-cols-4 dark:bg-white/5">
                <div>
                  <dt className="text-xs text-slate-400">Fee</dt>
                  <dd className="font-bold text-navy dark:text-white">{money(selected.fee)}</dd>
                  <dd className="text-[0.7rem] text-slate-400">{selected.feeUnit}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Duration</dt>
                  <dd className="font-semibold text-navy dark:text-slate-200">{selected.duration || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Level</dt>
                  <dd className="font-semibold text-navy dark:text-slate-200">{selected.level || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Category</dt>
                  <dd className="font-semibold text-navy dark:text-slate-200">{selected.category}</dd>
                </div>
              </dl>
            )}
          </div>
          <div className="sm:col-span-2">
            <span id="study-mode-label" className="field-label">
              Study mode <span className="text-rose-500">*</span>
            </span>
            <div role="radiogroup" aria-labelledby="study-mode-label" className="grid gap-3 sm:grid-cols-2">
              {STUDY_MODE_OPTIONS.map((m) => (
                <label
                  key={m.value}
                  className="group relative flex cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-200 p-4 transition hover:border-brand-green/60 has-[:checked]:border-brand-green has-[:checked]:bg-brand-green/5 dark:border-white/10"
                >
                  <input type="radio" name="studyMode" value={m.value} required className="mt-0.5 h-4 w-4 flex-none accent-brand-green" />
                  <span className="text-sm">
                    <span className="flex items-center gap-1.5 font-bold text-navy dark:text-slate-100">
                      <m.icon className="h-4 w-4 text-brand-green" aria-hidden /> {m.value}
                    </span>
                    <span className="mt-0.5 block text-slate-500 dark:text-slate-400">{m.text}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <SelectField label="Preferred campus" name="campus" placeholder="Select campus" options={["Rustenburg", "Brits"]} />
        </Section>

        <Section icon={User} step={2} title="Personal Information">
          <Field label="Full name" name="fullName" required placeholder="Full name as per ID" full autoComplete="name" />
          <div>
            <Label htmlFor="f-idNumber">SA ID or passport number</Label>
            <input
              id="f-idNumber"
              name="idNumber"
              value={idNumber}
              onChange={(e) => onIdChange(e.target.value)}
              maxLength={20}
              placeholder="13-digit ID or passport no."
              className={cn("field-input", idInfo && !idInfo.valid && "border-rose-300 focus:border-rose-400 focus:ring-rose-200")}
              aria-invalid={!!idInfo && !idInfo.valid}
            />
            {idInfo?.valid && (
              <Message tone="ok">Valid SA ID — we filled in your date of birth and gender.</Message>
            )}
            {idInfo && !idInfo.valid && (
              <Message tone="error">This ID number doesn&apos;t look right. Please check the digits.</Message>
            )}
            {!idInfo && <Message tone="hint">Non-South Africans can enter a passport number.</Message>}
          </div>
          <div>
            <Label htmlFor="f-dateOfBirth">Date of birth</Label>
            <input id="f-dateOfBirth" name="dateOfBirth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="field-input" />
          </div>
          <SelectField
            label="Gender"
            name="gender"
            placeholder="Select gender"
            options={["Male", "Female", "Other", "Prefer not to say"]}
            value={gender}
            onChange={setGender}
          />
          <Field label="Nationality" name="nationality" placeholder="e.g. South African" defaultValue="South African" />
          <Field label="Home language" name="homeLanguage" placeholder="e.g. Setswana, English" />
        </Section>

        <Section icon={Phone} step={3} title="Contact Details" hint="We'll use these to contact you about your application.">
          <div>
            <Label htmlFor="f-phone" required>Cell phone</Label>
            <input
              id="f-phone"
              name="phone"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="e.g. 071 234 5678"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              onBlur={() => setPhoneTouched(true)}
              className={cn("field-input", phoneBad && "border-rose-300")}
              aria-invalid={phoneBad}
            />
            {phoneBad && <Message tone="error">Enter a 10-digit SA number, e.g. 071 234 5678.</Message>}
          </div>
          <div>
            <Field label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <Message tone="hint">Add your email to receive a confirmation and status updates.</Message>
          </div>
          <Field label="Residential address" name="residentialAddress" placeholder="Where you live" full autoComplete="street-address" />
          <Field label="Postal address" name="postalAddress" placeholder="If different from residential" full />
        </Section>

        <Section icon={Users} step={4} title="Parent / Guardian Details" hint="Please complete this if you are under 18.">
          <Field label="Full name" name="guardianName" placeholder="Parent / guardian full name" />
          <SelectField
            label="Relationship to applicant"
            name="guardianRelationship"
            placeholder="Select relationship"
            options={["Mother", "Father", "Legal Guardian", "Sibling", "Other"]}
          />
          <Field label="Phone number" name="guardianPhone" type="tel" inputMode="tel" placeholder="Contact number" />
          <Field label="Email address" name="guardianEmail" type="email" placeholder="Email address" />
          <Field label="Occupation" name="guardianOccupation" placeholder="Occupation" full />
        </Section>

        <Section icon={GraduationCap} step={5} title="Academic Information">
          <Field label="High school / college" name="school" placeholder="Name of institution" full />
          <Field label="Highest qualification" name="highestQualification" placeholder="e.g. Grade 12, N3" />
          <Field label="Year completed" name="yearCompleted" type="number" inputMode="numeric" placeholder="e.g. 2023" />
        </Section>

        <Section
          icon={FileUp}
          step={6}
          title="Supporting Documents"
          hint={`Clear scans or phone photos are fine (JPG, PNG or PDF, up to ${MAX_FILE_MB}MB each). You can also bring them to campus later.`}
        >
          <FileDrop label="Certified copy of ID / passport" name="docId" hint="JPG, PNG or PDF" />
          <FileDrop label="Latest academic result / certificate" name="docResults" hint="JPG, PNG or PDF" />
          <FileDrop label="Proof of residence" name="docResidence" hint="JPG, PNG or PDF" />
          <FileDrop label="Proof of registration fee payment" name="docFee" hint="JPG, PNG or PDF" />
        </Section>

        {/* Consent */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-navy-900/40">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 flex-none accent-brand-green" />
            <span>
              I confirm the information I have given is true and correct, and I agree that Shalom Training School may
              use my personal information and documents to process my application and contact me about it, as
              required by the Protection of Personal Information Act (POPIA). <span className="text-rose-500">*</span>
            </span>
          </label>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-base font-bold text-white shadow-card transition hover:bg-brand-green-dark disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                Submitting — please wait…
              </>
            ) : (
              "Submit Application"
            )}
          </button>
          <p className="text-center text-xs text-slate-400">
            Your application goes straight to our admissions team. You&apos;ll get a reference number as soon as
            it&apos;s submitted.
          </p>
        </div>
      </form>
    </div>
  );
}
