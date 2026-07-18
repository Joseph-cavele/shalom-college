import Link from "next/link";
import { Cog, Truck, Wrench, Laptop, BarChart3, ClipboardCheck, type LucideIcon } from "lucide-react";

const CATS: { icon: LucideIcon; title: string; cat: string }[] = [
  { icon: Cog, title: "Engineering Courses", cat: "Engineering Studies" },
  { icon: Truck, title: "Mining & Construction", cat: "Mining & Construction" },
  { icon: Wrench, title: "Artisan Skills", cat: "Artisan Practical Skills" },
  { icon: Laptop, title: "Computer Courses", cat: "Computer Short Courses" },
  { icon: BarChart3, title: "Management Courses", cat: "Management Programmes" },
  { icon: ClipboardCheck, title: "Trade Test Preparation", cat: "Trade Test Preparation" },
];

/** Navy band of training-category shortcuts. */
export function TrainingCategories() {
  return (
    <section className="bg-navy py-16">
      <div className="container-x">
        <h2 className="text-center text-3xl font-extrabold text-white">Our Training Categories</h2>
        <div className="mx-auto mt-2 h-1 w-16 rounded bg-brand-green" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATS.map((c, i) => (
            <Link
              key={c.title}
              data-reveal
              data-reveal-delay={String(i * 70)}
              href={`/courses?cat=${encodeURIComponent(c.cat)}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-navy-800 p-5 text-center transition hover:border-brand-green hover:bg-navy-700"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-brand-green/40 text-brand-green transition group-hover:bg-brand-green group-hover:text-white">
                <c.icon className="h-7 w-7" />
              </span>
              <span className="text-sm font-bold uppercase tracking-wide text-slate-200">{c.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
