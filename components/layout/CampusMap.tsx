"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/** Wide Google map with a switch between campuses (no API key needed). */
export function CampusMap({ campuses }: { campuses: { name: string; address: string }[] }) {
  const list = campuses.filter((c) => c.address);
  const [active, setActive] = useState(0);
  const current = list[active];
  if (!current) return null;

  return (
    <div>
      {list.length > 1 && (
        <div className="mb-4 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Choose a campus">
          {list.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition",
                i === active
                  ? "bg-navy text-white dark:bg-brand-green"
                  : "border border-slate-200 bg-white text-navy hover:border-brand-green dark:border-white/10 dark:bg-navy-800 dark:text-slate-200"
              )}
            >
              <MapPin className="h-4 w-4" aria-hidden />
              {c.name} Campus
            </button>
          ))}
        </div>
      )}
      <p className="mb-4 text-center text-sm text-slate-500 dark:text-slate-400">{current.address}</p>
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card dark:border-white/10">
        <iframe
          key={current.address}
          title={`${current.name} campus map`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(current.address)}&output=embed`}
          className="block h-[320px] w-full sm:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
