import { Award, HardHat, Wrench, TrendingUp, type LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Award, title: "MERSETA Accredited", text: "Recognised, quality-assured training." },
  { icon: HardHat, title: "Experienced Instructors", text: "Qualified, industry-ready trainers." },
  { icon: Wrench, title: "Modern Facilities", text: "Up-to-date equipment & workshops." },
  { icon: TrendingUp, title: "Practical & Theory", text: "Skills that get you working." },
];

/** "Why choose us" feature strip. */
export function Features() {
  return (
    <section className="container-x grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f) => (
        <div key={f.title} className="rounded-xl bg-white p-6 text-center shadow-card">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-green/10 text-brand-green">
            <f.icon className="h-7 w-7" />
          </div>
          <h4 className="font-bold text-navy">{f.title}</h4>
          <p className="mt-1 text-sm text-slate-500">{f.text}</p>
        </div>
      ))}
    </section>
  );
}
