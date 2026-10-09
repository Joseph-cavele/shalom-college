import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { ApplyForm } from "@/components/ApplyForm";
import { PageHero } from "@/components/layout/PageHero";
import { getActiveCourses, getSettings } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Apply Online",
  description:
    "Apply online to Shalom Training School in minutes. Choose your course and campus, upload your documents and receive email confirmation.",
};

const NEXT_STEPS = [
  { title: "Submit your application", text: "You get a reference number straight away, plus an email if you gave one." },
  { title: "We review it", text: "Our admissions team checks your details and documents." },
  { title: "We contact you", text: "We call or email you about registration, fees and your start date." },
];

const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const [{ course }, courses, settings] = await Promise.all([searchParams, getActiveCourses(), getSettings()]);
  const whatsappNumber = process.env.PHONE_NUMBER || settings.whatsapp;
  const phones = [settings.phone1, settings.phone2].filter(Boolean);

  return (
    <>
      <PageHero
        title="Apply Online"
        crumb="Apply"
        intro="Fill in the form below to apply for your preferred course."
      />

      <section className="container-x grid items-start gap-8 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
        <ApplyForm courses={courses} presetCourse={course} phone={settings.phone1} />

        <aside className="space-y-6 lg:sticky lg:top-24">
          {/* Credentials */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-navy-800">
            <h2 className="font-extrabold text-navy dark:text-slate-100">Apply with confidence</h2>
            <ul className="mt-4 space-y-4 text-sm">
              {settings.accreditation && (
                <li className="flex gap-3">
                  <BadgeCheck className="h-5 w-5 flex-none text-brand-green" aria-hidden />
                  <div>
                    <p className="font-bold text-navy dark:text-slate-200">{settings.accreditation}</p>
                    <p className="text-slate-500 dark:text-slate-400">Accredited practical skills training.</p>
                  </div>
                </li>
              )}
              {settings.regNo && (
                <li className="flex gap-3">
                  <Building2 className="h-5 w-5 flex-none text-brand-green" aria-hidden />
                  <div>
                    <p className="font-bold text-navy dark:text-slate-200">Registered company</p>
                    <p className="text-slate-500 dark:text-slate-400">Reg. No. {settings.regNo}</p>
                  </div>
                </li>
              )}
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 flex-none text-brand-green" aria-hidden />
                <div>
                  <p className="font-bold text-navy dark:text-slate-200">Two physical campuses</p>
                  <p className="text-slate-500 dark:text-slate-400">{settings.campus1}</p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">{settings.campus2}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="h-5 w-5 flex-none text-brand-green" aria-hidden />
                <div>
                  <p className="font-bold text-navy dark:text-slate-200">Your privacy</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Your details are used only to process your application and are never sold or shared for marketing.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* What happens next */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-navy-800">
            <h2 className="font-extrabold text-navy dark:text-slate-100">What happens next?</h2>
            <ol className="mt-4 space-y-4">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-navy text-xs font-bold text-white dark:bg-brand-green">
                    {i + 1}
                  </span>
                  <div className="text-sm">
                    <p className="font-bold text-navy dark:text-slate-200">{s.title}</p>
                    <p className="text-slate-500 dark:text-slate-400">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Help */}
          <div className="rounded-2xl bg-navy p-6 text-white">
            <h2 className="font-extrabold">Need help applying?</h2>
            <p className="mt-1 text-sm text-slate-300">Talk to a real person — we&apos;re happy to help.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {phones.map((p) => (
                <li key={p}>
                  <a href={tel(p)} className="flex items-center gap-2 text-slate-200 hover:text-white">
                    <Phone className="h-4 w-4 text-brand-green" aria-hidden /> {p}
                  </a>
                </li>
              ))}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 break-all text-slate-200 hover:text-white">
                    <Mail className="h-4 w-4 flex-none text-brand-green" aria-hidden /> {settings.email}
                  </a>
                </li>
              )}
            </ul>
            {whatsappNumber && (
              <a
                href={whatsappLink(whatsappNumber, "Hello Shalom Training School, I need help with my application.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1ebe5b]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp us
              </a>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
