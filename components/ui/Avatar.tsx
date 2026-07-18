/** Initials avatar — always renders, no photo assets required. */
export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  return (
    <span
      aria-hidden
      className={`grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-green/15 text-sm font-extrabold text-brand-green ring-2 ring-brand-green/30 dark:bg-brand-green/20 ${className}`}
    >
      {initials}
    </span>
  );
}
