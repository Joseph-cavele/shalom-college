import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "purple" | "orange" | "teal";

const tones: Record<Tone, { bg: string; icon: string }> = {
  blue: { bg: "from-indigo-600 to-blue-500", icon: "text-blue-600" },
  green: { bg: "from-green-700 to-emerald-500", icon: "text-green-600" },
  purple: { bg: "from-violet-700 to-purple-500", icon: "text-violet-600" },
  orange: { bg: "from-orange-600 to-amber-500", icon: "text-orange-600" },
  teal: { bg: "from-sky-700 to-cyan-500", icon: "text-sky-600" },
};

/**
 * Gradient KPI tile: icon disc, label, headline value and a one-line footnote.
 * `trend` adds an up/down arrow to the footnote (icon + words, never colour alone).
 */
export function StatCard({
  value,
  label,
  icon: Icon,
  tone,
  note,
  trend,
}: {
  value: number | string;
  label: string;
  icon: LucideIcon;
  tone: Tone;
  note?: string;
  trend?: "up" | "down" | null;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  return (
    <div
      className={cn(
        "relative flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-card",
        tones[tone].bg
      )}
    >
      {/* soft decorative glow */}
      <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
      <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-white shadow-md">
        <Icon className={cn("h-7 w-7", tones[tone].icon)} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-[0.7rem] font-bold uppercase tracking-wide opacity-90">{label}</div>
        <div className="mt-0.5 text-3xl font-extrabold leading-none">{value}</div>
        {note && (
          <div className="mt-1.5 flex items-start gap-1 text-xs leading-snug opacity-90">
            {TrendIcon && <TrendIcon className="h-3.5 w-3.5 flex-none" />}
            <span>{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
