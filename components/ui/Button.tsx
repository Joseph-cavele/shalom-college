import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "green" | "navy" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  green: "btn-green",
  navy: "btn-navy",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

interface BaseProps {
  variant?: Variant;
  size?: "sm" | "md";
  block?: boolean;
  className?: string;
  children: React.ReactNode;
}

function classes({ variant = "green", size = "md", block, className }: BaseProps) {
  return cn("btn", variants[variant], size === "sm" && "btn-sm", block && "w-full", className);
}

/** Anchor-style button that navigates via next/link. */
export function LinkButton({ href, ...props }: BaseProps & { href: string }) {
  return (
    <Link href={href} className={classes(props)}>
      {props.children}
    </Link>
  );
}

/** Standard <button>. */
export function Button({
  type = "button",
  onClick,
  disabled,
  ...props
}: BaseProps & {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(classes(props), disabled && "opacity-60")}>
      {props.children}
    </button>
  );
}
