"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

const ALL = "All Courses";

/** Category filter + search + 3-column course grid (Courses page). */
export function CoursesBrowser({ courses, initialCategory }: { courses: Course[]; initialCategory?: string }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of courses) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    return [{ name: ALL, count: courses.length }, ...Array.from(counts, ([name, count]) => ({ name, count }))];
  }, [courses]);

  const [active, setActive] = useState(
    initialCategory && categories.some((c) => c.name === initialCategory) ? initialCategory : ALL
  );
  const [query, setQuery] = useState("");
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep the selected chip visible in the horizontal scroller on small screens.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (active === ALL || c.category === active) &&
        (!q || `${c.name} ${c.category} ${c.description}`.toLowerCase().includes(q))
    );
  }, [courses, active, query]);

  return (
    <section className="container-x py-12 lg:py-16">
      {/* Search */}
      <div className="mx-auto max-w-xl">
        <label className="relative block">
          <span className="sr-only">Search courses</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-navy shadow-card outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 dark:border-white/10 dark:bg-navy-800 dark:text-slate-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-navy dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      {/* Categories: scrollable row on mobile, wrapped and centred on larger screens */}
      <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex gap-2 sm:flex-wrap sm:justify-center">
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              ref={active === c.name ? activeRef : undefined}
              onClick={() => setActive(c.name)}
              aria-pressed={active === c.name}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition",
                active === c.name
                  ? "bg-navy text-white dark:bg-brand-green"
                  : "border border-slate-200 bg-white text-navy hover:border-brand-green hover:text-brand-green-dark dark:border-white/10 dark:bg-navy-800 dark:text-slate-200"
              )}
            >
              {c.name}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.7rem] font-bold",
                  active === c.name ? "bg-white/20" : "bg-navy-50 text-navy dark:bg-white/10 dark:text-slate-300"
                )}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        Showing <span className="font-bold text-navy dark:text-slate-100">{list.length}</span>{" "}
        {list.length === 1 ? "course" : "courses"}
        {active !== ALL && (
          <>
            {" "}in <span className="font-bold text-navy dark:text-slate-100">{active}</span>
          </>
        )}
      </p>

      {list.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-navy-800">
          <p className="font-semibold text-navy dark:text-slate-100">No courses found</p>
          <p className="mt-1 text-sm text-slate-500">Try a different search or category.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActive(ALL);
            }}
            className="btn btn-green btn-sm mt-5"
          >
            Show all courses
          </button>
        </div>
      )}
    </section>
  );
}
