import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { MapEmbed } from "@/components/layout/MapEmbed";
import { getSettings } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Shalom Training School — phone, email, WhatsApp or visit our Rustenburg and Brits campuses. We respond to all course enquiries.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  // WhatsApp number comes from .env (PHONE_NUMBER), falling back to site settings.
  const whatsappNumber = process.env.PHONE_NUMBER || settings.whatsapp;
  const whatsappHref = whatsappLink(
    whatsappNumber,
    "Hello Shalom Training School, I would like more information about your courses."
  );
  return (
    <>
      <section className="bg-gradient-to-r from-navy to-navy-light py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold">Contact Us</h1>
        <p className="mt-2 text-slate-300">We&apos;d love to hear from you. Reach out with any questions.</p>
      </section>

      <section className="container-x grid gap-8 py-16 lg:grid-cols-[1fr_340px]">
        <ContactForm />

        <aside className="h-fit rounded-xl bg-navy p-7 text-white">
          <h3 className="text-xl font-bold">Get In Touch</h3>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-3 font-bold text-white transition hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
          </a>
          <p className="mt-2 text-center text-xs text-slate-400">{whatsappNumber}</p>

          <div className="mt-4 flex gap-3 text-sm text-slate-300">
            <Phone className="h-5 w-5 flex-none text-brand-green" />
            <div>{settings.phone3}<br />{settings.phone2}<br />{settings.phone1}</div>
          </div>
          <div className="mt-3 flex gap-3 text-sm text-slate-300">
            <Mail className="h-5 w-5 flex-none text-brand-green" />
            <div>{settings.email}</div>
          </div>
          <div className="mt-3 flex gap-3 text-sm text-slate-300">
            <MapPin className="h-5 w-5 flex-none text-brand-green" />
            <div><b className="text-white">Rustenburg</b><br />{settings.campus1}</div>
          </div>
          <div className="mt-3 flex gap-3 text-sm text-slate-300">
            <MapPin className="h-5 w-5 flex-none text-brand-green" />
            <div><b className="text-white">Brits</b><br />{settings.campus2}</div>
          </div>
        </aside>
      </section>

      <section className="container-x pb-20">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-navy dark:text-slate-100">Find Us On The Map</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div data-reveal>
            <h3 className="mb-2 font-bold text-navy dark:text-slate-100">📍 Rustenburg Campus</h3>
            <MapEmbed address={settings.campus1} title="Rustenburg campus map" />
          </div>
          <div data-reveal data-reveal-delay="120">
            <h3 className="mb-2 font-bold text-navy dark:text-slate-100">📍 Brits Campus</h3>
            <MapEmbed address={settings.campus2} title="Brits campus map" />
          </div>
        </div>
      </section>
    </>
  );
}
