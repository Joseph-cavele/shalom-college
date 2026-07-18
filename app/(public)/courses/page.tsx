import type { Metadata } from "next";
import { CoursesBrowser } from "@/components/CoursesBrowser";
import { getActiveCourses } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Courses",
  description:
    "Browse MERSETA accredited engineering (N4–N6), artisan, welding, mining machinery, computer and management courses with fees and durations. Apply online.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const [{ cat }, courses] = await Promise.all([searchParams, getActiveCourses()]);

  return (
    <>
      <section className="bg-gradient-to-r from-navy to-navy-light py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold">Our Courses</h1>
        <p className="mt-2 text-slate-300">Explore our wide range of accredited courses and short programmes.</p>
      </section>
      <CoursesBrowser courses={courses} initialCategory={cat} />
    </>
  );
}
