import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { RevealObserver } from "@/components/util/RevealObserver";
import { getSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Shared chrome for all public marketing pages. */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  // Structured data so search engines list us as an educational organisation.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.schoolName || "Shalom Training School",
    description:
      "MERSETA accredited practical & theoretical training in engineering, artisan, mining, computer and management courses.",
    email: settings.email || undefined,
    telephone: settings.phone1 || undefined,
    address: [
      settings.campus1 && { "@type": "PostalAddress", streetAddress: settings.campus1, addressCountry: "ZA" },
      settings.campus2 && { "@type": "PostalAddress", streetAddress: settings.campus2, addressCountry: "ZA" },
    ].filter(Boolean),
    sameAs: [settings.facebook, settings.instagram].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RevealObserver />
      <TopBar settings={settings} />
      <Navbar />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phone={settings.whatsapp} />
    </>
  );
}
