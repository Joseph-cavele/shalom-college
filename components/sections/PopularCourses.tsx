import { Award, Users, Wrench } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PopularCoursesTabs } from "@/components/sections/PopularCoursesTabs";
import { getActiveCourses, getApplicationCounts } from "@/lib/site";
import { withCourseImages } from "@/lib/utils";
import { CATEGORY_ORDER } from "@/lib/data/courses";

const HIGHLIGHTS = [
  { icon: Award, text: "MERSETA Accredited Training" },
  { icon: Users, text: "Qualified & Experienced Instructors" },
  { icon: Wrench, text: "Hands-On Practical Skills" },
];

/** Homepage "Popular Courses": category tabs, 4-column course grid, highlights band. */
export async function PopularCourses() {
  const [courses, counts] = await Promise.all([getActiveCourses(), getApplicationCounts()]);

  // Most-applied first; ties keep the catalogue order.
  const ranked = withCourseImages(courses)
    .map((c, i) => ({ c, i, n: counts[c.name] ?? 0 }))
    .sort((a, b) => b.n - a.n || a.i - b.i)
    .map((x) => x.c);

  const categories = CATEGORY_ORDER.filter((cat) => ranked.some((c) => c.category === cat));

  return (
    <section className="py-20">
      <div className="container-x">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <h2 className="text-3xl font-extrabold text-navy dark:text-slate-100">Our Popular Courses</h2>
            <p className="mt-1 max-w-xl text-slate-500 dark:text-slate-400">
              Explore our most in-demand accredited courses and short programmes.
            </p>
          </div>
          <LinkButton href="/courses" variant="ghost" size="sm" className="self-start sm:self-auto">
            View All Courses
          </LinkButton>
        </div>

        <PopularCoursesTabs courses={ranked} categories={categories} />
      </div>

      <div className="container-x mt-16">
        <ul className="grid gap-6 rounded-2xl bg-navy px-6 py-10 text-white sm:grid-cols-3 sm:px-10" data-reveal>
          {HIGHLIGHTS.map((h) => (
            <li key={h.text} className="flex items-center justify-center gap-4 sm:justify-start lg:justify-center">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-white/20 text-brand-green">
                <h.icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="max-w-[11rem] font-bold leading-snug">{h.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
