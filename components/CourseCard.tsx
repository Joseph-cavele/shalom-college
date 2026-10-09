import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { money, courseImage } from "@/lib/utils";
import type { Course } from "@/lib/types";

/** Course card used on the courses page: photo, tag, title, details, Apply + price. */
export function CourseCard({ course, showApply = true }: { course: Course; showApply?: boolean }) {
  const applyHref = `/apply?course=${encodeURIComponent(course.name)}`;

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-card transition hover:-translate-y-1 hover:shadow-lg2 dark:border-white/10 dark:bg-navy-800">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-navy-700 to-navy-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.image || courseImage(course.name, course.category)}
          alt={course.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <span className="w-fit rounded-md bg-brand-green/10 px-2.5 py-1 text-[0.7rem] font-bold text-brand-green-dark dark:bg-brand-green/15 dark:text-brand-green">
          #{course.category}
        </span>

        <h3 className="mt-3 line-clamp-2 text-[1.05rem] font-bold leading-snug text-navy dark:text-slate-100">
          {course.name}
        </h3>

        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          {course.duration && (
            <li className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-none text-slate-400" aria-hidden />
              <span className="sr-only">Duration:</span>
              {course.duration}
            </li>
          )}
          {course.level && (
            <li className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 flex-none text-slate-400" aria-hidden />
              <span className="sr-only">Level:</span>
              {course.level}
            </li>
          )}
        </ul>

        {course.description && (
          <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400" title={course.description}>
            {course.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {showApply ? (
            <Link
              href={applyHref}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-green py-2 pl-4 pr-2 text-xs font-bold text-white transition hover:bg-brand-green-dark"
              aria-label={`Apply for ${course.name}`}
            >
              Apply Now
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-brand-green">
                <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          ) : (
            <span />
          )}
          <span className="text-right text-lg font-extrabold leading-tight text-navy dark:text-white">
            {money(course.fee)}
            <small className="block text-[0.65rem] font-medium text-slate-400">{course.feeUnit}</small>
          </span>
        </div>
      </div>
    </article>
  );
}
