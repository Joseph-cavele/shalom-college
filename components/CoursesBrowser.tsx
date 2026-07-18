"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

/** Category sidebar + filterable course grid (Courses page). */
export function CoursesBrowser({ courses, initialCategory }: { courses: Course[]; initialCategory?: string }) {
  const categories = useMemo(
    () => ["All Courses", ...Array.from(new Set(courses.map((c) => c.category)))],
    [courses]
  );
  const [active, setActive] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All Courses"
  );

  const list = active === "All Courses" ? courses : courses.filter((c) => c.category === active);

  return (
    <div className="container-x grid gap-8 py-16 lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-24 h-fit rounded-xl bg-navy p-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition",
              active === c ? "bg-brand-green text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            {c}
          </button>
        ))}
      </aside>

      <div>
        <h3 className="mb-6 text-xl font-bold text-navy dark:text-slate-100">
          {active} <span className="text-slate-400">({list.length})</span>
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
