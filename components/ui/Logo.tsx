import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  size?: number;
  variant?: "light" | "dark";
  showName?: boolean;
  className?: string;
}

/** Brand logo badge + wordmark, links to a destination (default home). */
export function Logo({ href = "/", size = 48, variant = "dark", showName = true, className }: LogoProps) {
  const nameColor = variant === "light" ? "text-white" : "text-navy dark:text-white";
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)} aria-label="Shalom Training School">
      <Image src="/logo.png" alt="Shalom Training School" width={size} height={size} priority />
      {showName && (
        <span className="leading-tight">
          <span className={cn("block text-base font-extrabold tracking-wide sm:text-lg", nameColor)}>
            Shalom Training School
          </span>
          <span className="block text-[0.62rem] font-semibold tracking-[0.18em] text-brand-green">
            EST 2025
          </span>
        </span>
      )}
    </Link>
  );
}
