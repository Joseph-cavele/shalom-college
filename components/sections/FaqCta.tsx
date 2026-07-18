"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { IMAGES, cn } from "@/lib/utils";

const FAQS = [
  { q: "How do I apply for a course?", a: "Click Apply Online, complete the application form with your details and supporting documents, and submit. We'll contact you to confirm." },
  { q: "What are the course fees?", a: "Fees vary by programme — from R750/month for extra classes to R9,500 for artisan programmes. See each course on the Courses page." },
  { q: "How long are the courses?", a: "From 2-week short courses to 2–6 month artisan and engineering programmes. Duration is listed on every course." },
  { q: "Do you offer certificates?", a: "Yes. On successful completion you receive a recognised certificate. We are a MERSETA accredited institution." },
  { q: "Which campus should I choose?", a: "We have campuses in Rustenburg and Brits. Choose whichever is most convenient — both offer the same quality training." },
];

/** FAQ accordion beside the final call-to-action. */
export function FaqCta() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20">
      <div className="container-x grid items-start gap-10 lg:grid-cols-2">
        {/* FAQ */}
        <div data-reveal>
          <h2 className="text-2xl font-extrabold text-navy dark:text-slate-100">Frequently Asked Questions</h2>
          <div className="mt-2 h-1 w-14 rounded bg-brand-green" />
          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-navy-800">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold text-navy dark:text-slate-100"
                  aria-expanded={open === i}
                >
                  {f.q}
                  <ChevronDown className={cn("h-5 w-5 flex-none text-brand-green transition", open === i && "rotate-180")} />
                </button>
                {open === i && <p className="animate-fade-in px-5 pb-4 text-sm text-slate-500 dark:text-slate-400">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div data-reveal data-reveal-delay="120" className="relative overflow-hidden rounded-2xl bg-navy p-8 text-white dark:ring-1 dark:ring-white/10 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(53,178,51,0.25),transparent_55%)]" />
          <div className="relative z-10 max-w-sm">
            <h3 className="text-3xl font-extrabold">Ready to Build Your Future?</h3>
            <p className="mt-3 text-slate-300">
              Take the first step towards a successful career with quality practical training.
            </p>
            <div className="mt-6">
              <LinkButton href="/apply" variant="green">Apply Online Now →</LinkButton>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMAGES.cta}
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-1/2 object-cover object-top opacity-90 [mask-image:linear-gradient(to_right,transparent,black_40%)] sm:block"
          />
        </div>
      </div>
    </section>
  );
}
