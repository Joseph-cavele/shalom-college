import Link from "next/link";
import { money, courseImage } from "@/lib/utils";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { Course } from "@/lib/types";

/** Course card used on the home + courses pages. */
export function CourseCard({ course, showApply = true }: { course: Course; showApply?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg2 dark:border-white/10 dark:bg-navy-800">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-navy-700 to-navy-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.image || courseImage(course.name, course.category)}
          alt={course.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-navy shadow-sm">
          <CategoryIcon category={course.category} className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[0.68rem] font-extrabold uppercase tracking-wider text-brand-green">
          {course.category}
        </span>
        <h3 className="mb-1 mt-1 text-[1.05rem] font-bold text-navy dark:text-slate-100">{course.name}</h3>
        <p className="flex-1 text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
          <span className="text-lg font-extrabold text-navy dark:text-white">
            {money(course.fee)}
            <small className="block text-[0.62rem] font-medium text-slate-400">{course.feeUnit}</small>
          </span>
          <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy dark:bg-white/10 dark:text-slate-200">
            {course.duration || course.level}
          </span>
        </div>
        {showApply && (
          <Link
            href={`/apply?course=${encodeURIComponent(course.name)}`}
            className="btn btn-green btn-sm mt-4 w-full"
          >
            Apply Now
          </Link>
        )}
      </div>
    </article>
  );
}
