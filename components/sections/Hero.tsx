import { BadgeCheck, Users, Wrench } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { HERO_IMAGE_URL } from "@/lib/utils";

const MINI = [
  { icon: BadgeCheck, label: "MERSETA Accredited" },
  { icon: Users, label: "Experienced Instructors" },
  { icon: Wrench, label: "Modern Equipment" },
];

// Full-bleed welding background photo.
const HERO_BG = HERO_IMAGE_URL;

/** Full-background hero: welding photo covers the section, content overlaid. */
export function Hero() {
  return (
    <header className="relative isolate overflow-hidden bg-navy text-white">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_BG}
        alt="Practical welding training at Shalom Training School"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Overlays for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/90 to-navy/50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,rgba(53,178,51,0.22),transparent_55%)]" />

      <div className="container-x py-24 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <p className="animate-fade-up text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">
            Quality Training. Better Future.
          </p>
          <h1 className="mt-3 animate-fade-up text-4xl font-extrabold leading-[1.05] [animation-delay:100ms] sm:text-5xl lg:text-6xl">
            Build Your Future <span className="block text-brand-green">With Practical Skills Training</span>
          </h1>
          <p className="mt-5 max-w-lg animate-fade-up text-lg text-slate-200 [animation-delay:200ms]">
            Become industry-ready through accredited practical and theoretical training in welding, engineering,
            artisan and mining skills.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]">
            <LinkButton href="/apply" variant="green">Apply Now →</LinkButton>
            <LinkButton href="/courses" variant="outline">View Courses</LinkButton>
          </div>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-x-8 gap-y-3 [animation-delay:400ms]">
            {MINI.map((m) => (
              <div key={m.label} className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <m.icon className="h-5 w-5 text-brand-green" />
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
