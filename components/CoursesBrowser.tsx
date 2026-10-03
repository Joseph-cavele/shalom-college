"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

const ALL = "All Courses";

/** Category filter + search + course grid (Courses page). */
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

  // Keep the selected chip visible in the horizontal scroller (mobile/tablet).
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
    <div className="container-x grid gap-8 py-12 lg:grid-cols-[260px_1fr] lg:py-16">
      {/* Categories: horizontal chips on mobile, sticky sidebar on desktop */}
      <aside className="-mx-4 overflow-x-auto px-4 lg:sticky lg:top-24 lg:mx-0 lg:h-fit lg:overflow-visible lg:rounded-xl lg:bg-navy lg:p-2">
        <div className="flex gap-2 lg:flex-col lg:gap-0">
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              ref={active === c.name ? activeRef : undefined}
              onClick={() => setActive(c.name)}
              aria-pressed={active === c.name}
              className={cn(
                "flex shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition lg:w-full lg:whitespace-normal lg:rounded-lg lg:py-3 lg:text-left",
                active === c.name
                  ? "bg-brand-green text-white"
                  : "border border-slate-200 bg-white text-navy hover:border-brand-green lg:border-0 lg:bg-transparent lg:text-slate-300 lg:hover:bg-white/10 lg:hover:text-white dark:border-white/10 dark:bg-navy-800 dark:text-slate-200"
              )}
            >
              <span>{c.name}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.7rem] font-bold",
                  active === c.name ? "bg-white/20" : "bg-navy-50 text-navy lg:bg-white/10 lg:text-slate-300 dark:bg-white/10 dark:text-slate-300"
                )}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-navy dark:text-slate-100">
            {active} <span className="text-slate-400">({list.length})</span>
          </h2>
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search courses</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-navy outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 dark:border-white/10 dark:bg-navy-800 dark:text-slate-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-slate-400 hover:text-navy"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        {list.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-navy-800">
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
      </div>
    </div>
  );
}
