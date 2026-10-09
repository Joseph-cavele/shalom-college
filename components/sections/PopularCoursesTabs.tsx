"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { cn, money } from "@/lib/utils";
import type { Course } from "@/lib/types";

const ALL = "All";
const LIMIT = 8;

/**
 * Category tabs + compact 4-column course grid for the homepage.
 * `courses` arrive ranked most-popular first.
 */
export function PopularCoursesTabs({ courses, categories }: { courses: Course[]; categories: string[] }) {
  const [active, setActive] = useState(ALL);

  const { shown, total } = useMemo(() => {
    if (active !== ALL) {
      const inCat = courses.filter((c) => c.category === active);
      return { shown: inCat.slice(0, LIMIT), total: inCat.length };
    }
    // "All": the top course from each category first, then fill with the next most popular.
    const picks: Course[] = [];
    for (const cat of categories) {
      const top = courses.find((c) => c.category === cat);
      if (top) picks.push(top);
    }
    for (const c of courses) {
      if (picks.length >= LIMIT) break;
      if (!picks.includes(c)) picks.push(c);
    }
    return { shown: picks.slice(0, LIMIT), total: courses.length };
  }, [courses, categories, active]);

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 sm:flex-wrap" role="tablist" aria-label="Course categories">
          {[ALL, ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition",
                active === cat
                  ? "bg-brand-green text-white"
                  : "bg-navy-50 text-navy hover:bg-brand-green/10 hover:text-brand-green-dark dark:bg-white/10 dark:text-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((c) => (
          <Link
            key={c._id}
            href={`/apply?course=${encodeURIComponent(c.name)}`}
            className="group flex flex-col"
            aria-label={`Apply for ${c.name}`}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-navy-700 to-navy-light">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-3 line-clamp-2 font-bold leading-snug text-navy transition group-hover:text-brand-green-dark dark:text-slate-100">
              {c.name}
            </h3>
            <p className="mt-1 text-xs text-slate-400">{c.category}</p>
            {c.duration && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5 flex-none" aria-hidden />
                {c.duration}
              </p>
            )}
            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="font-extrabold text-brand-green-dark dark:text-brand-green">
                {money(c.fee)} <small className="text-[0.65rem] font-medium text-slate-400">{c.feeUnit}</small>
              </span>
              <ArrowRight
                className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-green"
                aria-hidden
              />
            </div>
          </Link>
        ))}
      </div>

      {active !== ALL && total > shown.length && (
        <div className="mt-8 text-center">
          <Link
            href={`/courses?cat=${encodeURIComponent(active)}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark hover:underline"
          >
            View all {total} {active} courses <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}
    </>
  );
}
