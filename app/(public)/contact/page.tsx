import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CampusMap } from "@/components/layout/CampusMap";
import { PageHero } from "@/components/layout/PageHero";
import { getSettings } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Shalom Training School — phone, email, WhatsApp or visit our Rustenburg and Brits campuses. We respond to all course enquiries.",
};

const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

function InfoRow({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 border-t border-slate-100 py-5 first:border-t-0 first:pt-0 dark:border-white/10">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-brand-green/10 text-brand-green-dark dark:bg-brand-green/15 dark:text-brand-green">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 text-sm text-slate-500 dark:text-slate-400">
        <h3 className="mb-1 font-bold text-navy dark:text-slate-100">{title}</h3>
        {children}
      </div>
    </li>
  );
}

export default async function ContactPage() {
  const settings = await getSettings();
  // WhatsApp number comes from .env (PHONE_NUMBER), falling back to site settings.
  const whatsappNumber = process.env.PHONE_NUMBER || settings.whatsapp;
  const whatsappHref = whatsappLink(
    whatsappNumber,
    "Hello Shalom Training School, I would like more information about your courses."
  );
  const phones = [settings.phone1, settings.phone2, settings.phone3].filter(Boolean);
  const campuses = [
    { name: "Rustenburg", address: settings.campus1 },
    { name: "Brits", address: settings.campus2 },
  ];

  return (
    <>
      <PageHero
        title="Contact Us"
        crumb="Contact Us"
        intro="We'd love to hear from you. Reach out with any questions."
      />

      <section className="container-x grid items-start gap-8 py-16 lg:grid-cols-[380px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-7 dark:border-white/10 dark:bg-navy-800">
          <h2 className="text-xl font-extrabold text-navy dark:text-slate-100">Contact Information</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Have questions about our courses or need help applying? Call, email or WhatsApp us — or visit one of
            our campuses.
          </p>

          <ul className="mt-6">
            {phones.length > 0 && (
              <InfoRow icon={Phone} title="Phone Numbers">
                {phones.map((p) => (
                  <a key={p} href={tel(p)} className="block transition hover:text-brand-green-dark">
                    {p}
                  </a>
                ))}
              </InfoRow>
            )}
            {settings.email && (
              <InfoRow icon={Mail} title="Email Address">
                <a href={`mailto:${settings.email}`} className="break-all transition hover:text-brand-green-dark">
                  {settings.email}
                </a>
              </InfoRow>
            )}
            {settings.openingHours && (
              <InfoRow icon={Clock} title="Opening Hours">
                <span className="whitespace-pre-line">{settings.openingHours}</span>
              </InfoRow>
            )}
            <InfoRow icon={MapPin} title="Our Campuses">
              {campuses
                .filter((c) => c.address)
                .map((c) => (
                  <p key={c.name} className="mb-2 last:mb-0">
                    <b className="text-navy dark:text-slate-200">{c.name}:</b> {c.address}
                  </p>
                ))}
            </InfoRow>
          </ul>

          {whatsappNumber && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-3 font-bold text-white transition hover:bg-[#1ebe5b]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden /> Chat on WhatsApp
            </a>
          )}
        </aside>

        <ContactForm />
      </section>

      <section className="container-x pb-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green-dark dark:bg-brand-green/15 dark:text-brand-green">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden />
            Our Location
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold text-navy sm:text-3xl dark:text-slate-100">
            Visit Our Campuses For In-Person Enquiries &amp; Registration
          </h2>
        </div>
        <div className="mt-8">
          <CampusMap campuses={campuses} />
        </div>
      </section>
    </>
  );
}
