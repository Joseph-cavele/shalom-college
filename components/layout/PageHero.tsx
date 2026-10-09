import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { IMAGES } from "@/lib/utils";

/** Inner-page header: photo background, breadcrumb, title and intro line. */
export function PageHero({
  title,
  crumb,
  intro,
  image = IMAGES.hero,
}: {
  title: string;
  crumb: string;
  intro?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy py-20 text-center text-white sm:py-24">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 via-navy/80 to-navy" aria-hidden />
      <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-sm text-slate-300">
        <Link href="/" className="transition hover:text-white">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span aria-current="page" className="font-semibold text-white">{crumb}</span>
      </nav>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{title}</h1>
      {intro && <p className="mx-auto mt-3 max-w-xl px-4 text-slate-300">{intro}</p>}
    </section>
  );
}
