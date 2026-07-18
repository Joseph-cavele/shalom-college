import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { CATEGORY_IMAGE_URL } from "@/lib/utils";

const CATEGORIES: { title: string; cat: string; duration: string; img?: string }[] = [
  { title: "Electrical Engineering (N4–N6)", cat: "Engineering Studies", duration: "3 months per N level", img: "/pexels-shameer-vayalakkad-hydrose-2602409-21812146.jpg" },
  { title: "Mechanical Engineering (N4–N6)", cat: "Engineering Studies", duration: "3 months per N level", img: "/pexels-artempodrez-8986037.jpg" },
  { title: "Mining & Construction", cat: "Mining & Construction", duration: "2 weeks" },
  { title: "MERSETA Learnership & Practical Skills", cat: "Artisan Practical Skills", duration: "2 – 6 months" },
  { title: "Computer Courses", cat: "Computer Short Courses", duration: "2 months" },
  { title: "Management Courses", cat: "Management Programmes", duration: "6 months per N level" },
  { title: "Trade Test Preparation", cat: "Trade Test Preparation", duration: "Flexible" },
  { title: "Extra Classes (Gr 4–12)", cat: "Extra Classes (FET)", duration: "3 days / week" },
];

/** Popular course categories grid. */
export function PopularCategories() {
  return (
    <section className="py-20">
      <div className="container-x">
        <SectionTitle
          title="Popular Courses"
          subtitle="Explore our accredited courses and short programmes across in-demand industries."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.title}
              href={`/courses?cat=${encodeURIComponent(c.cat)}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg2"
            >
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img ?? CATEGORY_IMAGE_URL[c.cat]}
                  alt={c.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-navy">{c.title}</h3>
                <p className="mt-1 text-sm text-slate-500">Duration: {c.duration}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-green">
                  View Course <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/courses" variant="green">View All Courses</LinkButton>
        </div>
      </div>
    </section>
  );
}
