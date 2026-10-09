import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

const styles: Record<ApplicationStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Contacted: "bg-blue-100 text-blue-700",
  Registered: "bg-green-100 text-green-700",
  Rejected: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={cn("badge", styles[status])}>{status}</span>;
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span className={cn("badge", active ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700")}>
      {active ? "Active" : "Hidden"}
    </span>
  );
}
