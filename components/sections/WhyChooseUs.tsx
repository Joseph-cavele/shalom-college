import { GraduationCap, Wrench, Users, Briefcase, Building2, Award, type LucideIcon } from "lucide-react";
import { IMAGES } from "@/lib/utils";

const REASONS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: GraduationCap, title: "Accredited Training", text: "MERSETA accredited programs you can trust." },
  { icon: Wrench, title: "Practical Workshops", text: "Hands-on training with real industry equipment." },
  { icon: Users, title: "Experienced Trainers", text: "Qualified instructors with industry experience." },
  { icon: Briefcase, title: "Job Ready Skills", text: "Gain skills employers are looking for." },
  { icon: Building2, title: "Modern Facilities", text: "Well-equipped labs and workshops." },
  { icon: Award, title: "Industry Recognised", text: "Nationally recognised qualifications." },
];

/** Why-choose section: image + six reasons. */
export function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-navy-900">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMAGES.whyChoose}
            alt="Students in a practical training workshop"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg2"
          />
        </div>

        <div data-reveal data-reveal-delay="120">
          <p className="text-sm font-extrabold uppercase tracking-widest text-brand-green">Why Choose Us</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy dark:text-slate-100 sm:text-4xl">Why Choose Shalom?</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {REASONS.map((r) => (
              <div
                key={r.title}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lg2 dark:border-white/10 dark:bg-navy-800"
              >
                <span className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-brand-green/10 text-brand-green">
                  <r.icon className="h-5 w-5" />
                </span>
                <h4 className="font-bold text-navy dark:text-slate-100">{r.title}</h4>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
