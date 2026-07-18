import type { Metadata } from "next";
import { Target, Eye, GraduationCap, CheckCircle2 } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { getSettings } from "@/lib/site";
import { GALLERY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shalom Training School is a registered, MERSETA accredited training institution with campuses in Rustenburg and Brits, North West, South Africa.",
};

const WHY = [
  "MERSETA Accredited",
  "Qualified & Experienced Instructors",
  "Modern Equipment & Facilities",
  "Practical & Theoretical Training",
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="bg-gradient-to-r from-navy to-navy-light py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold">About Us</h1>
        <p className="mt-2 text-slate-300">Registered &amp; accredited training committed to quality practical skills.</p>
      </section>

      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
        <div data-reveal>
          <h2 className="text-3xl font-extrabold text-navy dark:text-slate-100">Who We Are</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            {settings.schoolName} is a registered and accredited training institution committed to providing
            high-quality, practical and theoretical training to equip individuals with the skills needed in
            today&apos;s industry.
          </p>
          <ul className="mt-5 grid gap-3">
            {WHY.map((w) => (
              <li key={w} className="flex items-center gap-3 font-semibold text-navy dark:text-slate-200">
                <CheckCircle2 className="h-5 w-5 flex-none text-brand-green" />
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal data-reveal-delay="120" className="grid min-h-[280px] place-items-center rounded-2xl bg-gradient-to-br from-navy-700 to-navy-light p-8 text-center text-white">
          <div>
            <GraduationCap className="mx-auto mb-4 h-16 w-16 text-brand-green" />
            <b className="text-xl tracking-wide">{settings.schoolName.toUpperCase()}</b>
            <p className="mt-1 text-slate-300">{settings.tagline} • EST {settings.established}</p>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-6 pb-16 md:grid-cols-2">
        <div className="rounded-xl bg-navy p-8 text-white">
          <h3 className="flex items-center gap-2 text-xl font-bold text-brand-green">
            <Target className="h-6 w-6" /> Our Mission
          </h3>
          <p className="mt-2 text-slate-300">{settings.mission}</p>
        </div>
        <div className="rounded-xl bg-navy p-8 text-white">
          <h3 className="flex items-center gap-2 text-xl font-bold text-brand-green">
            <Eye className="h-6 w-6" /> Our Vision
          </h3>
          <p className="mt-2 text-slate-300">{settings.vision}</p>
        </div>
      </section>

      <section className="container-x pb-20">
        <SectionTitle title="Our Gallery" subtitle="A look at our training environment and hands-on practical work." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {GALLERY.map((src, i) => (
            <div key={i} data-reveal data-reveal-delay={String((i % 3) * 90)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Training at Shalom Training School"
                loading="lazy"
                className="h-44 w-full rounded-xl object-cover shadow-card transition duration-300 hover:scale-[1.02] hover:opacity-90"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
