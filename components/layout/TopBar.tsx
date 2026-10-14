import { Mail, Phone, MapPin } from "lucide-react";
import { SocialLinks } from "@/components/layout/SocialLinks";
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
          <SocialLinks settings={settings} className="gap-3" itemClassName="hover:text-white" />
        </div>
      </div>
    </div>
  );
}
