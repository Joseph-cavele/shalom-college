"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  FolderOpen,
  BookOpen,
  Mail,
  Image as ImageIcon,
  Settings,
  User,
  LogOut,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout as signOutAction } from "@/app/admin/login/actions";

const NAV: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/applications", icon: ClipboardList, label: "Applications" },
  { href: "/admin/documents", icon: FolderOpen, label: "Documents" },
  { href: "/admin/courses", icon: BookOpen, label: "Courses" },
  { href: "/admin/messages", icon: Mail, label: "Messages" },
  { href: "/admin/content", icon: ImageIcon, label: "Website Content" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
  { href: "/admin/profile", icon: User, label: "Profile" },
];

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await signOutAction();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "fixed z-[90] flex h-screen w-64 flex-none flex-col bg-gradient-to-b from-navy-900 via-navy to-indigo-950 text-slate-300 transition-transform md:sticky md:top-0 md:translate-x-0 print:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <Link href="/admin" className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
        <Image src="/logo.png" alt="" width={44} height={44} className="flex-none" />
        <span className="leading-tight">
          <span className="block text-sm font-extrabold text-white">Shalom Training School</span>
          <span className="block text-[0.55rem] tracking-widest text-brand-green">EST 2025</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-[0.92rem] font-semibold transition",
                active
                  ? "bg-gradient-to-r from-brand-green to-emerald-500 text-white shadow-lg shadow-emerald-900/30"
                  : "hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-none" />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-auto mb-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <Trophy className="mx-auto h-7 w-7 text-brand-gold" />
          <p className="mt-2 text-[0.82rem] font-semibold leading-snug text-white">
            &ldquo;Education is the key to success. Keep learning, keep growing!&rdquo;
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-left text-[0.92rem] font-semibold transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5 flex-none" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
