"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Light/dark theme switch. The initial class is set by the no-flash script
 * in app/layout.tsx; this component only toggles and persists the choice.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-navy transition hover:border-brand-green hover:text-brand-green dark:border-white/15 dark:text-slate-200 dark:hover:border-brand-green dark:hover:text-brand-green ${className}`}
    >
      {/* Render both icons; CSS decides visibility so SSR markup is stable. */}
      <Sun className="hidden h-[18px] w-[18px] dark:block" />
      <Moon className="block h-[18px] w-[18px] dark:hidden" />
    </button>
  );
}
