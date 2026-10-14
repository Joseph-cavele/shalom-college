"use client";

import { useState } from "react";

/**
 * Horizontal bars for long category names (single series → one hue, no legend;
 * the panel title names it). Each row is directly labelled with its count.
 */
export function HBarChart({ data }: { data: { label: string; value: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <ul className="flex flex-col gap-3.5">
      {data.map((d, i) => (
        <li
          key={d.label}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          title={`${d.label}: ${d.value} application${d.value === 1 ? "" : "s"} (${Math.round((d.value / total) * 100)}%)`}
        >
          <div className="mb-1 flex items-baseline justify-between gap-3 text-[0.8rem]">
            <span className="truncate font-semibold text-navy">{d.label}</span>
            <span className="flex-none font-bold text-slate-500">{d.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(d.value / max) * 100}%`,
                minWidth: d.value > 0 ? 6 : 0,
                background: hover === i ? "#0B1F45" : "#4f46e5",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
