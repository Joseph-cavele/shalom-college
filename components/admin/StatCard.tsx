import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Tone = "blue" | "green" | "purple" | "orange";

const tones: Record<Tone, string> = {
  blue: "from-blue-600 to-brand-blue",
  green: "from-green-600 to-brand-green",
  purple: "from-violet-600 to-purple-500",
  orange: "from-orange-600 to-amber-500",
};

export function StatCard({
  value,
  label,
  icon: Icon,
  tone,
}: {
  value: number | string;
  label: string;
  icon: LucideIcon;
  tone: Tone;
}) {
  return (
    <div className={cn("flex items-center justify-between rounded-xl bg-gradient-to-br p-5 text-white shadow-card", tones[tone])}>
      <div>
        <div className="text-3xl font-extrabold leading-none">{value}</div>
        <div className="mt-1.5 text-[0.82rem] opacity-90">{label}</div>
      </div>
      <Icon className="h-8 w-8 opacity-85" strokeWidth={1.75} />
    </div>
  );
}
