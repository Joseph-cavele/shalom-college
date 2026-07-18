import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { ApplyForm } from "@/components/ApplyForm";
import { getActiveCourses, getSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply Online",
  description:
    "Apply online to Shalom Training School in minutes. Choose your course and campus, upload your documents and receive email confirmation.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const [{ course }, courses, settings] = await Promise.all([
    searchParams,
    getActiveCourses(),
    getSettings(),
  ]);

  return (
    <>
      <section className="bg-gradient-to-r from-navy to-navy-light py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold">Apply Online</h1>
        <p className="mt-2 text-slate-300">Fill in the form below to apply for your preferred course.</p>
      </section>

      <section className="container-x grid gap-8 py-16 lg:grid-cols-[1fr_320px]">
        <ApplyForm courses={courses} presetCourse={course} />

        <aside className="h-fit rounded-xl bg-navy p-7 text-white">
          <h3 className="text-xl font-bold">Need Help?</h3>
          <p className="mt-1 text-sm text-slate-300">Contact us for more information about your application.</p>
          <div className="mt-4 flex gap-3 text-sm text-slate-300">
            <Phone className="h-5 w-5 flex-none text-brand-green" />
            <div>{settings.phone1}<br />{settings.phone2}</div>
          </div>
          <div className="mt-3 flex gap-3 text-sm text-slate-300">
            <Mail className="h-5 w-5 flex-none text-brand-green" />
            <div>{settings.email}</div>
          </div>
          <hr className="my-5 border-white/15" />
          <h3 className="text-base font-bold">Visit Our Campuses</h3>
          <div className="mt-3 flex gap-3 text-sm text-slate-300">
            <MapPin className="h-5 w-5 flex-none text-brand-green" />
            <div>{settings.campus1}</div>
          </div>
          <div className="mt-3 flex gap-3 text-sm text-slate-300">
            <MapPin className="h-5 w-5 flex-none text-brand-green" />
            <div>{settings.campus2}</div>
          </div>
        </aside>
      </section>
    </>
  );
}
