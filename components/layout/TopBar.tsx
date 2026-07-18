import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

/** Slim contact/announcement bar above the main navigation. */
export function TopBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="bg-navy text-[0.8rem] text-slate-300">
      <div className="container-x flex flex-wrap items-center justify-between gap-2 py-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-brand-green" /> {settings.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-brand-green" /> {settings.phone1}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="hidden items-center gap-1.5 sm:flex">
            <MapPin className="h-3.5 w-3.5 text-brand-green" /> Rustenburg Campus
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <MapPin className="h-3.5 w-3.5 text-brand-green" /> Brits Campus
          </span>
          <span className="flex items-center gap-3">
            <a href={settings.facebook || "#"} aria-label="Facebook" className="hover:text-white"><Facebook className="h-4 w-4" /></a>
            <a href={settings.instagram || "#"} aria-label="Instagram" className="hover:text-white"><Instagram className="h-4 w-4" /></a>
            <a href={waLink(settings.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-white"><MessageCircle className="h-4 w-4" /></a>
          </span>
        </div>
      </div>
    </div>
  );
}
