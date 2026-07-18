"use client";

import { useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Applications-over-time line (single series → one hue, no legend; the title
 * names it). Recessive grid, 2px line, hover crosshair + tooltip.
 */
export function LineChart({ monthly }: { monthly: number[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 640;
  const H = 240;
  const pad = { top: 20, right: 20, bottom: 28, left: 32 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const max = Math.max(4, ...monthly);
  const x = (i: number) => pad.left + (plotW * i) / (MONTHS.length - 1);
  const y = (v: number) => pad.top + plotH - (plotH * v) / max;

  const line = monthly.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L ${x(MONTHS.length - 1)} ${pad.top + plotH} L ${x(0)} ${pad.top + plotH} Z`;
  const ticks = 4;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Applications per month">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#35b233" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#35b233" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* recessive gridlines + y labels */}
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const v = Math.round((max / ticks) * (ticks - i));
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

        {/* x labels */}
        {MONTHS.map((m, i) => (
          <text key={m} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
            {m}
          </text>
        ))}

        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke="#35b233" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* crosshair + active marker */}
        {hover !== null && (
          <line x1={x(hover)} y1={pad.top} x2={x(hover)} y2={pad.top + plotH} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
        )}
        {monthly.map((v, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(v)}
            r={hover === i ? 5 : 3.5}
            fill="#fff"
            stroke="#35b233"
            strokeWidth={2}
            className="transition-all"
          />
        ))}

        {/* invisible hover targets */}
        {MONTHS.map((_, i) => (
          <rect
            key={i}
            x={x(i) - plotW / (MONTHS.length - 1) / 2}
            y={pad.top}
            width={plotW / (MONTHS.length - 1)}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-lg2"
          style={{ left: `${(x(hover) / W) * 100}%`, top: 0 }}
        >
          {MONTHS[hover]}: {monthly[hover]} application{monthly[hover] === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
