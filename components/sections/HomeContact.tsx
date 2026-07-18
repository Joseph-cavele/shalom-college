import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { MapEmbed } from "@/components/layout/MapEmbed";
import type { SiteSettings } from "@/lib/types";

/** Home contact section: map + message form + contact details. */
export function HomeContact({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-slate-50 py-20 dark:bg-navy-900">
      <div className="container-x">
        <h2 className="text-center text-3xl font-extrabold text-navy dark:text-slate-100" data-reveal>Get In Touch</h2>
        <div className="mx-auto mt-2 h-1 w-16 rounded bg-brand-green" />

        <div className="mt-10 grid gap-6 lg:grid-cols-3" data-reveal>
          <MapEmbed address={settings.campus1} title="Campus locations map" />

          <ContactForm />

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-navy-800">
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 flex-none text-brand-green" />
                <div>
                  <div className="font-bold text-navy dark:text-slate-100">Rustenburg Campus</div>
                  <div className="text-slate-500 dark:text-slate-400">{settings.campus1}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 flex-none text-brand-green" />
                <div>
                  <div className="font-bold text-navy dark:text-slate-100">Brits Campus</div>
                  <div className="text-slate-500 dark:text-slate-400">{settings.campus2}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 flex-none text-brand-green" />
                <div className="text-slate-600 dark:text-slate-300">{settings.phone1} · {settings.phone2}</div>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 flex-none text-brand-green" />
                <div className="text-slate-600 dark:text-slate-300">{settings.email}</div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-5 w-5 flex-none text-brand-green" />
                <div className="text-slate-600 dark:text-slate-300">Mon–Fri: 08:00–16:00<br />Saturday: 08:00–13:00</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
