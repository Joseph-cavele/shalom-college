"use client";

import { useState } from "react";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

/**
 * Applications-by-status donut. Status palette (validated for CVD ≥ 12);
 * every slice is directly labelled in the legend, satisfying the contrast
 * relief requirement. Per-mark hover shows the exact count.
 */
export function DonutChart({ data, size = 190 }: { data: DonutSlice[]; size?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2;
  const stroke = 26;
  const radius = r - stroke / 2 - 2;
  const circ = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const frac = d.value / total;
    const seg = { ...d, frac, dash: frac * circ, offset };
    offset += frac * circ;
    return seg;
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* track */}
          <circle cx={r} cy={r} r={radius} fill="none" stroke="#eef1f6" strokeWidth={stroke} />
          {segments.map((s, i) => (
            <circle
              key={s.label}
              cx={r}
              cy={r}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={hover === i ? stroke + 4 : stroke}
              strokeDasharray={`${s.dash} ${circ - s.dash}`}
              strokeDashoffset={-s.offset}
              transform={`rotate(-90 ${r} ${r})`}
              strokeLinecap="butt"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <div className="text-2xl font-extrabold text-navy">
            {hover === null ? total : data[hover].value}
          </div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400">
            {hover === null ? "Total" : data[hover].label}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((d, i) => (
          <div
            key={d.label}
            className="flex items-center gap-2 text-sm font-semibold text-navy"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="h-3.5 w-3.5 rounded" style={{ background: d.color }} />
            {d.label}
            <span className="text-slate-400">
              {d.value} ({Math.round((d.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
