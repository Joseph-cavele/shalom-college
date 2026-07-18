import Link from "next/link";
import { Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { waLink } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const COURSES = [
  ["Engineering Studies", "Engineering Studies"],
  ["Mining & Construction", "Mining & Construction"],
  ["Artisan Skills", "Artisan Practical Skills"],
  ["Computer Courses", "Computer Short Courses"],
  ["Management Courses", "Management Programmes"],
  ["Trade Test Preparation", "Trade Test Preparation"],
];

/** Public site footer with quick links, courses, campuses and contact. */
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-navy pt-14 text-slate-300">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1.2fr_1fr_1.4fr]">
          <div>
            <Logo variant="light" size={52} />
            <p className="mt-4 text-sm">
              Providing accredited practical and theoretical training that empowers students with skills for a better future.
            </p>
            <div className="mt-4 flex gap-3">
              <a href={settings.facebook || "#"} aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-brand-green hover:text-white"><Facebook className="h-4 w-4" /></a>
              <a href={settings.instagram || "#"} aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-brand-green hover:text-white"><Instagram className="h-4 w-4" /></a>
              <a href={waLink(settings.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-brand-green hover:text-white"><MessageCircle className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            {[
              ["/", "Home"],
              ["/about", "About Us"],
              ["/courses", "Courses"],
              ["/apply", "Apply Online"],
              ["/contact", "Contact Us"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="mb-2 block text-sm hover:text-brand-green">{label}</Link>
            ))}
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Courses</h4>
            {COURSES.map(([label, cat]) => (
              <Link key={label} href={`/courses?cat=${encodeURIComponent(cat)}`} className="mb-2 block text-sm hover:text-brand-green">{label}</Link>
            ))}
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Campuses</h4>
            <p className="mb-2 text-sm">Rustenburg Campus</p>
            <p className="text-sm">Brits Campus</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Contact Us</h4>
            <p className="mb-2 flex gap-2 text-sm"><Phone className="h-4 w-4 flex-none text-brand-green" /> {settings.phone1} · {settings.phone2}</p>
            <p className="mb-2 flex gap-2 text-sm"><Mail className="h-4 w-4 flex-none text-brand-green" /> {settings.email}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 py-5 text-center text-[0.82rem]">
          © {settings.established} {settings.schoolName}. All rights reserved. &nbsp;|&nbsp;
          <Link href="/admin/login" className="ml-1 hover:text-brand-green">Staff Login</Link>
        </div>
      </div>
    </footer>
  );
}
