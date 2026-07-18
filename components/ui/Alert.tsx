import { cn } from "@/lib/utils";

interface AlertProps {
  type?: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

/** Inline success/error message block. Render conditionally. */
export function Alert({ type = "success", children, className }: AlertProps) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "mb-4 rounded-lg px-4 py-3 text-sm font-semibold",
        type === "success" ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800",
        className
      )}
    >
      {children}
    </div>
  );
}
