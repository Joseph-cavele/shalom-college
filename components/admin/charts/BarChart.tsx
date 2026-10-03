"use client";

import { useState } from "react";

/**
 * Applications-per-month bars (single series → one hue, no legend; the title
 * names it). Recessive grid, rounded bars, hover highlight + tooltip.
 * The current (last) month is drawn solid; earlier months slightly lighter.
 */
export function BarChart({ data }: { data: { label: string; title: string; value: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 640;
  const H = 240;
  const pad = { top: 20, right: 12, bottom: 28, left: 32 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const ticks = 4;
  // Round the axis up to a multiple of the tick count so labels are whole numbers.
  const max = Math.max(ticks, Math.ceil(Math.max(0, ...data.map((d) => d.value)) / ticks) * ticks);
  const slot = plotW / data.length;
  const barW = Math.min(32, slot * 0.6);
  const cx = (i: number) => pad.left + slot * i + slot / 2;
  const barH = (v: number) => (plotH * v) / max;
  const last = data.length - 1;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Applications per month">
        {/* recessive gridlines + y labels */}
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const v = (max / ticks) * (ticks - i);
          const gy = pad.top + (plotH * i) / ticks;
          return (
            <g key={i}>
              <line x1={pad.left} y1={gy} x2={W - pad.right} y2={gy} stroke="#eef1f6" strokeWidth={1} />
              <text x={pad.left - 8} y={gy + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                {v}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const h = barH(d.value);
          const r = Math.min(4, h / 2);
          const x0 = cx(i) - barW / 2;
          const y0 = pad.top + plotH - h;
          return (
            <g key={d.title}>
              {/* bar with rounded top corners only */}
              {h > 0 && (
                <path
                  d={`M ${x0} ${y0 + h} V ${y0 + r} Q ${x0} ${y0} ${x0 + r} ${y0} H ${x0 + barW - r} Q ${x0 + barW} ${y0} ${x0 + barW} ${y0 + r} V ${y0 + h} Z`}
                  fill={hover === i ? "#0B1F45" : "#35b233"}
                  fillOpacity={hover === i || i === last ? 1 : 0.75}
                  className="transition-colors"
                />
              )}
              <text
                x={cx(i)}
                y={H - 8}
                textAnchor="middle"
                fontSize="10"
                fill={i === last ? "#0B1F45" : "#94a3b8"}
                fontWeight={i === last ? 700 : 400}
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* baseline */}
        <line x1={pad.left} y1={pad.top + plotH} x2={W - pad.right} y2={pad.top + plotH} stroke="#cbd5e1" strokeWidth={1} />

        {/* invisible hover targets (full column, easier to hit than the bar) */}
        {data.map((d, i) => (
          <rect
            key={d.title}
            x={pad.left + slot * i}
            y={pad.top}
            width={slot}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-lg2"
          style={{
            left: `${(cx(hover) / W) * 100}%`,
            top: `${((pad.top + plotH - barH(data[hover].value)) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 6px))",
          }}
        >
          {data[hover].title}: {data[hover].value} application{data[hover].value === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
