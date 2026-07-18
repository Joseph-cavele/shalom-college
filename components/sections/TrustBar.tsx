import { Users, BookOpen, Trophy, Building2 } from "lucide-react";

const STATS = [
  { icon: Users, value: "2500+", label: "Students Trained" },
  { icon: BookOpen, value: "20+", label: "Courses Offered" },
  { icon: Trophy, value: "15+", label: "Years Experience" },
  { icon: Building2, value: "2", label: "Campuses" },
];

/** Achievement stats strip below the hero. */
export function TrustBar() {
  return (
    <section className="relative z-10 -mt-8">
      <div className="container-x">
        <div
          data-reveal
          className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg2 dark:border-white/10 dark:bg-navy-800 sm:gap-8 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <s.icon className="h-6 w-6" />
              </span>
              <div>
                <div className="text-2xl font-extrabold leading-none text-brand-green">{s.value}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
