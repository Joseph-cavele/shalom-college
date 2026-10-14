"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Printer } from "lucide-react";

/** Period picker: rolling last 12 months, or a calendar year that has applications. */
export function PeriodSelect({ years, value }: { years: number[]; value: string }) {
  const router = useRouter();
  return (
    <label className="relative block rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm">
      <span className="block text-[0.65rem] font-semibold text-slate-400">Period</span>
      <select
        value={value}
        onChange={(e) => router.push(e.target.value ? `/admin?year=${e.target.value}` : "/admin")}
        className="w-36 cursor-pointer appearance-none bg-transparent pr-6 text-sm font-bold text-navy outline-none"
      >
        <option value="">Last 12 months</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-2.5 right-3 h-4 w-4 text-slate-400" />
    </label>
  );
}

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700"
      aria-label="Print dashboard"
      title="Print dashboard"
    >
      <Printer className="h-5 w-5" />
    </button>
  );
}
