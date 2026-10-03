"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/apply", label: "Apply Online" },
  { href: "/contact", label: "Contact Us" },
];

/** Sticky primary navigation with a mobile menu. */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 shadow-card backdrop-blur transition-colors dark:bg-navy-900/95 dark:shadow-none dark:ring-1 dark:ring-white/10">
      <div className="container-x flex items-center justify-between py-3">
        <Logo href="/admin/login" />

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            className="text-navy dark:text-slate-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        <div
          className={cn(
            "absolute left-0 right-0 top-full flex-col gap-1 bg-white p-4 shadow-card dark:bg-navy-900 lg:static lg:flex lg:flex-row lg:items-center lg:gap-7 lg:bg-transparent lg:p-0 lg:shadow-none lg:dark:bg-transparent",
            open ? "flex" : "hidden"
          )}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-2 py-2 text-[0.95rem] font-semibold transition hover:text-brand-green lg:p-0",
                pathname === l.href ? "text-brand-green" : "text-navy dark:text-slate-100"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/apply" onClick={() => setOpen(false)} className="btn btn-green btn-sm">
            Apply Now
          </Link>
          <span className="hidden lg:block">
            <ThemeToggle />
          </span>
        </div>
      </div>
    </nav>
  );
}
