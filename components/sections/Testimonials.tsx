import { Star, Quote } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SectionTitle } from "@/components/sections/SectionTitle";

const TESTIMONIALS = [
  {
    name: "Thabo Mokoena",
    role: "Welding Graduate",
    quote:
      "The practical welding training was hands-on from day one. I walked out with real skills and got a job at a workshop within weeks.",
  },
  {
    name: "Naledi Dlamini",
    role: "Computer Course Student",
    quote:
      "The instructors are patient and knowledgeable. I came in knowing nothing about computers and now I do data capturing with confidence.",
  },
  {
    name: "Sipho Nkosi",
    role: "Electrical Engineering (N4)",
    quote:
      "Being MERSETA accredited gave me peace of mind. The theory and practical balance is exactly what employers are looking for.",
  },
];

/** Social-proof testimonials to build applicant confidence. */
export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container-x">
        <SectionTitle
          title="What Our Students Say"
          subtitle="Real stories from learners who trained with us and started their careers."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              data-reveal
              data-reveal-delay={String(i * 100)}
              className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg2 dark:border-white/10 dark:bg-navy-800"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-green/15" />
              <div className="mb-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
                <Avatar name={t.name} />
                <div>
                  <div className="font-bold text-navy dark:text-slate-100">{t.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
