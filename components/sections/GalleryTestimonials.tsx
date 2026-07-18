import { Star, Quote } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { GALLERY } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

const TESTIMONIALS = [
  { name: "Thabo M.", role: "Engineering Student", quote: "The practical training and support I received helped me secure employment immediately." },
  { name: "Lerato K.", role: "Artisan Student", quote: "Excellent instructors, modern equipment and a great learning environment." },
  { name: "Sipho D.", role: "Mining Student", quote: "Shalom Training School gave me the skills and confidence to build my future." },
];

/** Gallery grid + student testimonials, side by side. */
export function GalleryTestimonials() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-navy-900">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div data-reveal>
          <h2 className="text-2xl font-extrabold text-navy dark:text-slate-100">Gallery</h2>
          <div className="mt-2 h-1 w-14 rounded bg-brand-green" />
          <div className="mt-6 grid grid-cols-4 gap-2.5">
            {GALLERY.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt="Training at Shalom"
                className="aspect-square w-full rounded-lg object-cover transition hover:opacity-90"
              />
            ))}
          </div>
          <div className="mt-6">
            <LinkButton href="/about" variant="ghost" size="sm">View Full Gallery</LinkButton>
          </div>
        </div>

        {/* Testimonials */}
        <div data-reveal data-reveal-delay="120">
          <h2 className="text-2xl font-extrabold text-navy dark:text-slate-100">What Our Students Say</h2>
          <div className="mt-2 h-1 w-14 rounded bg-brand-green" />
          <div className="mt-6 space-y-4">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg2 dark:border-white/10 dark:bg-navy-800">
                <Quote className="absolute right-4 top-4 h-7 w-7 text-brand-green/15" />
                <div className="mb-2 flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-slate-600 dark:text-slate-300">“{t.quote}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 dark:border-white/10">
                  <Avatar name={t.name} className="h-10 w-10 text-xs" />
                  <div>
                    <div className="text-sm font-bold text-navy dark:text-slate-100">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
