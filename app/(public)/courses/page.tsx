import type { Metadata } from "next";
import { CoursesBrowser } from "@/components/CoursesBrowser";
import { PageHero } from "@/components/layout/PageHero";
import { getActiveCourses } from "@/lib/site";
import { withCourseImages } from "@/lib/utils";

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
      <PageHero
        title="Our Courses"
        crumb="Courses"
        intro="Explore our wide range of accredited courses and short programmes."
      />
      <CoursesBrowser key={cat ?? "all"} courses={withCourseImages(courses)} initialCategory={cat} />
    </>
  );
}
