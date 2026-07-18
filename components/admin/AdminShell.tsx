"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Toaster } from "@/components/ui/Toast";

interface AdminShellProps {
  fullName: string;
  children: React.ReactNode;
}

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/courses": "Courses",
  "/admin/messages": "Messages",
  "/admin/content": "Website Content",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
};

/** Client shell: collapsible sidebar + sticky top bar + toast host. */
export function AdminShell({ fullName, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const title =
    TITLES[pathname] ||
    Object.entries(TITLES).find(([k]) => k !== "/admin" && pathname.startsWith(k))?.[1] ||
    "Dashboard";
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />

      {open && <div className="fixed inset-0 z-[80] bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-6 py-3.5 shadow-card">
          <div className="flex items-center gap-3">
            <button className="text-navy md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-navy">{title}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-navy">
            <span className="hidden sm:inline">Welcome, {fullName}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-green font-extrabold text-white">
              {initials}
            </span>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </div>

      <Toaster />
    </div>
  );
}
